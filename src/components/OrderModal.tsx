import React, { useState, useEffect } from 'react';
import { 
  X, Check, Sparkles, ArrowRight, MessageSquare, 
  Copy, ShieldCheck, CheckCircle2, AlertCircle, FileText 
} from 'lucide-react';
import { Service, Package, Settings, Order } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';
import { safeApiFetch } from '../utils/api';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  packages: Package[];
  settings: Settings;
  initialServiceId?: string;
  initialPackageName?: string;
  onOrderSuccess: (order: Order) => void;
  onOpenTracker?: (orderId?: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  services,
  packages,
  settings,
  initialServiceId,
  initialPackageName,
  onOrderSuccess,
  onOpenTracker
}) => {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || services[0]?.id || 'business-website');
  const [packageName, setPackageName] = useState<'STARTER' | 'GROWTH' | 'PRO' | 'CUSTOM'>(
    (initialPackageName as any) || 'GROWTH'
  );
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [referenceWebsite, setReferenceWebsite] = useState('');
  const [budget, setBudget] = useState('₹5,000 - ₹15,000');
  const [deadline, setDeadline] = useState('5 - 7 Days');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [fileReferenceUrl, setFileReferenceUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
    if (initialPackageName) setPackageName(initialPackageName as any);
  }, [initialServiceId, initialPackageName]);

  if (!isOpen) return null;

  const featureOptions = [
    'Mobile Responsive UI',
    'Contact & Inquiry Forms',
    'WhatsApp Floating Chat',
    'Google Maps Location',
    'Payment / UPI Details Integration',
    'Speed Optimization (Sub-2s)',
    'Course / Video Curriculum Module',
    'Product Catalog & Cart Checkout',
    'Admin Portal Access',
    'Custom Domain Connection',
    'On-Page SEO & Meta Tags',
    'Interactive Animations'
  ];

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  const currentService = services.find(s => s.id === serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!clientName.trim() || clientName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!projectDescription.trim() || projectDescription.trim().length < 10) {
      setError('Please provide your project description (minimum 10 characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        clientName: clientName.trim(),
        brandName: (brandName || clientName).trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        serviceId,
        serviceName: currentService ? currentService.name : 'Digital Service',
        packageName,
        projectDescription: projectDescription.trim(),
        requiredFeatures: selectedFeatures,
        referenceWebsite: referenceWebsite.trim(),
        budget,
        deadline,
        additionalNotes: additionalNotes.trim(),
        fileReferenceUrl: fileReferenceUrl.trim()
      };

      const result = await safeApiFetch<Order>('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!result.ok || !result.data) {
        throw new Error(result.error || 'Failed to submit order.');
      }

      const orderData: Order = result.data;
      setCreatedOrder(orderData);
      setStep('confirmation');
      onOrderSuccess(orderData);
    } catch (err: any) {
      setError(err.message || 'An error occurred while placing order.');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (!createdOrder) return;
    navigator.clipboard.writeText(createdOrder.id);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const whatsAppOrderUrl = createdOrder
    ? createWhatsAppUrl(
        settings.whatsappNumber,
        `Hello Suraj Maurya! I just placed an order on your website. 
Order ID: ${createdOrder.id}
Client: ${createdOrder.clientName}
Service: ${createdOrder.serviceName}
Package: ${createdOrder.packageName}
Please review my requirements and confirm the next steps.`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative text-left my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            {/* Header */}
            <div className="mb-6">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Direct Client Order System
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Start Your Project Order
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Fill your requirements. Instant unique Order ID generate hoga, jisse aap live track kar sakenge.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Client & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Verma"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verma Digital Academy"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Row 2: WhatsApp & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="ramesh@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Row 3: Service & Package Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Service *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Package
                  </label>
                  <select
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="STARTER">STARTER (₹4,999)</option>
                    <option value="GROWTH">GROWTH (₹11,999) - Recommended</option>
                    <option value="PRO">PRO (₹24,999)</option>
                    <option value="CUSTOM">CUSTOM (Tailored Scope)</option>
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Description & Vision *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what you want to achieve with this website or digital solution, target audience, pages needed..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Required Features Multi-Select Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Required Features
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {featureOptions.map((feat) => {
                    const isSelected = selectedFeatures.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-slate-950" />}
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Budget & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Budget
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="₹4,000 - ₹8,000">₹4,000 - ₹8,000</option>
                    <option value="₹8,000 - ₹15,000">₹8,000 - ₹15,000</option>
                    <option value="₹15,000 - ₹30,000">₹15,000 - ₹30,000</option>
                    <option value="₹30,000+">₹30,000+ (Custom / Complex)</option>
                    <option value="To be discussed">To be discussed with Suraj</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Deadline
                  </label>
                  <select
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Urgent (2 - 4 Days)">Urgent (2 - 4 Days)</option>
                    <option value="5 - 7 Days">Standard (5 - 7 Days)</option>
                    <option value="10 - 14 Days">Comprehensive (10 - 14 Days)</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Reference Link & File Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Reference Website (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={referenceWebsite}
                    onChange={(e) => setReferenceWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Google Drive / Asset Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="Link to logo, images, or content doc"
                    value={fileReferenceUrl}
                    onChange={(e) => setFileReferenceUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="animate-pulse">Registering Order & Generating ID...</span>
                  ) : (
                    <>
                      <span>Submit Project Order & Generate Order ID</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Direct advance payment via UPI/Bank transfer. Zero gateway fees.
                </p>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                Order Placed Successfully!
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Your Project Order is Registered
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Suraj Maurya has received your project order details. Aapka unique tracking ID neeche diya gaya hai.
              </p>
            </div>

            {/* Unique Order ID Card */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border-2 border-cyan-400/50 max-w-md mx-auto text-center space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Your Unique Tracking Order ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black font-mono text-yellow-400 tracking-wider">
                  {createdOrder?.id}
                </span>
                <button
                  onClick={copyOrderId}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Copy Order ID"
                >
                  {copiedOrderId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                </button>
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                Save this Order ID to track milestone progress at any time!
              </p>
            </div>

            {/* Direct Payment Instructions Box */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-yellow-500/30 text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Direct Advance Payment Details
                </span>
                <span className="text-[10px] font-mono bg-yellow-950 text-yellow-300 px-2 py-0.5 rounded border border-yellow-700">
                  Zero Gateway Fee
                </span>
              </div>

              {/* UPI Field */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Official UPI ID:</span>
                  <span className="font-bold text-white font-mono text-sm">{settings.upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={copyUpiId}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                </button>
              </div>

              {/* Bank Summary */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                <div>Account: <strong className="text-white font-mono">{settings.accountNumber}</strong> ({settings.bankName})</div>
                <div>IFSC: <strong className="text-yellow-400 font-mono">{settings.ifscCode}</strong> • Payee: <strong className="text-white">{settings.accountHolder}</strong></div>
              </div>
            </div>

            {/* Next Step Action Buttons */}
            <div className="space-y-2.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenTracker && createdOrder) {
                    onOpenTracker(createdOrder.id);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-cyan-400 hover:from-yellow-300 hover:to-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25 transition cursor-pointer"
              >
                <span>Proceed to Submit Payment Reference (UTR) →</span>
              </button>

              <a
                href={whatsAppOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Order Confirmation to Suraj on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Close & Return to Website
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
