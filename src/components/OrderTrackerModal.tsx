import React, { useState, useEffect } from 'react';
import { 
  Search, X, Check, Clock, AlertCircle, ShieldCheck, 
  ExternalLink, Send, ArrowRight, MessageSquare, 
  Copy, RefreshCw, Smartphone, CreditCard, CheckCircle2 
} from 'lucide-react';
import { Order, OrderStage, Settings } from '../types/index';
import { 
  ORDER_STAGES, getStageIndex, getStageColor, 
  formatDate, createWhatsAppUrl 
} from '../utils/helpers';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  defaultOrderId?: string;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  settings,
  defaultOrderId = ''
}) => {
  const [orderId, setOrderId] = useState(defaultOrderId);
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment UTR Submission State
  const [utrNumber, setUtrNumber] = useState('');
  const [utrAmount, setUtrAmount] = useState('');
  const [utrNote, setUtrNote] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [utrSuccess, setUtrSuccess] = useState(false);

  useEffect(() => {
    if (defaultOrderId) {
      setOrderId(defaultOrderId);
      fetchOrder(defaultOrderId, '');
    }
  }, [defaultOrderId]);

  if (!isOpen) return null;

  const fetchOrder = async (idToSearch: string, contactToSearch: string) => {
    if (!idToSearch.trim()) {
      setError('Please enter an Order ID.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        orderId: idToSearch.trim(),
        ...(contactToSearch ? { contact: contactToSearch.trim() } : {})
      });

      const res = await fetch(`/api/orders/track?${query.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Order not found. Please verify Order ID.');
      }

      const data: Order = await res.json();
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'Could not find order.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderId, contact);
  };

  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    if (!utrNumber.trim()) {
      setError('Please enter your 12-digit UTR or Transaction reference number.');
      return;
    }

    setSubmittingUtr(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/payment-reference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentReference: utrNumber.trim(),
          amount: utrAmount.trim(),
          note: utrNote.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit payment reference.');
      }

      const updated: Order = await res.json();
      setOrder(updated);
      setUtrSuccess(true);
      setUtrNumber('');
    } catch (err: any) {
      setError(err.message || 'Payment reference submission failed.');
    } finally {
      setSubmittingUtr(false);
    }
  };

  const currentStageIndex = order ? getStageIndex(order.status) : 0;

  const whatsAppHelpUrl = order
    ? createWhatsAppUrl(
        settings.whatsappNumber,
        `Hello Suraj Maurya! I am inquiring about my Order #${order.id} (${order.serviceName}). Current status: ${order.status}.`
      )
    : createWhatsAppUrl(
        settings.whatsappNumber,
        `Hello Suraj, I need help finding my project Order ID.`
      );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative text-left my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            Real-Time Milestone Tracker
          </span>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Track Project Order Status</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Enter your Order ID (and WhatsApp / Email) to view real-time progress across all 10 stages.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-6">
              <input
                type="text"
                required
                placeholder="Order ID (e.g. ORD-729410)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                placeholder="WhatsApp or Email (Optional)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Track</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* When Order is Loaded */}
        {order ? (
          <div className="space-y-6">
            
            {/* Order Summary Header Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#0f172a] border border-cyan-500/30 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-white font-mono">
                      {order.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStageColor(order.status).bg} ${getStageColor(order.status).text} ${getStageColor(order.status).border}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Client: <strong className="text-white">{order.clientName}</strong> ({order.brandName})
                  </p>
                </div>

                {/* Payment Status Pill */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono block">Direct Payment Status</span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
                    order.paymentStatus === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : order.paymentStatus === 'Verification Submitted'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                  }`}>
                    {order.paymentStatus === 'Verified' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified by Suraj</span>
                      </>
                    ) : order.paymentStatus === 'Verification Submitted' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Verification In Progress</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Advance Pending</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Service & Meta row */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Service</span>
                  <span className="text-slate-200 font-medium">{order.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Package</span>
                  <span className="text-cyan-400 font-bold">{order.packageName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Est. Deadline</span>
                  <span className="text-slate-200 font-medium">{order.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Agreed Value</span>
                  <span className="text-yellow-400 font-bold">{order.price}</span>
                </div>
              </div>
            </div>

            {/* The 10 Stages Progress Visualizer */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>10-Stage Milestone Progress</span>
                <span className="text-cyan-400 font-mono text-[11px]">
                  Stage {currentStageIndex + 1} of 10 ({Math.round(((currentStageIndex + 1) / 10) * 100)}%)
                </span>
              </h4>

              {/* Progress bar line */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${((currentStageIndex + 1) / 10) * 100}%` }}
                />
              </div>

              {/* 10 Stages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {ORDER_STAGES.map((stage, idx) => {
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div
                      key={stage}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : isCompleted
                          ? 'bg-slate-900 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          0{idx + 1}
                        </span>
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : null}
                      </div>
                      <span className={`block font-semibold text-[11px] leading-tight ${
                        isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                      }`}>
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Client Notes & Deliverables (If any uploaded by Admin) */}
            {(order.clientNotes || order.deliveryUrl) && (
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 space-y-2">
                <strong className="text-xs text-cyan-300 block font-bold">
                  Updates & Delivery Links from Suraj Maurya:
                </strong>
                {order.clientNotes && (
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {order.clientNotes}
                  </p>
                )}
                {order.deliveryUrl && (
                  <div className="pt-2">
                    <a
                      href={order.deliveryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Live Project / Deliverable Link</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Direct Payment UTR Submission Form (if not verified yet) */}
            {order.paymentStatus !== 'Verified' && (
              <div className="p-5 rounded-2xl bg-[#0f172a] border border-yellow-500/30 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-yellow-400" />
                      Submit Direct Payment Reference (UTR)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Agar aapne UPI ID ({settings.upiId}) ya Bank account par pay kar diya hai, toh apna UTR number enter karein.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-yellow-950 text-yellow-300 px-2 py-0.5 rounded border border-yellow-700">
                    Manual Verification
                  </span>
                </div>

                {utrSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>UTR submitted! Suraj Maurya is manually verifying your payment.</span>
                  </div>
                )}

                <form onSubmit={handleUtrSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        12-Digit UTR / Transaction Reference ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 429381048291 or IMPS Ref"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Amount Paid (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5000"
                        value={utrAmount}
                        onChange={(e) => setUtrAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Payment Note / App Used (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Paid via Google Pay from State Bank account"
                      value={utrNote}
                      onChange={(e) => setUtrNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingUtr}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-yellow-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingUtr ? (
                      <span className="animate-pulse">Submitting for Manual Verification...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-slate-950" />
                        <span>Submit Payment Reference for Verification</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Timeline History Entries */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Detailed Activity Log:
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {order.history.slice().reverse().map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <span className="font-semibold text-cyan-300 block mb-0.5">
                        {hist.stage}
                      </span>
                      <p className="text-slate-300 text-[11px]">
                        {hist.note}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {formatDate(hist.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct WhatsApp Project Discussion */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={whatsAppHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss Order with Suraj on WhatsApp</span>
              </a>
            </div>

          </div>
        ) : (
          /* Empty placeholder or sample quick search */
          <div className="text-center py-8 text-xs text-slate-400 space-y-4">
            <p>
              Apna Order ID enter karein to view live progress.
            </p>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 max-w-sm mx-auto text-left">
              <span className="text-[11px] font-bold text-slate-300 block mb-1">
                Want to test the live tracker?
              </span>
              <p className="text-[11px] text-slate-400 mb-2">
                Click below to load sample demo order:
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderId('ORD-729410');
                  fetchOrder('ORD-729410', '');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold hover:bg-cyan-500/20 transition cursor-pointer"
              >
                Test with: ORD-729410 →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
