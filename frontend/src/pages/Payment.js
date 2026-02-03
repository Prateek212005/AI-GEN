import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, price, billingCycle } = location.state || {};
  
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  if (!plan) {
    navigate('/pricing');
    return null;
  }

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Format expiry as MM/YY
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      toast.success('Payment successful!');
      
      setTimeout(() => {
        navigate('/generate');
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-20" data-testid="payment-success">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-[#22C55E] to-[#22D3EE] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-[#9CA3AF] mb-8">
            Your subscription to <span className="text-[#A855F7] font-semibold capitalize">{plan.replace('_', ' ')}</span> has been activated.
          </p>
          <Link
            to="/generate"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            data-testid="payment-success-cta"
          >
            Start Creating
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="payment-title">Complete Your Purchase</h1>
          <p className="text-[#9CA3AF]">Secure payment processing</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-8">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="w-5 h-5 text-[#22C55E]" />
              <span className="text-[#9CA3AF] text-sm">Secure SSL Encrypted Payment</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#A855F7] transition-colors"
                    placeholder="1234 5678 9012 3456"
                    required
                    data-testid="card-number-input"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#A855F7] transition-colors"
                  placeholder="John Doe"
                  required
                  data-testid="card-name-input"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#A855F7] transition-colors"
                    placeholder="MM/YY"
                    required
                    data-testid="card-expiry-input"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#A855F7] transition-colors"
                    placeholder="123"
                    required
                    data-testid="card-cvv-input"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                data-testid="payment-submit-button"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay ${price}</span>
                )}
              </button>
            </form>

            <p className="text-[#6B7280] text-xs text-center mt-6">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-8 mb-6">
              <h3 className="text-white text-lg font-semibold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">Plan</span>
                  <span className="text-white font-semibold capitalize">{plan.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">Billing</span>
                  <span className="text-white capitalize">{billingCycle}</span>
                </div>
                <div className="h-px bg-[#1F2937]"></div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-[#A855F7] font-bold">${price}</span>
                </div>
              </div>

              <div className="bg-[#111827] rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {plan === 'pro' && (
                    <>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>500 credits per month</span>
                      </li>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>Advanced image generation</span>
                      </li>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>Video generation</span>
                      </li>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>Priority support</span>
                      </li>
                    </>
                  )}
                  {plan === 'pro_max' && (
                    <>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>2000 credits per month</span>
                      </li>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>Unlimited generations</span>
                      </li>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>Ultra HD quality</span>
                      </li>
                      <li className="flex items-center space-x-2 text-[#9CA3AF] text-sm">
                        <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                        <span>API access</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Security Badges */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <h4 className="text-white font-semibold mb-4 text-center">Secure Payment</h4>
              <div className="flex items-center justify-center space-x-4 text-[#9CA3AF]">
                <Lock className="w-6 h-6" />
                <span className="text-sm">256-bit SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;