export type OrderStage = 
  | 'Order Received'
  | 'Requirement Review'
  | 'Payment Pending'
  | 'Payment Submitted'
  | 'Payment Verified'
  | 'Work Started'
  | 'Design/Development'
  | 'Client Review'
  | 'Revision'
  | 'Completed'
  | 'Delivered'
  | 'Cancelled';

export interface OrderHistoryItem {
  stage: OrderStage;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  clientName: string;
  brandName: string;
  whatsapp: string;
  email: string;
  serviceId: string;
  serviceName: string;
  packageName: 'STARTER' | 'GROWTH' | 'PRO' | 'CUSTOM';
  projectDescription: string;
  requiredFeatures: string[];
  referenceWebsite?: string;
  budget: string;
  deadline: string;
  additionalNotes?: string;
  fileReferenceUrl?: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStage;
  price: string;
  paidAmount?: string;
  paymentStatus: 'Pending' | 'Verification Submitted' | 'Verified' | 'Rejected';
  paymentReference?: string;
  paymentSubmissionDate?: string;
  paymentDate?: string;
  paymentScreenshotUrl?: string;
  paymentVerifiedDate?: string;
  paymentAdminNote?: string;
  clientNotes?: string;
  internalNotes?: string;
  deliveryUrl?: string;
  history: OrderHistoryItem[];
}

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Proposal Sent' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  date: string;
  status: LeadStatus;
  notes?: string;
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  scopeDescription: string;
  targetBudget: string;
  targetDeadline: string;
  status: 'Pending Review' | 'Proposal Prepared' | 'Sent' | 'Accepted' | 'Declined';
  adminQuotePrice?: string;
  adminEstimatedTimeline?: string;
  adminScopeNotes?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  startingPrice: string;
  deliveryTime: string;
  features: string[];
  badge?: string;
  category: string;
  iconName: string;
}

export interface Package {
  id: string;
  name: 'STARTER' | 'GROWTH' | 'PRO' | 'CUSTOM';
  subtitle: string;
  price: string;
  delivery: string;
  popular?: boolean;
  features: string[];
  bestFor: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Websites' | 'Landing Pages' | 'Funnels' | 'Branding' | 'Design' | 'Social Media';
  description: string;
  techStack: string[];
  isDemo: boolean;
  badge: string;
  accentColor: string;
  previewUrl?: string;
  highlights: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders' | 'Payments' | 'Delivery' | 'Support';
}

export interface Settings {
  ownerName: string;
  businessName: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  upiId: string;
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  adminPassword: string;
  currency: string;
}
