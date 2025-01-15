import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';

export default function TerminalPurchase() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    // Here you would integrate with your payment processor
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setLoading(false);
      // Navigate to success page or show success message
      alert('Purchase successful! We will contact you about shipping details.');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center">
            <Terminal className="h-6 w-6 text-indigo-600 mr-2" />
            <span className="font-semibold text-gray-900">Terminal Purchase</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="aspect-w-16 aspect-h-9 mb-8">
              <img
                src="https://ivpay.io/_next/image?url=%2Fproduct-pos.png&w=3840&q=75"
                alt="Crypto Payment Terminal"
                className="rounded-xl object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Crypto Payment Terminal
            </h1>
            
            <div className="prose text-gray-600 mb-8">
              <p>
                Start accepting cryptocurrency payments in your store with our secure and easy-to-use
                POS terminal. The hardware is provided free of charge with a refundable security deposit.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Terminal className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Hardware</h3>
                  <p className="text-sm text-gray-600">
                    Terminal is provided free of charge with your subscription
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Refundable Deposit</h3>
                  <p className="text-sm text-gray-600">
                    $100 security deposit, fully refundable upon return
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                  <p className="text-sm text-gray-600">
                    We'll ship the terminal to your business address for free
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Security Deposit</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center py-4 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-900">Refundable Deposit</h3>
                  <p className="text-sm text-gray-600">Returned when terminal is sent back</p>
                </div>
                <span className="text-2xl font-bold text-gray-900">$100.00</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-gray-600 text-sm mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure Payment</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your deposit is fully refundable when you return the terminal in good condition.
                  The hardware itself is provided free of charge.
                </p>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Terminal className="h-5 w-5" />
                  <span>Pay Deposit & Get Terminal</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By proceeding, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}