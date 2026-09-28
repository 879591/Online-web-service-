import { OrderStage } from '../types/index.ts';

// Clean phone number for WhatsApp links (digits only)
export function getCleanWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

// Generate direct WhatsApp chat URL with pre-filled message
export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = getCleanWhatsApp(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// Generate UPI intent URI for direct mobile app payment
export function createUpiPaymentUri(upiId: string, payeeName: string, amount?: string, note?: string): string {
  const cleanAmount = amount ? amount.replace(/[^0-9.]/g, '') : '';
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    cu: 'INR',
    ...(cleanAmount ? { am: cleanAmount } : {}),
    tn: note || 'Digital Service Payment'
  });
  return `upi://pay?${params.toString()}`;
}

// Order Stage helper list
export const ORDER_STAGES: OrderStage[] = [
  'Order Received',
  'Requirement Review',
  'Payment Pending',
  'Payment Verified',
  'Work Started',
  'Design/Development',
  'Client Review',
  'Revision',
  'Completed',
  'Delivered'
];

// Helper to get stage index (0 to 9)
export function getStageIndex(stage: OrderStage): number {
  const idx = ORDER_STAGES.indexOf(stage);
  return idx >= 0 ? idx : 0;
}

// Stage badge color
export function getStageColor(stage: OrderStage): { bg: string; text: string; border: string } {
  switch (stage) {
    case 'Order Received':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'Requirement Review':
      return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' };
    case 'Payment Pending':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'Payment Verified':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'Work Started':
      return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' };
    case 'Design/Development':
      return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' };
    case 'Client Review':
      return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' };
    case 'Revision':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' };
    case 'Completed':
      return { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' };
    case 'Delivered':
      return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-400/50' };
    default:
      return { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
  }
}

// Format date in human-friendly IST / Local
export function formatDate(isoString?: string): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
