import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { sendBitcoin, getStoredWallet } from '../lib/crypto/wallet';
import { DashboardContext } from '../pages/Dashboard';

interface SendCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockchain: 'bitcoin' | 'ethereum';
}

export default function SendCryptoModal({ isOpen, onClose, blockchain }: SendCryptoModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const { fetchBalances } = React.useContext(DashboardContext);
  const [formData, setFormData] = React.useState({
    address: '',
    amount: ''
  });
  const [wallet, setWallet] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadWallet() {
      if (blockchain === 'bitcoin') {
        const storedWallet = await getStoredWallet('bitcoin');
        if (storedWallet) {
          setWallet(storedWallet.address);
        }
      }
    }
    loadWallet();
  }, [blockchain]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (blockchain === 'bitcoin') {
        if (!wallet) {
          throw new Error('No wallet found');
        }

        const txHash = await sendBitcoin(
          wallet,
          formData.address,
          parseFloat(formData.amount)
        );
        console.log('Transaction hash:', txHash);
        setSuccess(true);
        await fetchBalances();
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ address: '', amount: '' });
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending crypto:', err);
      setError(err.message || 'Failed to send cryptocurrency');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
          Send {blockchain === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <div className="relative">
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={blockchain === 'bitcoin' ? 'Enter BTC address' : 'Enter ETH address'}
              required
            />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {blockchain === 'bitcoin' ? 'Enter a valid Bitcoin address' : 'Enter a valid Ethereum address'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
            <input
              type="number"
              step="0.00000001"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{blockchain === 'bitcoin' ? 'BTC' : 'ETH'}</span>
            </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter the amount to send in {blockchain === 'bitcoin' ? 'Bitcoin' : 'Ethereum'}
            </p>
          </div>

          {wallet && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                Sending from: <span className="font-mono text-xs">{wallet}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg text-center">
              Transaction sent successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}