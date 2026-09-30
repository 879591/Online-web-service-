import { jsPDF } from 'jspdf';
import { Order, Settings } from '../types/index.ts';

export function createInvoiceDoc(order: Order, settings: Settings): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm

  // Background Header Accent
  doc.setFillColor(15, 23, 42); // #0f172a slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Cyan Accent Line
  doc.setFillColor(14, 165, 233); // #0ea5e9 sky-500
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ONLINE WEBSITE & DIGITAL SERVICES', margin, 16);

  doc.setFontSize(11);
  doc.setTextColor(226, 232, 240);
  doc.text('Suraj Maurya', margin, 23);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(148, 163, 184);
  doc.text('"Your Vision -> Our Digital Solution"', margin, 29);

  // Right Header Info (Invoice badge)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(250, 204, 21); // #facc15 amber-400
  doc.text('PROJECT ORDER INVOICE', pageWidth - margin, 16, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const invNumber = order.invoiceNumber || `INV-${order.id}`;
  doc.text(`Invoice No: ${invNumber}`, pageWidth - margin, 22, { align: 'right' });
  doc.text(`Order ID: ${order.id}`, pageWidth - margin, 27, { align: 'right' });
  
  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN');
  doc.text(`Date: ${formattedDate}`, pageWidth - margin, 32, { align: 'right' });

  // Reset text color for body
  let y = 54;

  // Billed To & Order Details Section (2 Columns)
  doc.setFillColor(248, 250, 252); // #f8fafc slate-50
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');

  // Column 1: Client Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('BILLED TO (CUSTOMER):', margin + 6, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Name: ${order.clientName || 'N/A'}`, margin + 6, y + 14);
  doc.text(`Brand / Business: ${order.brandName || 'Individual Project'}`, margin + 6, y + 19);
  doc.text(`Email: ${order.email || 'N/A'}`, margin + 6, y + 24);
  doc.text(`Mobile / WhatsApp: ${order.whatsapp || 'N/A'}`, margin + 6, y + 29);

  // Column 2: Order Metadata
  const col2X = margin + contentWidth / 2 + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ORDER & TIMELINE DETAILS:', col2X, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Service: ${order.serviceName || 'Custom Service'}`, col2X, y + 14);
  doc.text(`Package Tier: ${order.packageName || 'CUSTOM'}`, col2X, y + 19);
  doc.text(`Expected Deadline: ${order.deadline || 'Standard (5-7 Days)'}`, col2X, y + 24);
  
  const paymentStatusText = order.paymentStatus === 'Verified' ? 'VERIFIED' : 'PAYMENT PENDING';
  doc.text(`Payment Status: ${paymentStatusText}`, col2X, y + 29);

  y += 46;

  // Items Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, y, contentWidth, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 4, y + 6);
  doc.text('SERVICE SCOPE & DESCRIPTION', margin + 14, y + 6);
  doc.text('PACKAGE', margin + 115, y + 6);
  doc.text('AMOUNT', pageWidth - margin - 4, y + 6, { align: 'right' });

  y += 9;

  // Table Row 1 (Item)
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 34, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 34, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1', margin + 4, y + 7);
  doc.text(order.serviceName || 'Digital Solution Development', margin + 14, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);

  const cleanDescription = (order.projectDescription || 'Custom development and deployment services').replace(/[\r\n]+/g, ' ');
  const splitDesc = doc.splitTextToSize(cleanDescription, 95);
  doc.text(splitDesc.slice(0, 3), margin + 14, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(order.packageName || 'CUSTOM', margin + 115, y + 7);

  const displayPrice = order.price || order.budget || 'Custom';
  doc.setFontSize(9.5);
  doc.text(displayPrice, pageWidth - margin - 4, y + 7, { align: 'right' });

  y += 34;

  // Summary Totals Box
  const summaryBoxWidth = 80;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  doc.setFillColor(248, 250, 252);
  doc.rect(summaryX, y + 2, summaryBoxWidth, 22, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(summaryX, y + 2, summaryBoxWidth, 22, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal:', summaryX + 4, y + 8);
  doc.text(displayPrice, summaryX + summaryBoxWidth - 4, y + 8, { align: 'right' });

  doc.text('Taxes / Additional Fees:', summaryX + 4, y + 13);
  doc.text('₹0.00', summaryX + summaryBoxWidth - 4, y + 13, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Final Payable Amount:', summaryX + 4, y + 19);
  doc.text(displayPrice, summaryX + summaryBoxWidth - 4, y + 19, { align: 'right' });

  y += 28;

  // Payment Instructions (Manual UPI & Bank details)
  doc.setFillColor(254, 252, 232); // yellow-50
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');
  doc.setDrawColor(250, 204, 21);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(133, 77, 14); // amber-800
  doc.text('DIRECT MANUAL PAYMENT INSTRUCTIONS (Zero Gateway Charges):', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(68, 64, 60);

  const upiId = settings.upiId || 'surajmaurya@upi';
  const acct = settings.accountNumber || 'Pending Configuration';
  const ifsc = settings.ifscCode || 'Pending';
  const bank = settings.bankName || 'State Bank of India';
  const holder = settings.accountHolder || 'Suraj Maurya';

  doc.text(`Official UPI ID: ${upiId}`, margin + 6, y + 13);
  doc.text(`Bank Name: ${bank}  |  A/C No: ${acct}  |  IFSC: ${ifsc}`, margin + 6, y + 19);
  doc.text(`Account Holder: ${holder}`, margin + 6, y + 25);
  doc.text('Note: Advance payment is verified manually by admin before starting work. Please submit your UTR after paying.', margin + 6, y + 31);

  // Footer Section
  const footerY = 270;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Thank you for choosing Online Website & Digital Services.', pageWidth / 2, footerY + 6, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const whatsappNum = settings.whatsappNumber || '9792006815';
  const ownerEmail = settings.ownerEmail || '5tarsurajsdr@gmail.com';
  doc.text(`WhatsApp: +91 ${whatsappNum}  |  Email: ${ownerEmail}  |  Owner: Suraj Maurya`, pageWidth / 2, footerY + 11, { align: 'center' });
  doc.text('This is a computer-generated digital invoice. No physical signature is required.', pageWidth / 2, footerY + 16, { align: 'center' });

  return doc;
}

/**
 * Triggers browser download of the generated PDF invoice
 */
export function downloadInvoicePdf(order: Order, settings: Settings): void {
  try {
    const doc = createInvoiceDoc(order, settings);
    doc.save(`Invoice_${order.id}.pdf`);
  } catch (err) {
    console.error('Failed to generate PDF in browser:', err);
    // Fallback: trigger backend invoice route
    window.open(`/api/orders/${order.id}/invoice`, '_blank');
  }
}
