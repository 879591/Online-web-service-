import React, { useState, useEffect } from 'react';
import { 
  X, Check, Sparkles, ArrowRight, MessageSquare, 
  Copy, ShieldCheck, CheckCircle2, AlertCircle, FileText,
  Download, Search, Home, RefreshCw, Clock, Mail, Phone, Calendar
} from 'lucide-react';
import { Service, Package, Settings, Order } from '../types/index';
import { createWhatsAppUrl } from '../utils/helpers';
import { safeApiFetch } from '../utils/api';
import { downloadInvoicePdf } from '../utils/invoiceGenerator';

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
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Idempotency Key to prevent duplicate submissions
  const [idempotencyKey, setIdempotencyKey] = useState<string>(
    () => `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );

  // Form State
  const [clientName, setClientName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId || services[0]?.id || 'custom-website');
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
  const [loadingStepText, setLoadingStepText] = useState('Validating your project scope...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
    if (initialPackageName) setPackageName(initialPackageName as any);
  }, [initialServiceId, initialPackageName]);

  // Reset idempotency key when opening anew
  useEffect(() => {
    if (isOpen && step === 'form') {
      setIdempotencyKey(`idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
    }
  }, [isOpen]);

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
      setError('Please enter a valid 10-digit WhatsApp/Phone number.');
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
    setLoadingStepText('Registering order in database...');

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
        fileReferenceUrl: fileReferenceUrl.trim(),
        idempotencyKey
      };

      setLoadingStepText('Generating unique Order ID & Invoice...');

      const result = await safeApiFetch<Order>('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-idempotency-key': idempotencyKey
        },
        body: JSON.stringify(payload)
      });

      if (!result.ok || !result.data) {
        throw new Error(result.error || 'Failed to submit order. Please try again.');
      }

      const orderData: Order = result.data;
      setCreatedOrder(orderData);
      setStep('confirmation');

      // Safely notify parent component
      try {
        if (typeof onOrderSuccess === 'function') {
          onOrderSuccess(orderData);
        }
      } catch (err) {
        console.warn('onOrderSuccess callback caught warning:', err);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while placing your order. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (!createdOrder) return;
    try {
      navigator.clipboard.writeText(createdOrder.id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2500);
    } catch {
      // Fallback
      setCopiedOrderId(true);
    }
  };

  const copyUpiId = () => {
    try {
      navigator.clipboard.writeText(settings?.upiId || 'surajmaurya@upi');
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      setCopiedUpi(true);
    }
  };

  const handleDownloadInvoice = () => {
    if (!createdOrder) return;
    setDownloadingPdf(true);
    try {
      downloadInvoicePdf(createdOrder, settings);
    } catch (err) {
      console.error('Invoice download error:', err);
      window.open(`/api/orders/${createdOrder.id}/invoice`, '_blank');
    } finally {
      setTimeout(() => setDownloadingPdf(false), 1500);
    }
  };

  const handleTrackOrderClick = () => {
    onClose();
    if (onOpenTracker && createdOrder) {
      onOpenTracker(createdOrder.id);
    } else {
      window.location.href = `/?track=${createdOrder?.id}`;
    }
  };

  const handleBackToHome = () => {
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsAppOrderUrl = createdOrder
    ? createWhatsAppUrl(
        settings?.whatsappNumber || '9792006815',
        `Hello Suraj Maurya! I have submitted an order on your website.
Order ID: ${createdOrder.id}
Client: ${createdOrder.clientName}
Service: ${createdOrder.serviceName}
Package: ${createdOrder.packageName}
Budget: ${createdOrder.price || createdOrder.budget}
Deadline: ${createdOrder.deadline}
Please review my project details.`
      )
    : createWhatsAppUrl(settings?.whatsappNumber || '9792006815');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-5 sm:p-8 shadow-2xl relative text-left my-6 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 transition cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            {/* Header */}
            <div className="mb-6 pr-8">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                Direct Client Order System
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Start Your Project Order
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Fill your requirements. Instant unique Order ID & invoice generate hoga, jisse aap live track kar sakenge.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{error}</p>
                  <p className="text-[11px] text-rose-400/80 mt-0.5">Please check your details and try again.</p>
                </div>
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
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">SMS notification & order updates will be sent here.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@business.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Formal order confirmation & PDF invoice will be emailed.</p>
                </div>
              </div>

              {/* Row 3: Service & Package Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Selected Digital Service *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (from {s.startingPrice})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Package Tier *
                  </label>
                  <select
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.name}>
                        {pkg.name} — {pkg.price} ({pkg.delivery})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Project Scope Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Description & Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail your requirements, goals, design preferences, and required features..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Features Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Required Features / Functionalities (Select all applicable)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {featureOptions.map((feat) => {
                    const active = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition text-left flex items-center gap-1.5 border cursor-pointer ${
                          active
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          active ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Budget & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estimated Budget *
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="₹2,999 - ₹4,999">Starter (₹2,999 - ₹4,999)</option>
                    <option value="₹5,000 - ₹12,000">Growth (₹5,000 - ₹12,000)</option>
                    <option value="₹12,000 - ₹25,000">Pro / Business (₹12,000 - ₹25,000)</option>
                    <option value="₹25,000+">Custom Enterprise (₹25,000+)</option>
                    <option value="Open to Quote Discussion">Open to Discussion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Deadline *
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

              {/* Row 6: Reference Link & File Link */}
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
                    Drive / Asset Link (Optional)
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
                    <div className="flex items-center gap-2 text-slate-950 font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>{loadingStepText}</span>
                    </div>
                  ) : (
                    <>
                      <span>Place Project Order & Generate Invoice</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Direct advance payment via UPI/Bank transfer. Zero gateway charges.
                </p>
              </div>

            </form>
          </div>
        ) : (
          /* ========================================
             PROFESSIONAL ORDER CONFIRMATION / THANK YOU PAGE
             ======================================== */
          <div className="text-left space-y-6 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="text-center space-y-2 border-b border-slate-800 pb-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                🎉 THANK YOU FOR YOUR ORDER!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Your order has been received successfully.
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto">
                Suraj Maurya has received your project requirements. Your unique order ID, invoice, and tracking details are ready below.
              </p>
            </div>

            {/* Key Order Highlight Card */}
            <div className="bg-slate-900/90 border-2 border-cyan-400/50 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-bl-xl text-[10px] font-mono border-b border-l border-cyan-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Live Order Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Order ID
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono text-yellow-400 tracking-wider">
                      {createdOrder?.id || 'ORD-PENDING'}
                    </span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                    {copiedOrderId && <span className="text-[10px] text-emerald-400 font-medium">Copied!</span>}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Invoice Number
                  </span>
                  <span className="text-sm font-bold font-mono text-white mt-1 block">
                    {createdOrder?.invoiceNumber || `INV-${createdOrder?.id}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Structured Order Information Details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2 border-b border-slate-800/80 pb-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Official Order Summary</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Customer Name:</span>
                  <span className="font-semibold text-white">{createdOrder?.clientName || 'N/A'}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Business / Brand:</span>
                  <span className="font-semibold text-white">{createdOrder?.brandName || 'Individual'}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Digital Service:</span>
                  <span className="font-semibold text-cyan-300">{createdOrder?.serviceName || 'Custom Service'}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Package Tier:</span>
                  <span className="font-semibold text-white">{createdOrder?.packageName || 'CUSTOM'}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Budget / Total Price:</span>
                  <span className="font-bold text-yellow-400">{createdOrder?.price || createdOrder?.budget}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Expected Deadline:</span>
                  <span className="font-semibold text-white">{createdOrder?.deadline || 'Standard'}</span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Order Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {createdOrder?.status || 'Order Received'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {createdOrder?.paymentStatus === 'Verified' ? 'VERIFIED' : 'PAYMENT PENDING'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/40 pb-1.5 sm:col-span-2">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-mono text-slate-300">
                    {createdOrder?.createdAt 
                      ? new Date(createdOrder.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
                      : new Date().toLocaleString()}
                  </span>
                </div>

                <div className="sm:col-span-2 pt-1">
                  <span className="text-slate-400 block mb-1">Project Description:</span>
                  <p className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                    {createdOrder?.projectDescription || 'No description provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Advance Payment Instructions Box */}
            <div className="bg-[#0b1329] p-4 rounded-xl border border-yellow-500/40 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-400 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Direct Advance Payment Details
                </span>
                <span className="text-[10px] font-mono bg-yellow-950/80 text-yellow-300 px-2 py-0.5 rounded border border-yellow-700/60">
                  Zero Gateway Fees
                </span>
              </div>

              {/* UPI Field */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Official UPI ID:</span>
                  <span className="font-bold text-white font-mono text-sm">{settings?.upiId || 'surajmaurya@upi'}</span>
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
                <div>Account: <strong className="text-white font-mono">{settings?.accountNumber || 'Pending Configuration'}</strong> ({settings?.bankName || 'State Bank of India'})</div>
                <div>IFSC: <strong className="text-yellow-400 font-mono">{settings?.ifscCode || 'Pending'}</strong> • Payee: <strong className="text-white">{settings?.accountHolder || 'Suraj Maurya'}</strong></div>
              </div>

              <p className="text-[10px] text-amber-300/80 italic">
                * Note: Payment is verified manually by admin before starting work. Payment status will change to VERIFIED only after manual check.
              </p>
            </div>

            {/* Required 4 Post-Order Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              
              {/* 1. Download Invoice PDF */}
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={downloadingPdf}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {downloadingPdf ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Download Invoice PDF</span>
                  </>
                )}
              </button>

              {/* 2. Track My Order */}
              <button
                type="button"
                onClick={handleTrackOrderClick}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/40 transition cursor-pointer"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Track My Order Live &rarr;</span>
              </button>

              {/* 3. Contact on WhatsApp */}
              <a
                href={whatsAppOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact on WhatsApp</span>
              </a>

              {/* 4. Back to Home */}
              <button
                type="button"
                onClick={handleBackToHome}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-800 transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>Back to Home</span>
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
