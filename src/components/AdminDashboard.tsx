import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Search, Filter, CheckCircle2, 
  Clock, AlertCircle, ExternalLink, Save, RefreshCw, X, 
  MessageSquare, Users, FileText, Settings as SettingsIcon, 
  DollarSign, Check, Phone, Mail, Edit3, ArrowRight, Eye, Briefcase,
  Smartphone, Copy, Sparkles, KeyRound
} from 'lucide-react';
import { Order, OrderStage, Lead, LeadStatus, Quote, Settings, Service, Package } from '../types/index';
import { ORDER_STAGES, getStageColor, formatDate, createWhatsAppUrl } from '../utils/helpers';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsUpdate: (updated: Settings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsUpdate
}) => {
  // Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('suraj_admin_token'));
  const [authStep, setAuthStep] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [passwordInput, setPasswordInput] = useState('Suraj@5556pm');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpPhone, setOtpPhone] = useState<string>('9792006815');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpCopied, setOtpCopied] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'leads' | 'quotes' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStageFilter, setOrderStageFilter] = useState<string>('ALL');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Selected Order Edit State
  const [editStage, setEditStage] = useState<OrderStage>('Order Received');
  const [stageNote, setStageNote] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editClientNotes, setEditClientNotes] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [editDeliveryUrl, setEditDeliveryUrl] = useState('');
  
  // Payment Verification State
  const [verifyAmount, setVerifyAmount] = useState('');
  const [verifyNote, setVerifyNote] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [orderActionMsg, setOrderActionMsg] = useState<string | null>(null);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadFilter, setLeadFilter] = useState<string>('ALL');

  // Quotes State
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteTimeline, setQuoteTimeline] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState<string>('Pending Review');

  // Stats State
  const [stats, setStats] = useState<any>(null);

  // Settings Edit State
  const [settingsForm, setSettingsForm] = useState<Settings>(settings);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (token && isOpen) {
      loadAllAdminData();
    }
  }, [token, isOpen]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  if (!isOpen) return null;

  const handleRequestOtp = async (e?: React.FormEvent, customPass?: string) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    setLoginSuccessMsg(null);

    const passToUse = customPass !== undefined ? customPass : passwordInput;

    try {
      const trimmedPassword = passToUse.trim();
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmedPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password galat hai! Sahi password dalein.');
      }

      setGeneratedOtp(data.otp);
      setOtpPhone(data.phone || '9792006815');
      setLoginSuccessMsg(data.message || `OTP mobile +91 ${data.phone} par bhej diya gaya hai!`);
      setOtpInput(data.otp); // Pre-fill for instant 1-click verification
      setAuthStep('OTP');
    } catch (err: any) {
      setLoginError(err.message || 'OTP request fail ho gayi.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpInput.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Galat OTP hai.');
      }

      localStorage.setItem('suraj_admin_token', data.token);
      setToken(data.token);
      setAuthStep('PASSWORD');
      setGeneratedOtp(null);
      setOtpInput('');
    } catch (err: any) {
      setLoginError(err.message || 'OTP verification fail.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    setOtpCopied(true);
    setOtpInput(code);
    setTimeout(() => setOtpCopied(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('suraj_admin_token');
    setToken(null);
    setAuthStep('PASSWORD');
    setGeneratedOtp(null);
    setOtpInput('');
  };

  const loadAllAdminData = async () => {
    if (!token) return;
    setOrdersLoading(true);
    setLeadsLoading(true);
    setQuotesLoading(true);

    try {
      const headers = { 'x-admin-token': token };

      const [ordersRes, leadsRes, quotesRes, statsRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/leads', { headers }),
        fetch('/api/admin/quotes', { headers }),
        fetch('/api/admin/stats', { headers })
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (leadsRes.ok) setLeads(await leadsRes.json());
      if (quotesRes.ok) setQuotes(await quotesRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setOrdersLoading(false);
      setLeadsLoading(false);
      setQuotesLoading(false);
    }
  };

  // Select an order for details
  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order);
    setEditStage(order.status);
    setStageNote('');
    setEditPrice(order.price);
    setEditDeadline(order.deadline);
    setEditClientNotes(order.clientNotes || '');
    setEditInternalNotes(order.internalNotes || '');
    setEditDeliveryUrl(order.deliveryUrl || '');
    setVerifyAmount(order.paidAmount || order.price);
    setVerifyNote('');
    setOrderActionMsg(null);
  };

  // Update order stage
  const handleUpdateStage = async () => {
    if (!selectedOrder || !token) return;
    setUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          status: editStage,
          note: stageNote || `Stage updated to: ${editStage}`
        })
      });

      if (!res.ok) throw new Error('Failed to update stage');
      const updated: Order = await res.json();
      setSelectedOrder(updated);
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      setOrderActionMsg('Stage updated successfully!');
      setStageNote('');
      setTimeout(() => setOrderActionMsg(null), 3000);
    } catch (err: any) {
      setOrderActionMsg(err.message || 'Stage update failed');
    } finally {
      setUpdatingOrder(false);
    }
  };

  // Update order details (pricing, deadline, notes, links)
  const handleUpdateDetails = async () => {
    if (!selectedOrder || !token) return;
    setUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          price: editPrice,
          deadline: editDeadline,
          clientNotes: editClientNotes,
          internalNotes: editInternalNotes,
          deliveryUrl: editDeliveryUrl
        })
      });

      if (!res.ok) throw new Error('Failed to update details');
      const updated: Order = await res.json();
      setSelectedOrder(updated);
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      setOrderActionMsg('Order details saved!');
      setTimeout(() => setOrderActionMsg(null), 3000);
    } catch (err: any) {
      setOrderActionMsg(err.message || 'Update failed');
    } finally {
      setUpdatingOrder(false);
    }
  };

  // Manual payment verification action
  const handleManualVerifyPayment = async () => {
    if (!selectedOrder || !token) return;
    setUpdatingOrder(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/verify-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          amountVerified: verifyAmount || selectedOrder.price,
          adminNote: verifyNote || `Direct UPI/Bank transfer verified manually by Suraj Maurya.`
        })
      });

      if (!res.ok) throw new Error('Failed to verify payment');
      const updated: Order = await res.json();
      setSelectedOrder(updated);
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      setOrderActionMsg('Direct payment verified manually!');
      setTimeout(() => setOrderActionMsg(null), 3000);
    } catch (err: any) {
      setOrderActionMsg(err.message || 'Payment verification failed');
    } finally {
      setUpdatingOrder(false);
    }
  };

  // Update Lead Status
  const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated: Lead = await res.json();
        setLeads(leads.map(l => l.id === updated.id ? updated : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        const updated: Settings = await res.json();
        onSettingsUpdate(updated);
        setSettingsSaveMsg('Business details updated successfully!');
        setTimeout(() => setSettingsSaveMsg(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = orderSearch === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.clientName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.whatsapp.includes(orderSearch) ||
      o.serviceName.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStage = orderStageFilter === 'ALL' || o.status === orderStageFilter;
    const matchesPayment = orderPaymentFilter === 'ALL' || o.paymentStatus === orderPaymentFilter;

    return matchesSearch && matchesStage && matchesPayment;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-6xl rounded-2xl bg-[#0a0f1d] border border-cyan-500/40 p-4 sm:p-6 shadow-2xl relative text-left my-4 max-h-[95vh] overflow-y-auto flex flex-col">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Agency Command Center</span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  Suraj Maurya
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Secure Client Order Management, Manual Payment Verification & Lead Pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!token ? (
          <div className="max-w-md mx-auto my-12 p-6 sm:p-8 rounded-2xl bg-[#0f172a] border border-cyan-500/30 shadow-2xl space-y-5">
            {authStep === 'PASSWORD' ? (
              /* STEP 1: PASSWORD */
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>
                  <span className="inline-block text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                    Step 1 of 2: Password
                  </span>
                  <h3 className="text-lg font-bold text-white">Admin Security Access</h3>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Authorized Owner:</span>
                      <span className="font-bold text-white">{settings.ownerName || 'Suraj Maurya'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered Mobile:</span>
                      <span className="font-bold text-cyan-400">+91 {settings.whatsappNumber || '9792006815'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Registered Email:</span>
                      <span className="font-bold text-yellow-400">{settings.email || '5tarsurajsdr@gmail.com'}</span>
                    </div>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleRequestOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Admin Password
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Password: Suraj@5556pm"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 text-[11px]">
                    <span className="text-slate-400">Aapka Password: <code className="text-yellow-400 font-bold">Suraj@5556pm</code></span>
                    <button
                      type="button"
                      onClick={() => setPasswordInput('Suraj@5556pm')}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <span className="animate-pulse">Checking Password...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Verify Password & Send Mobile OTP ➔</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* STEP 2: MOBILE OTP */
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <Smartphone className="w-7 h-7" />
                  </div>
                  <span className="inline-block text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                    Step 2 of 2: Mobile OTP Verification
                  </span>
                  <h3 className="text-lg font-bold text-white">Mobile OTP Verification</h3>
                  <p className="text-xs text-slate-300">
                    Suraj Maurya ji, aapke mobile <strong className="text-cyan-400">+91 {otpPhone}</strong> par 6-digit OTP generate ho gaya hai.
                  </p>
                </div>

                {/* SMS & WhatsApp Notification Box */}
                {generatedOtp && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        Official Mobile / WhatsApp OTP:
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Valid 10 mins</span>
                    </div>
                    <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-emerald-500/30">
                      <span className="text-2xl font-mono font-extrabold tracking-widest text-emerald-300">
                        {generatedOtp}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyOtp(generatedOtp)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {otpCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{otpCopied ? 'Copied!' : 'Copy OTP'}</span>
                      </button>
                    </div>

                    <a
                      href={`https://wa.me/91${otpPhone}?text=${encodeURIComponent(`Online Website & Digital Services\nNamaste Suraj Maurya ji,\nAapka Admin Panel Login OTP hai: ${generatedOtp}\nIs code ko website me daal kar Dashboard unlock karein.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp par OTP Alert dekhein (+91 {otpPhone})</span>
                    </a>
                  </div>
                )}

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="e.g. 555601"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-lg text-white font-mono tracking-widest focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {loginLoading ? (
                      <span className="animate-pulse">Verifying OTP...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify OTP & Unlock Dashboard 🚀</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthStep('PASSWORD');
                      setLoginError(null);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white pt-1 cursor-pointer"
                  >
                    ← Back to Password Step
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="mt-4 flex-1 flex flex-col space-y-4">
            
            {/* Quick Metrics Bar */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">TOTAL ORDERS</span>
                  <span className="text-xl font-extrabold text-white font-mono">{stats.totalOrders}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">IN PROGRESS</span>
                  <span className="text-xl font-extrabold text-cyan-400 font-mono">{stats.inProgressOrders}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">PAYMENT PENDING</span>
                  <span className="text-xl font-extrabold text-amber-400 font-mono">{stats.paymentPendingOrders}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">PAYMENTS VERIFIED</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">{stats.paymentsVerifiedOrders}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">NEW LEADS</span>
                  <span className="text-xl font-extrabold text-yellow-400 font-mono">{stats.newLeads}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">OPEN QUOTES</span>
                  <span className="text-xl font-extrabold text-indigo-400 font-mono">{stats.pendingQuotes}</span>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('leads'); setSelectedOrder(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Leads Pipeline ({leads.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('quotes'); setSelectedOrder(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'quotes'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Custom Quotes ({quotes.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab('settings'); setSelectedOrder(null); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>Business Settings</span>
                </button>
              </div>

              <button
                onClick={loadAllAdminData}
                title="Refresh All Data"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* TAB 1: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-5 relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Order ID, Client, WhatsApp, Service..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <select
                      value={orderStageFilter}
                      onChange={(e) => setOrderStageFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ALL">All Stages (10 Stages)</option>
                      {ORDER_STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="ALL">All Payment Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Verification Submitted">Verification Submitted</option>
                      <option value="Verified">Verified</option>
                    </select>
                  </div>
                </div>

                {/* Orders List / Selected Order Drawer */}
                {selectedOrder ? (
                  /* Order Detail & Edit Console */
                  <div className="p-5 rounded-2xl bg-[#0f172a] border border-cyan-500/40 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                          Editing Order Specifications
                        </span>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span>{selectedOrder.id}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getStageColor(selectedOrder.status).bg} ${getStageColor(selectedOrder.status).text} ${getStageColor(selectedOrder.status).border}`}>
                            {selectedOrder.status}
                          </span>
                        </h3>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                      >
                        ← Back to Orders List
                      </button>
                    </div>

                    {orderActionMsg && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{orderActionMsg}</span>
                      </div>
                    )}

                    {/* Client Quick Contact & Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Client / Brand</span>
                        <strong className="text-white block">{selectedOrder.clientName}</strong>
                        <span className="text-slate-400">{selectedOrder.brandName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Contact Info</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <a
                            href={createWhatsAppUrl(selectedOrder.whatsapp, `Hello ${selectedOrder.clientName}, regarding your order #${selectedOrder.id}:`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{selectedOrder.whatsapp}</span>
                          </a>
                        </div>
                        {selectedOrder.email && (
                          <span className="text-slate-400 block font-mono text-[10px] mt-0.5">{selectedOrder.email}</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Service & Package</span>
                        <strong className="text-cyan-300 block">{selectedOrder.serviceName}</strong>
                        <span className="text-yellow-400 font-mono text-[11px]">{selectedOrder.packageName}</span>
                      </div>
                    </div>

                    {/* Section 1: Change Stage */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Transition Order Stage (10 Stages)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Select New Stage</label>
                          <select
                            value={editStage}
                            onChange={(e) => setEditStage(e.target.value as OrderStage)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                          >
                            {ORDER_STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Stage Note (Shown in History & Tracking)</label>
                          <input
                            type="text"
                            placeholder="e.g. Wireframe designed. Commencing React code."
                            value={stageNote}
                            onChange={(e) => setStageNote(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleUpdateStage}
                        disabled={updatingOrder}
                        className="py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Order Stage</span>
                      </button>
                    </div>

                    {/* Section 2: Direct Payment Manual Verification */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-yellow-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-yellow-400" />
                          Manual Direct Payment Verification
                        </h4>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          selectedOrder.paymentStatus === 'Verified'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                        }`}>
                          Current: {selectedOrder.paymentStatus}
                        </span>
                      </div>

                      {selectedOrder.paymentReference && (
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                          <span className="text-slate-400 font-mono text-[10px] block">Client Submitted UTR:</span>
                          <strong className="text-yellow-400 font-mono text-sm block">{selectedOrder.paymentReference}</strong>
                          {selectedOrder.paymentSubmissionDate && (
                            <span className="text-[10px] text-slate-500">Submitted on: {formatDate(selectedOrder.paymentSubmissionDate)}</span>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Verified Amount (₹)</label>
                          <input
                            type="text"
                            placeholder="e.g. ₹6,000 (Advance 50%)"
                            value={verifyAmount}
                            onChange={(e) => setVerifyAmount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Verification Note / Bank Confirmation</label>
                          <input
                            type="text"
                            placeholder="e.g. Verified via PhonePe IMPS transfer"
                            value={verifyNote}
                            onChange={(e) => setVerifyNote(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleManualVerifyPayment}
                        disabled={updatingOrder}
                        className="py-2 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Payment as Verified (Manual)</span>
                      </button>
                    </div>

                    {/* Section 3: Notes, Pricing & Delivery Links */}
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        Order Scope, Deliverables & Notes
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Agreed Price (₹)</label>
                          <input
                            type="text"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Agreed Deadline</label>
                          <input
                            type="text"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Client-Facing Updates (Visible on Client Tracking Page)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Prototype uploaded for review. Please see link below."
                          value={editClientNotes}
                          onChange={(e) => setEditClientNotes(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Final Delivery URL / Preview Link / Google Drive Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={editDeliveryUrl}
                          onChange={(e) => setEditDeliveryUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">
                          Admin Internal Notes (Private to Suraj)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Private notes about domain DNS, client preferences, etc."
                          value={editInternalNotes}
                          onChange={(e) => setEditInternalNotes(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <button
                        onClick={handleUpdateDetails}
                        disabled={updatingOrder}
                        className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Scope & Deliverable Updates</span>
                      </button>
                    </div>

                  </div>
                ) : (
                  /* Orders Table */
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0f172a]/60">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Order ID</th>
                          <th className="py-3 px-4">Client / Brand</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Stage</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-slate-900/60 transition">
                              <td className="py-3 px-4 font-mono font-bold text-white">
                                {order.id}
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-white block">{order.clientName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{order.whatsapp}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-cyan-300 block">{order.serviceName}</span>
                                <span className="text-[10px] text-slate-500">{order.packageName}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStageColor(order.status).bg} ${getStageColor(order.status).text} ${getStageColor(order.status).border}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                  order.paymentStatus === 'Verified'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : order.paymentStatus === 'Verification Submitted'
                                    ? 'bg-amber-950 text-amber-400 animate-pulse'
                                    : 'bg-rose-950 text-rose-400'
                                }`}>
                                  {order.paymentStatus}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-yellow-400">
                                {order.price}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => openOrderDrawer(order)}
                                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold cursor-pointer"
                                >
                                  Manage →
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-500">
                              No matching orders found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: LEADS PIPELINE */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Inbound Inquiries & Leads Pipeline ({leads.length})</span>
                  </h3>
                  <div className="flex gap-1.5">
                    {['ALL', 'New', 'Contacted', 'Interested', 'Proposal Sent', 'Converted', 'Lost'].map(st => (
                      <button
                        key={st}
                        onClick={() => setLeadFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          leadFilter === st ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {leads
                    .filter(l => leadFilter === 'ALL' || l.status === leadFilter)
                    .map(lead => (
                      <div key={lead.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500">{lead.id}</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-cyan-400 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Interested">Interested</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </div>

                        <div>
                          <strong className="text-white text-sm block">{lead.name}</strong>
                          <span className="text-xs text-cyan-300 block">{lead.service}</span>
                          <span className="text-[11px] text-yellow-400 font-mono block">Budget: {lead.budget}</span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {lead.message}
                        </p>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">{formatDate(lead.date)}</span>
                          <a
                            href={createWhatsAppUrl(lead.phone, `Hello ${lead.name}, regarding your inquiry for ${lead.service}:`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM QUOTES */}
            {activeTab === 'quotes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-yellow-400" />
                    <span>Custom Quotes Requests ({quotes.length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotes.map(quote => (
                    <div key={quote.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-yellow-400">{quote.id}</span>
                        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                          {quote.status}
                        </span>
                      </div>

                      <div>
                        <strong className="text-white text-sm block">{quote.name}</strong>
                        <span className="text-xs text-slate-300 block">Service: {quote.service}</span>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span>Target: <strong className="text-white">{quote.targetBudget}</strong></span>
                          <span>Timeline: <strong className="text-white">{quote.targetDeadline}</strong></span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-slate-950 text-xs text-slate-300 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase block font-mono">Scope Needed:</span>
                        {quote.scopeDescription}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{formatDate(quote.createdAt)}</span>
                        <a
                          href={createWhatsAppUrl(quote.whatsapp, `Hello ${quote.name}, regarding your Custom Quote Request #${quote.id} for ${quote.service}:`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Proposal</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS & CONFIGURATION */}
            {activeTab === 'settings' && (
              <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4 text-cyan-400" />
                    <span>Business Details & Direct Payment Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update your official UPI ID, WhatsApp number, and Bank account placeholders shown to clients across the app.
                  </p>
                </div>

                {settingsSaveMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{settingsSaveMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.ownerName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.businessName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Official WhatsApp Number *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Official Business Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Direct Payment Configuration */}
                  <div className="pt-3 border-t border-slate-800">
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block mb-3">
                      Direct Payment Details (UPI & Bank)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Official UPI ID (e.g. surajmaurya@upi)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.upiId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Bank Account Holder
                        </label>
                        <input
                          type="text"
                          value={settingsForm.accountHolder}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accountHolder: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={settingsForm.bankName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.accountNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accountNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={settingsForm.ifscCode}
                          onChange={(e) => setSettingsForm({ ...settingsForm, ifscCode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-yellow-400"
                        />
                      </div>

                      <div className="sm:col-span-2 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                        <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center justify-between">
                          <span>🔑 Admin Login Password (Yahan se badlein)</span>
                          <span className="text-[10px] text-slate-400 font-normal">Next login me yahi password kaam karega</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Suraj@5556pm"
                          value={settingsForm.adminPassword || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          Aap apna manchaha password yahan likh kar niche <strong>Save All Settings</strong> dabayein.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All Settings</span>
                  </button>
                </form>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
