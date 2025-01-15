import React from 'react';
import { X, Copy } from 'lucide-react';
import { createBitcoinWallet, getBitcoinBalance, getStoredWallet } from '../lib/crypto/wallet';
import type { WalletResponse } from '../lib/crypto/types';
import { DashboardContext } from '../pages/Dashboard';

interface ReceiveCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockchain: 'bitcoin' | 'ethereum';
}

export default function ReceiveCryptoModal({ isOpen, onClose, blockchain }: ReceiveCryptoModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [wallet, setWallet] = React.useState<WalletResponse | null>(null);
  const [balance, setBalance] = React.useState<{ balance: number; usdValue: string } | null>(null);
  const { fetchBalances } = React.useContext(DashboardContext);

  React.useEffect(() => {
    async function generateWallet() {
      if (blockchain === 'bitcoin' && isOpen) {
        setLoading(true);
        setError(null);
        try {
          // This will either get existing wallet from Supabase or create new one
          const wallet = await createBitcoinWallet();
          setWallet(wallet);
          
          // Get initial balance
          if (wallet) {
            try {
              const initialBalance = await getBitcoinBalance(wallet.address);
              setBalance(initialBalance);
            } catch (balanceError) {
              console.error('Error fetching initial balance:', balanceError);
            }
          }
          
          await fetchBalances();
        } catch (err) {
          setError('Failed to generate wallet. Please try again.');
          console.error('Wallet generation error:', err);
        } finally {
          setLoading(false);
        }
      }
    }

    generateWallet();
  }, [blockchain, isOpen]);

  const handleCopy = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Receive {blockchain === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}
        </h2>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your {blockchain === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={blockchain === 'bitcoin' ? wallet?.address || '' : '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'}
                  readOnly
                  className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            {blockchain === 'bitcoin' && wallet && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Private Key (Keep this secret!)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={wallet.private}
                      readOnly
                      className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(wallet.private)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WIF (Wallet Import Format)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={wallet.wif}
                      readOnly
                      className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(wallet.wif)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Share this address to receive {blockchain === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} payments. 
                Only send {blockchain === 'bitcoin' ? 'Bitcoin' : 'Ethereum'} to this address. 
                {balance !== null && blockchain === 'bitcoin' && (
                  <span className="block mt-2 font-medium">
                    Current Balance: {balance.balance.toFixed(8)} BTC (≈ {balance.usdValue})
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}