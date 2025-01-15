import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, CreditCard, Wallet, Menu, QrCode, ArrowRightLeft, LineChart, Receipt, BarChart3, Calculator, Building2 } from 'lucide-react';

const StepContent = ({ step }: { step: number }) => {
  const contents = [
    {
      title: "Easy-to-Use Dashboard",
      description: "Track all your store's crypto payments in one simple screen. See your daily sales, most popular payment methods, and how your business is growing.",
      features: [
        "See payments as they happen",
        "Simple daily and monthly reports",
        "Track customer purchases",
        "View your store's performance"
      ],
      icon: BarChart3,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Free Payment Terminal",
      description: "Get a free, ready-to-use payment device for your store. Customers simply scan a code with their phone to pay in crypto - just like using a regular card terminal.",
      features: [
        "Works right out of the box",
        "Accept Bitcoin and other popular cryptocurrencies",
        "Simple scan-to-pay system",
        "Instant payment confirmation"
      ],
      icon: Terminal,
      image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Automatic Tax & Receipts",
      description: "Never worry about crypto tax calculations again. We handle all the math and create professional receipts for every sale automatically.",
      features: [
        "Tax is calculated for you",
        "Professional receipts for every sale",
        "Easy tax reports for your accountant",
        "Everything follows tax rules"
      ],
      icon: Calculator,
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Get Paid in Regular Money",
      description: "Don't worry about holding crypto - we can automatically convert it to regular money and send it straight to your bank account.",
      features: [
        "Best exchange rates",
        "Quick transfer to your bank",
        "Choose your preferred currency",
        "Automatic daily deposits"
      ],
      icon: Building2,
      image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    }
  ];

  const content = contents[step];
  const Icon = content.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Icon className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{content.title}</h3>
        </div>
        
        <p className="text-xl text-gray-600">{content.description}</p>
        
        <div className="space-y-4">
          {content.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-10 blur-lg" />
        <img
          src={content.image}
          alt={content.title}
          className="relative rounded-2xl shadow-lg w-full h-[400px] object-cover"
        />
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full top-0 z-50 transition-colors duration-200 ${
      isScrolled ? 'bg-white/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="ml-3 text-2xl font-extrabold">
              <span className="text-gray-900">Mon</span>
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                <span className="relative text-gray-900">eie</span>
              </span>
            </span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/sign-in')}
              className="hidden md:block px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in
            </button>
            <button 
              onClick={() => navigate('/get-started')}
              className="hidden md:block px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Get Started
            </button>
            <button className="md:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <div className="min-h-screen bg-white">

      <Header />
      
      <main className="pt-16">
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Transform Your Store</span>
                  <br />
                  <span className="text-gray-900">
                    with Crypto Payments
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-2xl">
                  Seamlessly accept cryptocurrency payments in your retail store with our all-in-one POS system. Track transactions, manage receipts, and grow your business.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
                    Start Free Trial
                  </button>
                  <button className="px-8 py-4 text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                    Watch Demo
                  </button>
                </div>
              </div>
              
              {/* Terminal Preview */}
              <div className="relative">
                <div className="relative">
                  {/* Payment Tracking Interface */}
                  <div className="relative w-[500px]">
                    <div className="absolute -inset-0.5 bg-gray-900 rounded-xl blur-[2px] opacity-10" />
                    <div className="relative bg-white p-4 rounded-xl shadow-lg transform translate-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <LineChart className="h-6 w-6 text-indigo-600" />
                          <span className="font-bold text-xl text-gray-900">Daily Analytics</span>
                        </div>
                        <div className="flex space-x-4">
                          <Receipt className="h-6 w-6 text-indigo-600" />
                          <Terminal className="h-6 w-6 text-indigo-600" />
                          <CreditCard className="h-6 w-6 text-indigo-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Today's Sales</div>
                          <div className="text-2xl font-bold text-indigo-600">$2,845.95</div>
                          <div className="mt-2 text-xs text-gray-500">+12.5% from yesterday</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600 mb-1">Crypto Received</div>
                          <div className="text-2xl font-bold text-purple-600">0.0654 BTC</div>
                          <div className="mt-2 text-xs text-gray-500">≈ $2,845.95 USD</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Sales Progress</span>
                            <span className="font-medium text-indigo-600">75%</span>
                          </div>
                          <div className="h-2 bg-indigo-100 rounded-full">
                            <div className="h-2 bg-indigo-600 rounded-full animate-pulse" style={{ width: '75%' }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Transactions</div>
                            <div className="font-bold text-gray-900">24</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Tax (15%)</div>
                            <div className="font-bold text-gray-900">$426.89</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">Avg. Sale</div>
                            <div className="font-bold text-gray-900">$118.58</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* QR Payment Terminal */}
                  <div className="absolute top-8 -right-20 w-[250px] animate-fade-alternate">
                    <div className="absolute -inset-0.5 bg-gray-900 rounded-xl blur-[2px] opacity-10" />
                    <div className="relative bg-white p-4 rounded-xl shadow-lg transform -translate-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <QrCode className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="font-medium text-gray-900">Quick Pay</span>
                      </div>
                      <div className="text-sm text-gray-500 animate-pulse">
                        <span className="font-medium">09:45</span>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 
                        alt="Bitcoin Payment QR Code" 
                        className="w-24 h-24"
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Amount Due:</span>
                        <span className="font-bold text-indigo-600">$249.99</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Payment Method:</span>
                        <span>BTC, ETH, USDC</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Order ID:</span>
                        <span>#8294-5675</span>
                      </div>
                    </div>
                  </div>
                  </div>
                  
                  {/* Crypto-Fiat Conversion */}
                  <div className="absolute top-8 -right-20 w-[280px] animate-fade-alternate-reverse">
                    <div className="absolute -inset-0.5 bg-gray-900 rounded-xl blur-[2px] opacity-10" />
                    <div className="relative bg-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
                        <span className="font-medium text-gray-900">Sell to Bank</span>
                      </div>
                      <span className="text-xs text-green-500">Instant Transfer</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">Sell BTC</span>
                            <div className="font-bold text-gray-900">1 BTC = $43,567.89</div>
                          </div>
                          <span className="text-xs text-indigo-600">Sell Now</span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">Sell ETH</span>
                            <div className="font-bold text-gray-900">1 ETH = $2,298.45</div>
                          </div>
                          <span className="text-xs text-indigo-600">Sell Now</span>
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">Sell USDC</span>
                            <div className="font-bold text-gray-900">1 USDC = $1.00</div>
                          </div>
                          <span className="text-xs text-indigo-600">Sell Now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Terminal Showcase Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Terminal Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://ivpay.io/_next/image?url=%2Fproduct-pos.png&w=3840&q=75"
                  alt="CoinPay Terminal"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            
            {/* Terminal Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Powerful Terminal, <br />Simple Interface
                </h2>
                <div className="w-20 h-1 bg-indigo-600 rounded-full"></div>
              </div>
              
              <p className="text-xl text-gray-600">
                Our sleek POS terminal combines powerful features with an intuitive interface, making crypto transactions as simple as traditional payments.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Terminal className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use Interface</h3>
                    <p className="text-gray-600">Touch-screen display with intuitive navigation and quick-access features for common transactions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <QrCode className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant QR Payments</h3>
                    <p className="text-gray-600">Generate QR codes instantly for any cryptocurrency payment, compatible with all major crypto wallets.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Receipt className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Built-in Receipt Printer</h3>
                    <p className="text-gray-600">Print professional receipts with detailed transaction information, including crypto and fiat amounts.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <button className="px-8 py-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                  <span>Terminal Included</span>
                  <span className="px-2 py-1 bg-indigo-500 rounded text-xs font-medium">FREE</span>
                </button>
                <a href="#" className="text-gray-900 font-medium hover:text-indigo-600 transition-colors flex items-center space-x-2">
                  <span>View Specifications</span>
                  <ArrowRightLeft className="h-4 w-4" />
                </a>
              </div>
              <p className="text-sm text-gray-500 italic">
                * Hardware terminal included with all business plans at no additional cost
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Interactive Steps Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Four Simple Steps to Accept Crypto Payments
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to start accepting crypto payments in your store - no technical knowledge required.
            </p>
          </div>
          
          {/* Steps Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[0, 1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeStep === step
                    ? 'bg-gray-900 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Step {step + 1}
              </button>
            ))}
          </div>
          
          {/* Step Content */}
          <div className="transition-all duration-500">
            <StepContent step={activeStep} />
          </div>
        </div>
      </section>
      
      {/* Transparency Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Simple Transaction-Based Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No monthly fees, no hidden costs - just a simple percentage per transaction.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6 mb-8">
              <div className="flex-shrink-0">
                <span className="text-2xl font-extrabold">
                  <span className="text-gray-900">Mon</span>
                  <span className="relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                    <span className="relative text-gray-900">eie</span>
                  </span>
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">2.95% Per Transaction</h3>
                <p className="text-gray-600">
                  Only pay when you get paid. No monthly fees, no setup costs, no hidden charges.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <div>
                  <span className="font-medium text-gray-900">Free Terminal</span>
                  <p className="text-sm text-gray-600">Hardware included at no extra cost</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <div>
                  <span className="font-medium text-gray-900">No Setup Fees</span>
                  <p className="text-sm text-gray-600">Start accepting crypto instantly</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <div>
                  <span className="font-medium text-gray-900">24/7 Support</span>
                  <p className="text-sm text-gray-600">Free technical assistance</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                <div>
                  <span className="font-medium text-gray-900">Cancel Anytime</span>
                  <p className="text-sm text-gray-600">No long-term contracts</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing Example</h4>
              <p className="text-gray-600">
                For a $100 sale, you pay just $2.95 in fees. That's it. No monthly charges, no hidden fees.
                Keep more of your earnings with our simple, transparent pricing model.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button className="relative px-8 py-4 text-white rounded-lg overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 transition-transform duration-300 group-hover:scale-105"></div>
              <span className="relative font-medium">Get Started - No Setup Fees</span>
            </button>
            <p className="mt-4 text-sm text-gray-500">
              2.95% per transaction • Free terminal • 24/7 support • Cancel anytime
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center">
                <span className="text-2xl font-extrabold">
                  <span className="text-gray-900">Mon</span>
                  <span className="relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                    <span className="relative text-gray-900">eie</span>
                  </span>
                </span>
              </div>
              <p className="text-gray-600">
                Transforming retail stores with seamless crypto payment solutions. Making cryptocurrency transactions as simple as cash.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                Legal
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-100 py-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Moneie. All rights reserved. Cryptocurrency payments made simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;