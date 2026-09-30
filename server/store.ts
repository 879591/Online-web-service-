import fs from 'fs';
import path from 'path';
import { 
  Service, Package, PortfolioItem, FAQItem, Settings, Order, Lead, Quote 
} from '../src/types/index.ts';
import { 
  initialServices, initialPackages, initialPortfolio, initialFAQs, 
  initialSettings, initialOrders, initialLeads, initialQuotes 
} from './data.ts';

export interface DatabaseSchema {
  orders: Order[];
  leads: Lead[];
  quotes: Quote[];
  services: Service[];
  packages: Package[];
  portfolio: PortfolioItem[];
  faqs: FAQItem[];
  settings: Settings;
}

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? path.join('/tmp', 'suraj_agency_data') : path.resolve('data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_FILE = path.resolve('data', 'db.json');

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          orders: parsed.orders || initialOrders,
          leads: parsed.leads || initialLeads,
          quotes: parsed.quotes || initialQuotes,
          services: parsed.services || initialServices,
          packages: parsed.packages || initialPackages,
          portfolio: parsed.portfolio || initialPortfolio,
          faqs: parsed.faqs || initialFAQs,
          settings: { ...initialSettings, ...(parsed.settings || {}) }
        };
      }

      if (fs.existsSync(SEED_FILE)) {
        const raw = fs.readFileSync(SEED_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const data: DatabaseSchema = {
          orders: parsed.orders || initialOrders,
          leads: parsed.leads || initialLeads,
          quotes: parsed.quotes || initialQuotes,
          services: parsed.services || initialServices,
          packages: parsed.packages || initialPackages,
          portfolio: parsed.portfolio || initialPortfolio,
          faqs: parsed.faqs || initialFAQs,
          settings: { ...initialSettings, ...(parsed.settings || {}) }
        };
        this.saveData(data);
        return data;
      }
    } catch (err) {
      console.error('Error reading db.json, falling back to initial seed:', err);
    }

    const initial: DatabaseSchema = {
      orders: initialOrders,
      leads: initialLeads,
      quotes: initialQuotes,
      services: initialServices,
      packages: initialPackages,
      portfolio: initialPortfolio,
      faqs: initialFAQs,
      settings: initialSettings
    };

    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not persist to disk, keeping in memory:', err);
    }
  }

  // Orders
  getOrders(): Order[] {
    return this.data.orders;
  }

  getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id.toLowerCase() === id.toLowerCase().trim());
  }

  getRecentOrderByIdempotency(key: string): Order | undefined {
    if (!key) return undefined;
    return this.data.orders.find(o => o.idempotencyKey === key);
  }

  createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.saveData(this.data);
    return order;
  }

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const index = this.data.orders.findIndex(o => o.id.toLowerCase() === id.toLowerCase().trim());
    if (index === -1) return null;

    this.data.orders[index] = {
      ...this.data.orders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.orders[index];
  }

  // Leads
  getLeads(): Lead[] {
    return this.data.leads;
  }

  createLead(lead: Lead): Lead {
    this.data.leads.unshift(lead);
    this.saveData(this.data);
    return lead;
  }

  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const index = this.data.leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    this.data.leads[index] = { ...this.data.leads[index], ...updates };
    this.saveData(this.data);
    return this.data.leads[index];
  }

  // Quotes
  getQuotes(): Quote[] {
    return this.data.quotes;
  }

  createQuote(quote: Quote): Quote {
    this.data.quotes.unshift(quote);
    this.saveData(this.data);
    return quote;
  }

  updateQuote(id: string, updates: Partial<Quote>): Quote | null {
    const index = this.data.quotes.findIndex(q => q.id === id);
    if (index === -1) return null;
    this.data.quotes[index] = { ...this.data.quotes[index], ...updates };
    this.saveData(this.data);
    return this.data.quotes[index];
  }

  // Services
  getServices(): Service[] {
    return this.data.services;
  }

  updateService(id: string, updates: Partial<Service>): Service | null {
    const index = this.data.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.data.services[index] = { ...this.data.services[index], ...updates };
    this.saveData(this.data);
    return this.data.services[index];
  }

  // Packages
  getPackages(): Package[] {
    return this.data.packages;
  }

  updatePackage(id: string, updates: Partial<Package>): Package | null {
    const index = this.data.packages.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.packages[index] = { ...this.data.packages[index], ...updates };
    this.saveData(this.data);
    return this.data.packages[index];
  }

  // Portfolio
  getPortfolio(): PortfolioItem[] {
    return this.data.portfolio;
  }

  createPortfolio(item: PortfolioItem): PortfolioItem {
    this.data.portfolio.unshift(item);
    this.saveData(this.data);
    return item;
  }

  updatePortfolio(id: string, updates: Partial<PortfolioItem>): PortfolioItem | null {
    const index = this.data.portfolio.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.portfolio[index] = { ...this.data.portfolio[index], ...updates };
    this.saveData(this.data);
    return this.data.portfolio[index];
  }

  deletePortfolio(id: string): boolean {
    const initialLen = this.data.portfolio.length;
    this.data.portfolio = this.data.portfolio.filter(p => p.id !== id);
    if (this.data.portfolio.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // FAQs
  getFAQs(): FAQItem[] {
    return this.data.faqs;
  }

  // Settings
  getSettings(): Settings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<Settings>): Settings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData(this.data);
    return this.data.settings;
  }
}

export const store = new Store();
