export interface BlockCypherWallet {
  token: string;
  name: string;
  addresses: string[];
}

export interface DemoBalance {
  amount: string;
  usdValue: string;
}

export interface DemoTransaction {
  id: string;
  type: string;
  amount: string;
  usdAmount: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletResponse {
  private: string;
  public: string;
  address: string;
  wif: string;
}