import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, X, QrCode, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Subscription } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription;
  onActivateSubscription: (paymentMethod: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onActivateSubscription,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [upiId, setUpiId] = useState('student@upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onActivateSubscription(selectedMethod === 'upi' ? `UPI (${upiId})` : selectedMethod === 'qr' ? 'UPI QR Scan' : 'Debit Card');
        setPaymentSuccess(false);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800">
        
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-indigo-600 to-cyan-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Student Educational Pass</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              ₹1 <span className="text-base font-semibold text-slate-500">/ month</span>
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Unlimited Mock Tests, Topic Selection & 24/7 AI Solution Assistant
            </p>
          </div>

          {paymentSuccess ? (
            <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-emerald-900">Subscription Active!</h3>
              <p className="text-xs text-slate-700 font-medium">
                ₹1 Payment successful. Transaction ID: <span className="font-mono text-emerald-700 font-bold">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
              </p>
            </div>
          ) : (
            <>
              {/* Status Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold">Current Plan Status</p>
                  <p className="text-sm font-extrabold text-slate-900">
                    {subscription.isActive ? 'Active Student Pass' : 'Expired / Not Active'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  subscription.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {subscription.isActive ? 'Active' : '₹1 / Mo Due'}
                </span>
              </div>

              {/* Perks List */}
              <div className="space-y-2.5 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Schedule Test Appointments & Mock Exam Sessions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Choose Custom Subjects & Micro-Topics (Math, Physics, CS, etc.)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 AI Assistant to explain solutions step-by-step</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Detailed Analytics & Subject Mastery Reports</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select ₹1 Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'upi' ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>UPI App</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('qr')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'qr' ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-cyan-600" />
                    <span>Scan QR</span>
                  </button>

                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      selectedMethod === 'card' ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-950 shadow-2xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Card / Net</span>
                  </button>
                </div>

                {selectedMethod === 'upi' && (
                  <div className="mt-2 space-y-1">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@upi"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                )}

                {selectedMethod === 'qr' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-white border border-slate-200 p-1 rounded-lg flex items-center justify-center shadow-2xs">
                      <QrCode className="w-14 h-14 text-slate-900" />
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold text-emerald-700">UPI Scan & Pay ₹1</p>
                      <p className="text-slate-500 font-medium">GPay, PhonePe, Paytm or BHIM</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing ₹1 Subscription...</span>
                  </>
                ) : (
                  <>
                    <span>{subscription.isActive ? 'Renew / Update Pass for ₹1' : 'Subscribe Now for ₹1 / Month'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Encrypted & Safe
                </span>
                <span>Auto-renews at ₹1/mo • Cancel anytime</span>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
