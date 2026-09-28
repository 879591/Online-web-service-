import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Mail } from 'lucide-react';
import { Settings } from '../types/index';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  initialTab?: 'privacy' | 'terms' | 'refund' | 'contact';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialTab = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'refund' | 'contact'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f172a] border border-cyan-500/40 p-6 sm:p-8 shadow-2xl relative text-left my-8 max-h-[85vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="mb-6">
          <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            Official Policies & Disclosures
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {settings.businessName}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'terms'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setActiveTab('refund')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'refund'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Refund & Cancellation
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Contact Information
            </button>
          </div>
        </div>

        {/* Policy Contents */}
        <div className="text-xs text-slate-300 leading-relaxed space-y-4">
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">1. Information Collection</h4>
              <p>
                We collect information provided directly by clients when placing an order, requesting a quote, or contacting us. This includes your Name, Business Name, WhatsApp Number, Email, and Project Requirements.
              </p>
              <h4 className="text-sm font-bold text-white">2. Use of Information</h4>
              <p>
                Your details are strictly used to communicate project updates, generate order tracking statuses, and fulfill digital design and development services. We never sell or share your contact data with third-party advertisers.
              </p>
              <h4 className="text-sm font-bold text-white">3. Direct Payment Verification Data</h4>
              <p>
                Any transaction reference numbers (UTR) submitted on our website are used exclusively for manual accounting and fraud prevention. We do not store sensitive credit card or net-banking credentials.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">1. Project Scope & Deliverables</h4>
              <p>
                Deliverables for each website, landing page, or funnel are governed by the agreed package features and confirmed order specifications. Any scope additions during development may be quoted separately.
              </p>
              <h4 className="text-sm font-bold text-white">2. Direct Payment Policy</h4>
              <p>
                All payments are processed directly to Suraj Maurya's designated UPI ID or official bank account. Advance payments must be manually verified prior to project initiation.
              </p>
              <h4 className="text-sm font-bold text-white">3. Revisions & Approvals</h4>
              <p>
                Each service tier includes specified revision rounds. Clients are provided a live preview link to review designs before final deployment or code delivery.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">1. Cancellation Policy</h4>
              <p>
                Orders may be cancelled before the "Work Started" phase with full refund of the unutilized advance minus administrative fees.
              </p>
              <h4 className="text-sm font-bold text-white">2. Work in Progress</h4>
              <p>
                Once wireframing, custom code, or design sprint has commenced (Stages: Work Started, Design/Development), advances are non-refundable as dedicated developer time is allocated.
              </p>
              <h4 className="text-sm font-bold text-white">3. Client Satisfaction Guarantee</h4>
              <p>
                In the rare instance of dissatisfaction, Suraj Maurya works with you through designated revision rounds to adjust layouts, typography, and features to align with the agreed scope.
              </p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Business Information</h4>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <p><strong className="text-white">Business Name:</strong> {settings.businessName}</p>
                <p><strong className="text-white">Owner & Lead Developer:</strong> {settings.ownerName}</p>
                <p><strong className="text-white">Official WhatsApp:</strong> {settings.whatsappNumber}</p>
                <p><strong className="text-white">Official Email:</strong> {settings.email}</p>
                <p><strong className="text-white">Official UPI ID:</strong> {settings.upiId}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
