import type { DemoBalance, DemoTransaction, WalletResponse } from './types';
import { supabase } from '../supabase';

const BLOCKCYPHER_API = 'https://api.blockcypher.com/v1/btc/main';
const BLOCKCYPHER_TOKEN = '00668986134e4ab592eda58f963d92f4';

export async function sendBitcoin(fromAddress: string, toAddress: string, amount: number): Promise<string> {
  try {
    // First check if address has any balance
    const balanceResponse = await fetch(
      `${BLOCKCYPHER_API}/addrs/${fromAddress}/balance?token=${BLOCKCYPHER_TOKEN}`
    );

    if (!balanceResponse.ok) {
      throw new Error('Failed to check wallet balance');
    }

    const balanceData = await balanceResponse.json();
    const balanceBTC = balanceData.final_balance / 100000000; // Convert satoshis to BTC

    if (balanceBTC < amount) {
      throw new Error(`Insufficient balance. Available: ${balanceBTC} BTC`);
    }

    // Calculate fee (approximate)
    const feePerByte = 20; // satoshis per byte
    const estimatedSize = 250; // bytes (approximate size for a typical transaction)
    const estimatedFee = (feePerByte * estimatedSize) / 100000000; // Convert to BTC

    if (balanceBTC < (amount + estimatedFee)) {
      throw new Error(`Insufficient balance to cover amount plus fees. Available: ${balanceBTC} BTC, Required: ${amount + estimatedFee} BTC`);
    }

    // Create new transaction
    const newTxResponse = await fetch(`${BLOCKCYPHER_API}/txs/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: [{ 
          addresses: [fromAddress],
          value: Math.floor((amount + estimatedFee) * 100000000) // Include fee in input
        }],
        preference: 'medium', // Set fee preference
        outputs: [{ addresses: [toAddress], value: Math.floor(amount * 100000000) }], // Convert BTC to satoshis
        token: BLOCKCYPHER_TOKEN
      })
    });

    if (!newTxResponse.ok) {
      const error = await newTxResponse.text();
      throw new Error(`Failed to create transaction: ${error}`);
    }

    const newTx = await newTxResponse.json();
    
    // Get the stored wallet to sign the transaction
    const wallet = await getStoredWallet('bitcoin');
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    // Sign each input
    newTx.pubkeys = [];
    newTx.signatures = [];
    
    // Here you would normally sign the transaction with the private key
    // For demo purposes, we'll just simulate a successful transaction
    const signedTx = newTx;

    // Send the signed transaction
    const sendTxResponse = await fetch(`${BLOCKCYPHER_API}/txs/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(signedTx)
    });

    if (!sendTxResponse.ok) {
      const error = await sendTxResponse.text();
      throw new Error(`Failed to send transaction: ${error}`);
    }

    const finalTx = await sendTxResponse.json();
    return finalTx.tx.hash;
  } catch (error) {
    console.error('Error sending Bitcoin:', error);
    throw error;
  }
}

export async function getStoredWallet(blockchain: string): Promise<WalletResponse | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .eq('blockchain', blockchain)
    .single();

  if (wallet) {
    return {
      private: wallet.private_key,
      public: '', // Not stored in DB
      address: wallet.address,
      wif: wallet.wif || ''
    };
  }
  return null;
}

export async function storeWallet(blockchain: string, wallet: WalletResponse): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('wallets')
    .insert({
      user_id: user.id,
      blockchain,
      address: wallet.address,
      private_key: wallet.private,
      wif: wallet.wif
    });

  if (error) throw error;
}

export async function createBitcoinWallet(): Promise<WalletResponse> {
  try {
    // Check if we already have a stored wallet
    const storedWallet = await getStoredWallet('bitcoin');
    if (storedWallet) {
      return storedWallet;
    }

    // If no stored wallet, create a new one
    const response = await fetch(`${BLOCKCYPHER_API}/addrs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create wallet: ${errorText}`);
    }
    
    const data = await response.json();
    // Store the new wallet
    await storeWallet('bitcoin', {
      private: data.private,
      public: data.public,
      address: data.address,
      wif: data.wif
    });
    console.log('Wallet created:', data);

    return {
      private: data.private,
      public: data.public,
      address: data.address,
      wif: data.wif
    };
  } catch (error) {
    console.error('Error creating Bitcoin wallet:', error);
    throw error;
  }
}

export async function getBitcoinBalance(address: string): Promise<{ balance: number; usdValue: string }> {
  try {
    const response = await fetch(
      `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${BLOCKCYPHER_TOKEN}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch balance: ${errorText}`);
    }

    const data = await response.json();
    console.log('Balance data:', data);

    // Get current BTC price in USD
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const priceData = await priceResponse.json();
    const btcPrice = priceData.bitcoin.usd;

    // Convert satoshis to BTC
    const balanceBTC = data.final_balance / 100000000;
    return { balance: balanceBTC, usdValue: `$${(balanceBTC * btcPrice).toFixed(2)}` };
  } catch (error) {
    console.error('Error fetching Bitcoin balance:', error);
    throw error;
  }
}
// Demo data for UI purposes
export async function getDemoBalances(): Promise<DemoBalance[]> {
  try {
    // Get Bitcoin balance from local storage
    const btcAddress = localStorage.getItem('btcAddress');
    if (!btcAddress) {
      throw new Error('No Bitcoin address found');
    }

    const btcBalance = await getBitcoinBalance(btcAddress);
    
    return [
      {
        amount: `${btcBalance.balance.toFixed(8)} BTC`,
        usdValue: btcBalance.usdValue
      },
      {
        amount: '1.245 ETH',
        usdValue: '$2,865.34'
      }
    ];
  } catch (error) {
    console.error('Error fetching balances:', error);
    return [{
      amount: '0.0000 BTC',
      usdValue: '$0.00'
    }, {
      amount: '0.000 ETH',
      usdValue: '$2,865.34'
    }];
  }
}

export async function getDemoTransactions(): Promise<DemoTransaction[]> {
  return [
    {
      id: '1',
      type: 'Payment Received',
      amount: '0.0025 BTC',
      usdAmount: '$108.75',
      time: '2 minutes ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'Converted to USD',
      amount: '250 USDC',
      usdAmount: '$250.00',
      time: '15 minutes ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'Payment Received',
      amount: '0.15 ETH',
      usdAmount: '$345.67',
      time: '1 hour ago',
      status: 'completed'
    }
  ];
}