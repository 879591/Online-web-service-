import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PackagesSection } from './components/PackagesSection';
import { DirectPaymentSection } from './components/DirectPaymentSection';
import { PortfolioSection } from './components/PortfolioSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { QuoteModal } from './components/QuoteModal';
import { LegalModal } from './components/LegalModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsAppWidget } from './components/FloatingWhatsAppWidget';
import { OfflineIndicator } from './components/OfflineIndicator';

import { 
  initialServices, initialPackages, initialPortfolio, 
  initialFAQs, initialSettings 
} from '../server/data';
import { Service, Package, PortfolioItem, FAQItem, Settings, Order } from './types/index';
import { safeApiFetch } from './utils/api';

export default function App() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  // Modal States
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedPackageName, setSelectedPackageName] = useState<string | undefined>(undefined);

  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string>('');

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms' | 'refund' | 'contact'>('privacy');

  // Load latest data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, packagesRes, portfolioRes, faqsRes, settingsRes] = await Promise.all([
          safeApiFetch<Service[]>('/api/services'),
          safeApiFetch<Package[]>('/api/packages'),
          safeApiFetch<PortfolioItem[]>('/api/portfolio'),
          safeApiFetch<FAQItem[]>('/api/faqs'),
          safeApiFetch<Settings>('/api/settings')
        ]);

        if (servicesRes.ok && servicesRes.data) setServices(servicesRes.data);
        if (packagesRes.ok && packagesRes.data) setPackages(packagesRes.data);
        if (portfolioRes.ok && portfolioRes.data) setPortfolio(portfolioRes.data);
        if (faqsRes.ok && faqsRes.data) setFaqs(faqsRes.data);
        if (settingsRes.ok && settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.error('API load error, keeping default state:', err);
      }
    };

    fetchData();
  }, []);

  const handleOpenOrder = (serviceId?: string, packageName?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedPackageName(packageName);
    setOrderModalOpen(true);
  };

  const handleOpenTracker = (orderId?: string) => {
    setTrackerOrderId(orderId || '');
    setTrackerModalOpen(true);
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms' | 'refund' | 'contact') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const handleOrderSuccess = (newOrder: Order) => {
    // When order is successfully placed, tracker can be opened directly
    setTrackerOrderId(newOrder.id);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Main Top Navigation */}
      <Navbar
        settings={settings}
        onOpenOrder={handleOpenOrder}
        onOpenTracker={handleOpenTracker}
        onOpenQuote={() => setQuoteModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          settings={settings}
          onOpenOrder={handleOpenOrder}
          onOpenTracker={() => handleOpenTracker('ORD-729410')}
          onOpenQuote={() => setQuoteModalOpen(true)}
        />

        {/* 2. Services Section (12 Services) */}
        <ServicesSection
          services={services}
          settings={settings}
          onSelectService={(id) => handleOpenOrder(id)}
        />

        {/* 3. Packages Section (Starter, Growth, Pro, Custom) */}
        <PackagesSection
          packages={packages}
          settings={settings}
          onSelectPackage={(pkg) => handleOpenOrder(undefined, pkg)}
        />

        {/* 4. Portfolio Section (Websites, Funnels, Branding, Design) */}
        <PortfolioSection
          portfolio={portfolio}
          onOrderSimilar={(title) => handleOpenOrder(undefined, 'GROWTH')}
        />

        {/* 5. How It Works Section (5-Step Process) */}
        <HowItWorksSection
          onOpenOrder={() => handleOpenOrder()}
          onOpenTracker={() => handleOpenTracker()}
        />

        {/* 6. Direct Payment Section (UPI & Bank Details, No Gateway) */}
        <DirectPaymentSection
          settings={settings}
          onOpenTracker={() => handleOpenTracker()}
        />

        {/* 7. About Suraj Maurya Section */}
        <AboutSection
          settings={settings}
          onOpenOrder={() => handleOpenOrder()}
        />

        {/* 8. FAQ Section */}
        <FAQSection
          faqs={faqs}
          settings={settings}
        />

        {/* 9. Contact Section */}
        <ContactSection
          settings={settings}
          services={services}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenOrder={() => handleOpenOrder()}
        onOpenTracker={() => handleOpenTracker()}
        onOpenLegal={handleOpenLegal}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Floating WhatsApp Quick Chat Widget */}
      <FloatingWhatsAppWidget
        settings={settings}
        onOpenOrder={() => handleOpenOrder()}
      />

      {/* Modals & Dialogs */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        services={services}
        packages={packages}
        settings={settings}
        initialServiceId={selectedServiceId}
        initialPackageName={selectedPackageName}
        onOrderSuccess={handleOrderSuccess}
        onOpenTracker={handleOpenTracker}
      />

      <OrderTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        settings={settings}
        defaultOrderId={trackerOrderId}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        settings={settings}
      />

      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        settings={settings}
        initialTab={legalTab}
      />

      <AdminDashboard
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        settings={settings}
        onSettingsUpdate={(updated) => setSettings(updated)}
      />

    </div>
  );
}
