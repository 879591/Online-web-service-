import React, { useState } from 'react';
import { 
  CreditCard, QrCode, Copy, Check, ShieldCheck, AlertCircle, 
  ArrowRight, ExternalLink, Smartphone, Building2, HelpCircle 
} from 'lucide-react';
import { Settings } from '../types/index';
import { createUpiPaymentUri, createWhatsAppUrl } from '../utils/helpers';

interface DirectPaymentSectionProps {
  settings: Settings;
  onOpenTracker: () => void;
}

export const DirectPaymentSection: React.FC<DirectPaymentSectionProps> = ({
  settings,
  onOpenTracker
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const upiIntentUri = createUpiPaymentUri(
    settings.upiId,
    settings.accountHolder,
    undefined,
    'Online Digital Services'
  );

  const whatsAppPaymentUrl = createWhatsAppUrl(
    settings.whatsappNumber,
    `Hello Suraj, I have made a direct payment for my project. Here is my transaction UTR number:`
  );

  return (
    <section id="payment" className="py-20 md:py-28 relative bg-[#090d1a]">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cyan-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
            100% Direct & Transparent
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Direct <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-yellow-400">Payment Methods</span>
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Hum koi bhi third-party payment gateway (Razorpay/Stripe) use nahi karte. Client direct UPI ya Bank Transfer se pay karta hai aur manual verification Suraj Maurya dwara hoti hai.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Method 1: Instant UPI Payment */}
          <div className="rounded-2xl glass-card p-6 sm:p-8 flex flex-col justify-between border-cyan-500/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">UPI Payment</h3>
                    <p className="text-xs text-slate-400">Google Pay • PhonePe • Paytm • BHIM</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-800">
                  Instant Transfer
                </span>
              </div>

              {/* UPI ID Field with Copy */}
              <div className="mt-6 bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 font-mono block">Official UPI ID:</span>
                  <span className="text-base sm:text-lg font-bold text-yellow-400 font-mono truncate block">
                    {settings.upiId}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.upiId, 'upi')}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shrink-0 border border-slate-700 cursor-pointer"
                >
                  {copiedField === 'upi' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-cyan-400" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Payee Name */}
              <div className="mt-3 bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Payee / Account Holder:</span>
                <span className="font-bold text-white">{settings.accountHolder}</span>
              </div>

              {/* Mobile Direct UPI App Pay Button */}
              <div className="mt-6 p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-slate-300 space-y-2">
                <p className="font-medium text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Mobile phone par kisi bhi UPI app mein copy-paste karke pay karein.
                </p>
                <p className="text-[11px] text-slate-400">
                  Payment hone ke baad mile <strong className="text-slate-200">12-Digit UTR / Ref Number</strong> ko apne Order Tracking page par submit karein.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a
                href={upiIntentUri}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open in UPI App (Mobile Only)</span>
              </a>
            </div>
          </div>

          {/* Method 2: Direct Bank Transfer (NEFT / IMPS / RTGS) */}
          <div className="rounded-2xl glass-card p-6 sm:p-8 flex flex-col justify-between border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Bank Transfer (NEFT / IMPS)</h3>
                    <p className="text-xs text-slate-400">Direct National Bank Account Transfer</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono bg-yellow-950 text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-800">
                  Zero Gateway Fee
                </span>
              </div>

              {/* Bank Details Table with One-Click Copies */}
              <div className="mt-6 space-y-2.5">
                
                {/* Account Holder */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Account Holder Name</span>
                    <span className="font-bold text-white">{settings.accountHolder}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.accountHolder, 'name')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                    title="Copy Name"
                  >
                    {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Bank Name */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Bank Name</span>
                    <span className="font-bold text-white">{settings.bankName}</span>
                  </div>
                </div>

                {/* Account Number */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">Account Number</span>
                    <span className="font-bold font-mono text-cyan-400">{settings.accountNumber}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.accountNumber, 'acc')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                    title="Copy Account Number"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* IFSC Code */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">IFSC Code</span>
                    <span className="font-bold font-mono text-yellow-400">{settings.ifscCode}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.ifscCode, 'ifsc')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                    title="Copy IFSC"
                  >
                    {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={onOpenTracker}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Already Paid? Submit UTR / Reference ID</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

        </div>

        {/* 6-Step Workflow Explanation */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#0f172a]/60 border border-slate-800">
          <h4 className="text-base font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Direct Payment & Verification Flow:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center mb-2">1</span>
              <strong className="text-white block mb-1">Place Order</strong>
              <p className="text-slate-400">Order form submit karein aur unique Order ID receive karein.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold flex items-center justify-center mb-2">2</span>
              <strong className="text-white block mb-1">Pay Direct</strong>
              <p className="text-slate-400">Official UPI ID ya Bank details par agreed advance pay karein.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 font-mono font-bold flex items-center justify-center mb-2">3</span>
              <strong className="text-white block mb-1">Submit UTR</strong>
              <p className="text-slate-400">Track Order page par apna UTR / Transaction No. enter karein.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center mb-2">4</span>
              <strong className="text-white block mb-1">Manual Check</strong>
              <p className="text-slate-400">Suraj Maurya manually transaction verify karte hain.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center mb-2">5</span>
              <strong className="text-white block mb-1">Status Update</strong>
              <p className="text-slate-400">Order status "Payment Verified" mein convert ho jata hai.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-mono font-bold flex items-center justify-center mb-2">6</span>
              <strong className="text-white block mb-1">Work Starts</strong>
              <p className="text-slate-400">Design & Development immediately start ho jata hai.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
