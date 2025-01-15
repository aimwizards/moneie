import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, Mail, Lock, Phone, MapPin, Briefcase, Globe } from 'lucide-react';

export default function GetStarted() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    businessName: '',
    businessType: '',
    address: '',
    phone: '',
    website: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create business profile
        const { error: profileError } = await supabase
          .from('business_profiles')
          .insert([
            {
              user_id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              business_name: formData.businessName,
              business_type: formData.businessType,
              address: formData.address,
              phone: formData.phone,
              website: formData.website
            }
          ]);

        if (profileError) throw profileError;

        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <span className="text-3xl font-extrabold">
                <span className="text-gray-900">Mon</span>
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                  <span className="relative text-gray-900">eie</span>
                </span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <span className="text-3xl font-extrabold">
                <span className="text-gray-900">Mon</span>
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                  <span className="relative text-gray-900">eie</span>
                </span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Your Business Name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., Retail, Restaurant, Services"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <span className="text-3xl font-extrabold">
                <span className="text-gray-900">Mon</span>
                <span className="relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 animate-gradient-x opacity-50"></span>
                  <span className="relative text-gray-900">eie</span>
                </span>
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Full Business Address"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s === step
                      ? 'bg-indigo-600 text-white'
                      : s < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="absolute left-0 top-1/2 h-0.5 bg-gray-200 w-full -translate-y-1/2" />
              <div
                className="absolute left-0 top-1/2 h-0.5 bg-indigo-600 -translate-y-1/2 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-8">
            {renderStep()}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(s => s - 1)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}