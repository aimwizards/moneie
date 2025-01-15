import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getDemoBalances, getDemoTransactions } from '../lib/crypto/wallet';
import type { DemoBalance, DemoTransaction } from '../lib/crypto/types';
import SendCryptoModal from '../components/SendCryptoModal';
import ReceiveCryptoModal from '../components/ReceiveCryptoModal';
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  Receipt,
  Settings,
  LogOut,
  Building2,
  LineChart,
  TrendingUp,
  DollarSign,
  Terminal,
  Bitcoin,
  Coins,
  CircleDollarSign,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface BusinessProfile {
  id: string;
  business_name: string;
  business_type: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  website?: string;
}

export const DashboardContext = React.createContext<{
  fetchBalances: () => Promise<void>;
}>({
  fetchBalances: async () => {},
});

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<BusinessProfile | null>(null);
  const [activeSection, setActiveSection] = React.useState('overview');
  const [moonPaySdk, setMoonPaySdk] = React.useState<any>(null);
  const [loadingBalances, setLoadingBalances] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [balances, setBalances] = React.useState<DemoBalance[]>([]);
  const [transactions, setTransactions] = React.useState<DemoTransaction[]>([]);
  const [sendModalOpen, setSendModalOpen] = React.useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = React.useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = React.useState<'bitcoin' | 'ethereum'>('bitcoin');

  const fetchBalances = React.useCallback(async () => {
    setLoadingBalances(true);
    setError(null);
    
    try {
      const balanceData = await getDemoBalances();
      const transactionData = await getDemoTransactions();
      setBalances(balanceData);
      setTransactions(transactionData);
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError(err.message || 'Failed to fetch crypto balances');
    } finally {
      setLoadingBalances(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeSection === 'crypto') {
      fetchBalances();
    }
  }, [activeSection, fetchBalances]);

  React.useEffect(() => {
    if (window.MoonPayWebSdk) {
      const sdk = window.MoonPayWebSdk.init({
        flow: 'sell',
        environment: 'sandbox',
        variant: 'overlay',
        params: {
          apiKey: 'pk_test_key',
          theme: 'dark',
          quoteCurrencyCode: 'usd',
          baseCurrencyAmount: '.01',
          defaultBaseCurrencyCode: 'eth'
        },
        debug: true
      });
      setMoonPaySdk(sdk);
    }
  }, []);

  const handleSellCrypto = async () => {
    if (moonPaySdk) {
      try {
        await moonPaySdk.showModal();
      } catch (error) {
        console.error('Error opening MoonPay modal:', error);
      }
    }
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/sign-in');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'payments', label: 'Payments', icon: Receipt },
    { id: 'crypto', label: 'Crypto Holdings', icon: Wallet },
    { id: 'exchange', label: 'Exchange', icon: ArrowRightLeft },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-8 rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
              <div className="relative flex justify-between items-start">
                <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {profile?.first_name}!
                </h2>
                <p className="text-white/80">
                  Here's what's happening with {profile?.business_name} today.
                </p>
                </div>
                <button
                  onClick={() => navigate('/terminal-purchase')}
                  className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl text-white hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <Terminal className="w-5 h-5" />
                  <span>Get Terminal</span>
                </button>
              </div>
            </div>

            {/* Terminal Promotion */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">Start Accepting Crypto Payments</h3>
                    <p className="text-gray-600 max-w-xl">
                      Get our secure POS terminal to start accepting cryptocurrency payments in your store. 
                      Includes free hardware with $100 refundable deposit.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Free hardware terminal
                      </li>
                      <li className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        $100 refundable deposit
                      </li>
                      <li className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Instant crypto payments
                      </li>
                      <li className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        24/7 support included
                      </li>
                    </ul>
                    <button
                      onClick={() => navigate('/terminal-purchase')}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <Terminal className="w-5 h-5" />
                      <span>Get Your Terminal</span>
                    </button>
                  </div>
                  <img
                    src="https://ivpay.io/_next/image?url=%2Fproduct-pos.png&w=3840&q=75"
                    alt="Crypto Payment Terminal"
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="bg-green-100 rounded-full p-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Today's Sales</p>
                <h3 className="text-2xl font-bold text-gray-900">$2,854.85</h3>
                <p className="text-xs text-green-500 mt-1">+12.5% from yesterday</p>
              </div>

              <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
                      alt="Bitcoin"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <LineChart className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">BTC Balance</p>
                <h3 className="text-2xl font-bold text-gray-900">0.0654 BTC</h3>
                <p className="text-xs text-gray-500 mt-1">≈ $2,845.95 USD</p>
              </div>

              <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <img 
                      src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                      alt="Ethereum"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <LineChart className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">ETH Balance</p>
                <h3 className="text-2xl font-bold text-gray-900">1.245 ETH</h3>
                <p className="text-xs text-gray-500 mt-1">≈ $2,865.34 USD</p>
              </div>

              <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CircleDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <LineChart className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">USDC Balance</p>
                <h3 className="text-2xl font-bold text-gray-900">5,421.00 USDC</h3>
                <p className="text-xs text-gray-500 mt-1">≈ $5,421.00 USD</p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  {
                    id: 1,
                    type: 'Payment Received',
                    amount: '0.0025 BTC',
                    usdAmount: '$108.75',
                    time: '2 minutes ago',
                    status: 'completed'
                  },
                  {
                    id: 2,
                    type: 'Converted to USD',
                    amount: '250 USDC',
                    usdAmount: '$250.00',
                    time: '15 minutes ago',
                    status: 'completed'
                  },
                  {
                    id: 3,
                    type: 'Payment Received',
                    amount: '0.15 ETH',
                    usdAmount: '$345.67',
                    time: '1 hour ago',
                    status: 'completed'
                  }
                ].map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{transaction.amount}</p>
                        <p className="text-sm text-gray-500">{transaction.usdAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
              
              {/* Daily Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Today's Payments</span>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$2,854.85</div>
                  <div className="text-sm text-green-500">24 transactions</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-xl border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Pending</span>
                    <Clock className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$345.00</div>
                  <div className="text-sm text-orange-500">3 transactions</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-6 rounded-xl border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Failed</span>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">$0.00</div>
                  <div className="text-sm text-red-500">0 transactions</div>
                </div>
              </div>
              
              {/* Transaction List */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    customer: 'John D.',
                    amount: '0.0025 BTC',
                    usdAmount: '$108.75',
                    time: '2 minutes ago',
                    status: 'completed',
                    type: 'Bitcoin'
                  },
                  {
                    id: 2,
                    customer: 'Sarah M.',
                    amount: '0.15 ETH',
                    usdAmount: '$345.67',
                    time: '15 minutes ago',
                    status: 'completed',
                    type: 'Ethereum'
                  },
                  {
                    id: 3,
                    customer: 'Alex K.',
                    amount: '250 USDC',
                    usdAmount: '$250.00',
                    time: '1 hour ago',
                    status: 'pending',
                    type: 'USDC'
                  },
                  {
                    id: 4,
                    customer: 'Mike R.',
                    amount: '0.0015 BTC',
                    usdAmount: '$65.25',
                    time: '2 hours ago',
                    status: 'completed',
                    type: 'Bitcoin'
                  }
                ].map((transaction) => (
                  <div key={transaction.id} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'Bitcoin' ? 'bg-purple-100' :
                          transaction.type === 'Ethereum' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                          {transaction.type === 'Bitcoin' ? (
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
                              alt="Bitcoin"
                              className="h-6 w-6 object-contain"
                            />
                          ) : transaction.type === 'Ethereum' ? (
                            <img 
                              src="https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                              alt="Ethereum"
                              className="h-6 w-6 object-contain"
                            />
                          ) : (
                            <CircleDollarSign className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.customer}</p>
                          <p className="text-sm text-gray-500">{transaction.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{transaction.amount}</p>
                        <p className="text-sm text-gray-500">{transaction.usdAmount}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      } group-hover:shadow-sm transition-shadow`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-8 rounded-2xl shadow-lg mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Crypto Holdings</h2>
              <p className="text-white/80">Manage your cryptocurrency assets</p>
            </div>
            
            {loadingBalances ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center text-red-600">{error}</div>
              </div>
            ) : balances.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Wallet className="h-8 w-8 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">No Crypto Holdings</h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    You haven't received any cryptocurrency payments yet. When customers pay with crypto, their payments will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {balances.map((balance, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                          <img 
                            src={index === 0 
                              ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1200px-Bitcoin.svg.png"
                              : "https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png"
                            }
                            alt={index === 0 ? "Bitcoin" : "Ethereum"}
                            className="h-8 w-8 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {index === 0 ? 'Bitcoin' : 'Ethereum'} Wallet
                          </h3>
                          <p className="text-sm text-gray-500">
                            {balance.amount} ≈ {balance.usdValue}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedBlockchain(index === 0 ? 'bitcoin' : 'ethereum');
                            setSendModalOpen(true);
                          }}
                          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBlockchain(index === 0 ? 'bitcoin' : 'ethereum');
                            setReceiveModalOpen(true);
                          }}
                          className="px-6 py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                        >
                          Receive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <SendCryptoModal
              isOpen={sendModalOpen}
              onClose={() => setSendModalOpen(false)}
              blockchain={selectedBlockchain}
            />
            <ReceiveCryptoModal
              isOpen={receiveModalOpen}
              onClose={() => setReceiveModalOpen(false)}
              blockchain={selectedBlockchain}
            />
          </div>
        );

      case 'exchange':
        return (
          <div className="space-y-6">
            <div className="bg-white p-12 rounded-2xl shadow-lg text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <ArrowRightLeft className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">No Funds to Exchange</h2>
              <p className="text-gray-600 max-w-md mx-auto mt-2">
                You don't have any cryptocurrency to exchange yet. Once you receive crypto payments, you can instantly exchange them to your bank account.
              </p>
              <div className="mt-6">
                <button
                  className="px-6 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md"
                  disabled
                >
                  Exchange to Bank Account
                </button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profile?.business_name}</h2>
                  <p className="text-gray-600">{profile?.business_type}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={profile?.business_name}
                    readOnly
                    className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profile?.first_name}
                      readOnly
                      className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profile?.last_name}
                      readOnly
                      className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={profile?.address}
                    readOnly
                    className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profile?.phone}
                    readOnly
                    className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                  />
                </div>

                {profile?.website && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={profile.website}
                      readOnly
                      className="block w-full rounded-lg border border-gray-300 py-3 px-4 bg-gray-50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContext.Provider value={{ fetchBalances }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-extrabold">
                <span className="text-gray-900">Mon</span>
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                  <span className="relative text-gray-900">eie</span>
                </span>
              </span>
              <div className="hidden md:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`
                        px-3 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium
                        ${activeSection === item.id
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-6">
            {/* Mobile Navigation */}
            <div className="md:hidden mb-8">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full rounded-lg border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {navigationItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
      </DashboardContext.Provider>
    </div>
  );
}