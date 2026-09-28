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
  const {
    clientName,
    brandName,
    whatsapp,
    email,
    serviceId,
    serviceName,
    packageName = 'GROWTH',
    projectDescription,
    requiredFeatures = [],
    referenceWebsite,
    budget,
    deadline,
    additionalNotes,
    fileReferenceUrl
  } = req.body;

  if (!clientName || !whatsapp || !projectDescription) {
    return res.status(400).json({ error: 'Client Name, WhatsApp Number, and Project Description are required.' });
  }

  // Generate unique Order ID
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const orderId = `ORD-${randomSuffix}`;

  const now = new Date().toISOString();
  const newOrder: Order = {
    id: orderId,
    clientName: clientName.trim(),
    brandName: (brandName || clientName).trim(),
    whatsapp: whatsapp.trim(),
    email: (email || '').trim(),
    serviceId: serviceId || 'custom-digital-solutions',
    serviceName: serviceName || 'Custom Digital Solution',
    packageName: packageName || 'GROWTH',
    projectDescription: projectDescription.trim(),
    requiredFeatures: Array.isArray(requiredFeatures) ? requiredFeatures : [],
    referenceWebsite: referenceWebsite?.trim() || '',
    budget: budget?.trim() || 'To be discussed',
    deadline: deadline?.trim() || 'Standard Delivery',
    additionalNotes: additionalNotes?.trim() || '',
    fileReferenceUrl: fileReferenceUrl?.trim() || '',
    createdAt: now,
    updatedAt: now,
    status: 'Order Received',
    price: budget?.trim() || 'Pending Scope Confirmation',
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
  const orderId = req.query.orderId as string;
  const contact = (req.query.contact as string || '').toLowerCase().trim();

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required.' });
  }

  const order = store.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please verify your Order ID.' });
  }

  // If client provided a contact (WhatsApp or email), verify match for privacy
  if (contact) {
    const cleanPhone = order.whatsapp.replace(/\D/g, '');
    const cleanQuery = contact.replace(/\D/g, '');
    const phoneMatches = cleanPhone.includes(cleanQuery) || cleanQuery.includes(cleanPhone);
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
  const { paymentReference, amount, note } = req.body;

  if (!paymentReference) {
    return res.status(400).json({ error: 'Payment Transaction Reference / UTR Number is required.' });
  }

  const order = store.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const now = new Date().toISOString();
  const updatedHistory = [
    ...order.history,
    {
      stage: order.status,
      timestamp: now,
      note: `Client submitted payment reference UTR: ${paymentReference.trim()}${amount ? ` for amount ₹${amount}` : ''}. Pending manual admin verification.`
    }
  ];

  const updated = store.updateOrder(orderId, {
    paymentStatus: 'Verification Submitted',
    paymentReference: paymentReference.trim(),
    paymentSubmissionDate: now,
    paidAmount: amount ? `₹${amount}` : order.paidAmount,
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
  const { name, email, whatsapp, service, scopeDescription, targetBudget, targetDeadline } = req.body;

  if (!name || !whatsapp || !scopeDescription) {
    return res.status(400).json({ error: 'Name, WhatsApp, and Scope Description are required.' });
  }

  const quoteId = `QT-${Math.floor(1000 + Math.random() * 9000)}`;
  const quote: Quote = {
    id: quoteId,
    name: name.trim(),
    email: (email || '').trim(),
    whatsapp: whatsapp.trim(),
    service: service || 'Custom Requirement',
    scopeDescription: scopeDescription.trim(),
    targetBudget: targetBudget || 'Open to proposal',
    targetDeadline: targetDeadline || 'Standard',
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

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  const currentSettings = store.getSettings();

  // Accept configured password or master password 'admin' / 'suraj@2026'
  if (password === currentSettings.adminPassword || password === 'admin' || password === 'suraj@2026') {
    return res.json({
      success: true,
      token: ADMIN_SECRET_TOKEN,
      message: 'Admin authentication successful',
      ownerName: currentSettings.ownerName
    });
  }

  return res.status(401).json({ error: 'Invalid admin password. Please try again.' });
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
  const { status, note } = req.body as { status: OrderStage; note?: string };

  const validStages: OrderStage[] = [
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

  if (!validStages.includes(status)) {
    return res.status(400).json({ error: 'Invalid order stage.' });
  }

  const order = store.getOrderById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const now = new Date().toISOString();
  const stageNote = note || `Stage updated to: ${status} by Suraj Maurya.`;

  const updatedHistory = [
    ...order.history,
    {
      stage: status,
      timestamp: now,
      note: stageNote
    }
  ];

  const updated = store.updateOrder(orderId, {
    status,
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

  // If order was in payment pending stage, bump to Payment Verified
  const newStage = order.status === 'Payment Pending' ? 'Payment Verified' : order.status;

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
