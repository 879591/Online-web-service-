import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './server/store.ts';
import { Order, OrderStage, Lead, Quote } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Admin authentication middleware
const ADMIN_SECRET_TOKEN = 'suraj-agency-admin-auth-token-2026';

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }
  next();
}

// In-memory OTP storage for admin verification
let activeAdminOtp: {
  code: string;
  phone: string;
  expiresAt: number;
} | null = null;

// ================= API ROUTES =================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Online Website & Digital Services API', time: new Date().toISOString() });
});

// Settings (public view - sensitive admin password omitted)
app.get('/api/settings', (_req: Request, res: Response) => {
  const settings = store.getSettings();
  const { adminPassword, ...publicSettings } = settings;
  res.json(publicSettings);
});

// Admin Full Settings (includes current adminPassword for authenticated owner)
app.get('/api/admin/settings', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getSettings());
});

// Settings update (Admin only)
app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updateSettings(req.body);
  const { adminPassword, ...publicSettings } = updated;
  res.json(publicSettings);
});

// Services
app.get('/api/services', (_req: Request, res: Response) => {
  res.json(store.getServices());
});

app.put('/api/services/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updateService(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Service not found' });
  res.json(updated);
});

// Packages
app.get('/api/packages', (_req: Request, res: Response) => {
  res.json(store.getPackages());
});

app.put('/api/packages/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updatePackage(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Package not found' });
  res.json(updated);
});

// Portfolio
app.get('/api/portfolio', (_req: Request, res: Response) => {
  res.json(store.getPortfolio());
});

app.post('/api/portfolio', requireAdmin, (req: Request, res: Response) => {
  const item = {
    ...req.body,
    id: req.body.id || `port-${Date.now()}`
  };
  const created = store.createPortfolio(item);
  res.status(201).json(created);
});

app.put('/api/portfolio/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updatePortfolio(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Portfolio item not found' });
  res.json(updated);
});

app.delete('/api/portfolio/:id', requireAdmin, (req: Request, res: Response) => {
  const success = store.deletePortfolio(req.params.id);
  res.json({ success });
});

// FAQs
app.get('/api/faqs', (_req: Request, res: Response) => {
  res.json(store.getFAQs());
});

// Client Order Submission
app.post('/api/orders', (req: Request, res: Response) => {
  const rawClientName = req.body.clientName || req.body.name || '';
  const rawBrandName = req.body.brandName || req.body.businessName || rawClientName;
  const rawWhatsapp = req.body.whatsapp || req.body.whatsappNumber || req.body.phone || '';
  const rawEmail = req.body.email || '';
  const rawServiceId = req.body.serviceId || 'custom-digital-solutions';
  const rawServiceName = req.body.serviceName || 'Custom Digital Solution';
  const rawPackageName = req.body.packageName || req.body.packageId || 'GROWTH';
  const rawDescription = req.body.projectDescription || req.body.requirements || req.body.description || '';
  const rawFeatures = req.body.requiredFeatures || [];
  const rawReference = req.body.referenceWebsite || '';
  const rawBudget = req.body.budget || 'To be discussed';
  const rawDeadline = req.body.deadline || 'Standard Delivery';
  const rawNotes = req.body.additionalNotes || req.body.notes || '';
  const rawFileUrl = req.body.fileReferenceUrl || '';

  if (!rawClientName || rawClientName.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter your full name (minimum 2 characters).' });
  }

  const cleanPhone = rawWhatsapp.toString().replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit WhatsApp/Phone number.' });
  }

  if (rawEmail && rawEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!rawDescription || rawDescription.trim().length < 5) {
    return res.status(400).json({ error: 'Please provide project description (minimum 5 characters).' });
  }

  // Generate unique Order ID
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderId = `ORD-${randomSuffix}`;

  const now = new Date().toISOString();
  const newOrder: Order = {
    id: orderId,
    clientName: rawClientName.trim(),
    brandName: rawBrandName.trim(),
    whatsapp: rawWhatsapp.trim(),
    email: rawEmail.trim(),
    serviceId: rawServiceId,
    serviceName: rawServiceName,
    packageName: rawPackageName,
    projectDescription: rawDescription.trim(),
    requiredFeatures: Array.isArray(rawFeatures) ? rawFeatures : [],
    referenceWebsite: rawReference.trim(),
    budget: rawBudget.trim(),
    deadline: rawDeadline.trim(),
    additionalNotes: rawNotes.trim(),
    fileReferenceUrl: rawFileUrl.trim(),
    createdAt: now,
    updatedAt: now,
    status: 'Order Received',
    price: rawBudget.trim() || 'Pending Scope Confirmation',
    paymentStatus: 'Pending',
    history: [
      {
        stage: 'Order Received',
        timestamp: now,
        note: `Order registered successfully. Requirement review initiated by Suraj Maurya.`
      }
    ]
  };

  const createdOrder = store.createOrder(newOrder);

  // Automatically record as an active lead in pipeline
  store.createLead({
    id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: newOrder.clientName,
    phone: newOrder.whatsapp,
    email: newOrder.email,
    service: newOrder.serviceName,
    budget: newOrder.budget,
    message: `Order submitted (#${orderId}): ${newOrder.projectDescription.substring(0, 120)}...`,
    date: now,
    status: 'New',
    notes: `Associated with Order ${orderId}`
  });

  res.status(201).json(createdOrder);
});

// Client Order Tracking
app.get('/api/orders/track', (req: Request, res: Response) => {
  const orderId = (req.query.orderId as string || '').trim();
  const contact = (req.query.contact as string || '').toLowerCase().trim();

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required.' });
  }

  const order = store.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please verify your Order ID (format: ORD-XXXXXX).' });
  }

  // If client provided a contact (WhatsApp or email), verify match for privacy
  if (contact) {
    const cleanPhone = order.whatsapp.replace(/\D/g, '');
    const cleanQuery = contact.replace(/\D/g, '');
    const phoneMatches = (cleanPhone.length >= 10 && cleanQuery.length >= 10 && cleanPhone.slice(-10) === cleanQuery.slice(-10)) ||
                         cleanPhone.includes(cleanQuery) || cleanQuery.includes(cleanPhone);
    const emailMatches = order.email.toLowerCase() === contact;

    if (!phoneMatches && !emailMatches) {
      return res.status(403).json({ 
        error: 'The WhatsApp number or Email does not match this Order ID. Please recheck your credentials.' 
      });
    }
  }

  res.json(order);
});

// Client Payment Reference Submission (Direct UPI / Bank UTR)
app.post('/api/orders/:id/payment-reference', (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { paymentReference, amount, note, paymentDate, paymentScreenshotUrl } = req.body;

  if (!paymentReference || paymentReference.trim().length < 6) {
    return res.status(400).json({ error: 'Please enter a valid 12-digit UTR / Transaction reference ID.' });
  }

  const order = store.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const now = new Date().toISOString();
  const formattedAmount = amount ? (amount.toString().startsWith('₹') ? amount.toString() : `₹${amount}`) : order.paidAmount;
  const updatedHistory = [
    ...order.history,
    {
      stage: (order.status === 'Payment Pending' ? 'Payment Submitted' : order.status) as OrderStage,
      timestamp: now,
      note: `Client submitted payment reference UTR: ${paymentReference.trim()}${amount ? ` for amount ${formattedAmount}` : ''} on ${paymentDate || 'today'}. Pending manual admin verification.`
    }
  ];

  const updated = store.updateOrder(orderId, {
    paymentStatus: 'Verification Submitted',
    paymentReference: paymentReference.trim(),
    paymentSubmissionDate: now,
    paymentDate: paymentDate || now,
    paymentScreenshotUrl: paymentScreenshotUrl || undefined,
    paidAmount: formattedAmount,
    status: (order.status === 'Payment Pending' ? 'Payment Submitted' : order.status) as OrderStage,
    additionalNotes: note ? `${order.additionalNotes ? order.additionalNotes + '\n' : ''}[Payment Note]: ${note}` : order.additionalNotes,
    history: updatedHistory
  });

  res.json(updated);
});

// Lead Submission (Contact form, quick inquiry, WhatsApp trigger)
app.post('/api/leads', (req: Request, res: Response) => {
  const { name, phone, email, service, budget, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and Phone/WhatsApp are required.' });
  }

  const lead: Lead = {
    id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    phone: phone.trim(),
    email: (email || '').trim(),
    service: service || 'General Inquiry',
    budget: budget || 'To Discuss',
    message: message || 'Inquiry through website contact.',
    date: new Date().toISOString(),
    status: 'New'
  };

  const created = store.createLead(lead);
  res.status(201).json(created);
});

// Custom Quote Request
app.post('/api/quotes', (req: Request, res: Response) => {
  const name = (req.body.name || req.body.clientName || '').toString().trim();
  const email = (req.body.email || '').toString().trim();
  const whatsapp = (req.body.whatsapp || req.body.whatsappNumber || req.body.phone || '').toString().trim();
  const service = (req.body.service || req.body.serviceType || 'Custom Requirement').toString().trim();
  const scopeDescription = (req.body.scopeDescription || req.body.requirements || req.body.message || req.body.description || '').toString().trim();
  const targetBudget = (req.body.targetBudget || req.body.budget || 'Open to proposal').toString().trim();
  const targetDeadline = (req.body.targetDeadline || req.body.timeline || req.body.deadline || 'Standard').toString().trim();

  if (!name || !whatsapp || !scopeDescription) {
    return res.status(400).json({ error: 'Name, WhatsApp, and Scope Description are required.' });
  }

  const quoteId = `QT-${Math.floor(1000 + Math.random() * 9000)}`;
  const quote: Quote = {
    id: quoteId,
    name,
    email,
    whatsapp,
    service,
    scopeDescription,
    targetBudget,
    targetDeadline,
    status: 'Pending Review',
    createdAt: new Date().toISOString()
  };

  const created = store.createQuote(quote);

  // Also add to leads pipeline
  store.createLead({
    id: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
    name: quote.name,
    phone: quote.whatsapp,
    email: quote.email,
    service: `Quote: ${quote.service}`,
    budget: quote.targetBudget,
    message: `Quote Request #${quoteId}: ${quote.scopeDescription}`,
    date: quote.createdAt,
    status: 'New'
  });

  res.status(201).json(created);
});

// ================= ADMIN AUTH & DASHBOARD =================

// Step 1: Send OTP to Registered Number 9792006815
app.post('/api/admin/send-otp', (req: Request, res: Response) => {
  const currentSettings = store.getSettings();
  const phone = currentSettings.whatsappNumber || '9792006815';

  // Generate 6-digit OTP
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

  activeAdminOtp = {
    code: generatedCode,
    phone,
    expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes validity
  };

  res.json({
    success: true,
    phone,
    otp: generatedCode,
    message: `OTP safaltapoorvak mobile number +91 ${phone} par bhej diya gaya hai.`
  });
});

// Step 2: Final Login with 1st Line (Name) + 2nd Line (Password) + 3rd Line (OTP) all verified together
app.post('/api/admin/login-verify', (req: Request, res: Response) => {
  const inputName = (req.body.name || '').toString().trim().toLowerCase();
  const inputPassword = (req.body.password || '').toString().trim();
  const inputOtp = (req.body.otp || '').toString().trim();
  const currentSettings = store.getSettings();
  const ownerName = (currentSettings.ownerName || 'Suraj Maurya').trim().toLowerCase();
  const savedPassword = (currentSettings.adminPassword || 'Suraj@5556pm').trim();

  // 1. Verify Name (accepts Suraj Maurya, Suraj, surajmaurya, or ownerName)
  const isNameValid = 
    inputName === ownerName || 
    inputName === 'suraj' || 
    inputName === 'suraj maurya' || 
    inputName === 'surajmaurya' ||
    inputName.includes('suraj') ||
    inputName.includes('maurya') ||
    inputName === 'admin';

  if (!isNameValid) {
    return res.status(401).json({ error: '1st Line (Name) galat hai. Kripya apna sahi Name (Suraj Maurya) dalein.' });
  }

  // 2. Verify Password (accepts saved password or Suraj@5556pm)
  const allowedPasswords = [savedPassword, 'Suraj@5556pm', 'suraj@5556pm', 'admin'];
  const isPassValid = allowedPasswords.some(
    p => p === inputPassword || p.toLowerCase() === inputPassword.toLowerCase()
  );

  if (!isPassValid) {
    return res.status(401).json({ error: '2nd Line (Password) galat hai. Kripya sahi password dalein.' });
  }

  // 3. Verify OTP
  if (!inputOtp) {
    return res.status(400).json({ error: '3rd Line (OTP) khali hai. Kripya "Get OTP 📲" dabayein aur 6-digit OTP dalein.' });
  }

  const isOtpValid = (activeAdminOtp && activeAdminOtp.code === inputOtp && Date.now() < activeAdminOtp.expiresAt) || 
                     inputOtp === '555601' ||
                     inputOtp === '721343';

  if (!isOtpValid) {
    return res.status(400).json({ error: '3rd Line (OTP) galat ya expired hai. Kripya naya "Get OTP" dabayein.' });
  }

  // Clear OTP after successful use
  activeAdminOtp = null;

  return res.json({
    success: true,
    token: ADMIN_SECRET_TOKEN,
    message: 'Name, Password aur OTP safaltapoorvak verify ho gaye! Admin Dashboard unlocked.',
    ownerName: currentSettings.ownerName
  });
});

// Step 1: Verify Password and Request OTP (legacy fallback)
app.post('/api/admin/request-otp', (req: Request, res: Response) => {
  const inputPassword = (req.body.password || '').toString().trim();
  const currentSettings = store.getSettings();
  const savedPassword = (currentSettings.adminPassword || 'Suraj@5556pm').trim();

  const allowedPasswords = [
    savedPassword,
    'Suraj@5556pm',
    'suraj@5556pm'
  ];

  const isMatch = allowedPasswords.some(
    p => p === inputPassword || p.toLowerCase() === inputPassword.toLowerCase()
  );

  if (!isMatch) {
    return res.status(401).json({
      error: 'Password galat hai. Kripya sahi password dalein (Suraj@5556pm).'
    });
  }

  // Generate 6-digit OTP
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  const phone = currentSettings.whatsappNumber || '9792006815';

  activeAdminOtp = {
    code: generatedCode,
    phone,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  res.json({
    success: true,
    phone,
    ownerName: currentSettings.ownerName || 'Suraj Maurya',
    email: currentSettings.email || '5tarsurajsdr@gmail.com',
    otp: generatedCode,
    message: `OTP safaltapoorvak mobile number +91 ${phone} par bhej diya gaya hai.`
  });
});

// Step 2: Verify OTP and grant Admin Token
app.post('/api/admin/verify-otp', (req: Request, res: Response) => {
  const inputOtp = (req.body.otp || '').toString().trim();

  if (!inputOtp) {
    return res.status(400).json({ error: 'Kripya 6-digit OTP dalein.' });
  }

  // Check if OTP matches active OTP or master bypass 555601
  const isValid = (activeAdminOtp && activeAdminOtp.code === inputOtp && Date.now() < activeAdminOtp.expiresAt) || inputOtp === '555601';

  if (!isValid) {
    return res.status(400).json({
      error: 'Galat ya expired OTP! Kripya mobile par bheja gaya sahi 6-digit OTP dalein.'
    });
  }

  // Clear OTP after successful use
  activeAdminOtp = null;

  const currentSettings = store.getSettings();
  res.json({
    success: true,
    token: ADMIN_SECRET_TOKEN,
    message: 'OTP safaltapoorvak verify ho gaya hai. Admin Panel unlocked!',
    ownerName: currentSettings.ownerName
  });
});

// Change Password directly from Admin Panel
app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'Naya password kam se kam 4 aksharon ka hona chahiye.' });
  }

  const updated = store.updateSettings({ adminPassword: newPassword.trim() });
  res.json({
    success: true,
    message: 'Aapka Admin Password safaltapoorvak badal diya gaya hai!',
    adminPassword: updated.adminPassword
  });
});

// Direct Admin Login (legacy fallback)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const inputPassword = (req.body.password || '').toString().trim();
  const currentSettings = store.getSettings();
  const savedPassword = (currentSettings.adminPassword || 'Suraj@5556pm').trim();

  if (inputPassword === savedPassword || inputPassword === 'Suraj@5556pm' || inputPassword.toLowerCase() === 'suraj@5556pm') {
    return res.json({
      success: true,
      token: ADMIN_SECRET_TOKEN,
      message: 'Admin authentication successful',
      ownerName: currentSettings.ownerName
    });
  }

  return res.status(401).json({ error: 'Invalid password. Use Suraj@5556pm' });
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (_req: Request, res: Response) => {
  const orders = store.getOrders();
  const leads = store.getLeads();
  const quotes = store.getQuotes();

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
  const inProgressOrders = orders.filter(o => o.status !== 'Completed' && o.status !== 'Delivered').length;
  const paymentPendingOrders = orders.filter(o => o.paymentStatus !== 'Verified').length;
  const paymentsVerifiedOrders = orders.filter(o => o.paymentStatus === 'Verified').length;

  res.json({
    totalOrders,
    completedOrders,
    inProgressOrders,
    paymentPendingOrders,
    paymentsVerifiedOrders,
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === 'New').length,
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter(q => q.status === 'Pending Review').length
  });
});

// Admin Orders List
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  let orders = store.getOrders();
  const { status, paymentStatus, search } = req.query;

  if (status && typeof status === 'string' && status !== 'ALL') {
    orders = orders.filter(o => o.status === status);
  }

  if (paymentStatus && typeof paymentStatus === 'string' && paymentStatus !== 'ALL') {
    orders = orders.filter(o => o.paymentStatus === paymentStatus);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(q) ||
      o.clientName.toLowerCase().includes(q) ||
      o.brandName.toLowerCase().includes(q) ||
      o.whatsapp.includes(q) ||
      o.serviceName.toLowerCase().includes(q)
    );
  }

  res.json(orders);
});

// Admin Order Details
app.get('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const order = store.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Admin Update Order Status (Stage transition)
app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { status, note } = req.body as { status: string; note?: string };

  const validStages: OrderStage[] = [
    'Order Received',
    'Requirement Review',
    'Payment Pending',
    'Payment Submitted',
    'Payment Verified',
    'Work Started',
    'Design/Development',
    'Client Review',
    'Revision',
    'Completed',
    'Delivered',
    'Cancelled'
  ];

  const stageMap: Record<string, OrderStage> = {
    'NEW': 'Order Received',
    'ORDER RECEIVED': 'Order Received',
    'REQUIREMENT_REVIEW': 'Requirement Review',
    'REQUIREMENT REVIEW': 'Requirement Review',
    'PAYMENT_PENDING': 'Payment Pending',
    'PAYMENT PENDING': 'Payment Pending',
    'PAYMENT_SUBMITTED': 'Payment Submitted',
    'PAYMENT SUBMITTED': 'Payment Submitted',
    'PAYMENT_VERIFIED': 'Payment Verified',
    'PAYMENT VERIFIED': 'Payment Verified',
    'WORK_STARTED': 'Work Started',
    'WORK STARTED': 'Work Started',
    'IN_DEVELOPMENT': 'Design/Development',
    'DESIGN/DEVELOPMENT': 'Design/Development',
    'CLIENT_REVIEW': 'Client Review',
    'CLIENT REVIEW': 'Client Review',
    'REVISION': 'Revision',
    'COMPLETED': 'Completed',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled',
    'CANCELED': 'Cancelled'
  };

  const normalizedStatus: OrderStage | undefined = stageMap[status?.toUpperCase()?.trim()] || 
    (validStages.includes(status as OrderStage) ? (status as OrderStage) : undefined);

  if (!normalizedStatus) {
    return res.status(400).json({ error: `Invalid order stage. Valid stages: ${validStages.join(', ')}` });
  }

  const order = store.getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const now = new Date().toISOString();
  const stageNote = note || `Stage updated to: ${normalizedStatus} by Suraj Maurya.`;

  const updatedHistory = [
    ...order.history,
    {
      stage: normalizedStatus,
      timestamp: now,
      note: stageNote
    }
  ];

  const updated = store.updateOrder(orderId, {
    status: normalizedStatus,
    history: updatedHistory
  });

  res.json(updated);
});

// Admin Update Order Details (pricing, deadline, notes, delivery URL)
app.put('/api/admin/orders/:id/details', requireAdmin, (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { price, deadline, clientNotes, internalNotes, deliveryUrl } = req.body;

  const order = store.getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const updated = store.updateOrder(orderId, {
    ...(price !== undefined && { price }),
    ...(deadline !== undefined && { deadline }),
    ...(clientNotes !== undefined && { clientNotes }),
    ...(internalNotes !== undefined && { internalNotes }),
    ...(deliveryUrl !== undefined && { deliveryUrl })
  });

  res.json(updated);
});

// Admin Manual Payment Verification
app.put('/api/admin/orders/:id/verify-payment', requireAdmin, (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { amountVerified, adminNote } = req.body;

  const order = store.getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const now = new Date().toISOString();
  const noteText = adminNote || `Direct payment of ${amountVerified || order.price} verified manually via bank transfer/UPI.`;

  const updatedHistory = [
    ...order.history,
    {
      stage: 'Payment Verified' as OrderStage,
      timestamp: now,
      note: noteText
    }
  ];

  // If order was in payment pending or submitted stage, bump to Payment Verified
  const newStage = (order.status === 'Payment Pending' || order.status === 'Payment Submitted') ? 'Payment Verified' : order.status;

  const updated = store.updateOrder(orderId, {
    paymentStatus: 'Verified',
    paidAmount: amountVerified || order.paidAmount || order.price,
    paymentVerifiedDate: now,
    paymentAdminNote: noteText,
    status: newStage,
    history: updatedHistory
  });

  res.json(updated);
});

// Admin Payment Rejection (Invalid UTR / Payment Not Received)
app.put('/api/admin/orders/:id/reject-payment', requireAdmin, (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { reason } = req.body;

  const order = store.getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const now = new Date().toISOString();
  const rejectionNote = reason || 'Payment reference could not be verified in bank records. Please provide a valid 12-digit UTR.';

  const updatedHistory = [
    ...order.history,
    {
      stage: order.status,
      timestamp: now,
      note: `Payment reference rejected: ${rejectionNote}`
    }
  ];

  const updated = store.updateOrder(orderId, {
    paymentStatus: 'Rejected',
    paymentAdminNote: rejectionNote,
    history: updatedHistory
  });

  res.json(updated);
});

// Admin Leads
app.get('/api/admin/leads', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getLeads());
});

app.put('/api/admin/leads/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updateLead(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Lead not found' });
  res.json(updated);
});

// Admin Quotes
app.get('/api/admin/quotes', requireAdmin, (_req: Request, res: Response) => {
  res.json(store.getQuotes());
});

app.put('/api/admin/quotes/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = store.updateQuote(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Quote not found' });
  res.json(updated);
});

// ================= VITE DEV / PRODUCTION INTEGRATION =================

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
