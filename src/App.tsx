import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/hero/Hero';
import { ProductShowcase } from './components/showcase/ProductShowcase';
import { WhyEarthSmileSection } from './components/why/WhyEarthSmileSection';
import { LiveLogoStudio } from './components/branding/LiveLogoStudio';
import { B2BSection } from './components/b2b/B2BSection';
import { ProductDetailsSection } from './components/details/ProductDetailsSection';
import { SustainabilitySection } from './components/story/SustainabilitySection';
import { TrustSection } from './components/trust/TrustSection';
import { FAQSection } from './components/faq/FAQSection';
import { ContactSection } from './components/contact/ContactSection';
import { FinalCTA } from './components/home/FinalCTA';
import { EnquiryModal } from './components/enquiry/EnquiryModal';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { BackToTop } from './components/common/BackToTop';
import { CookieBanner } from './components/common/CookieBanner';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { FloatingContactWidget } from './components/common/FloatingContactWidget';
import { SiteSearchModal } from './components/search/SiteSearchModal';
import { LegalModal, LegalTab } from './components/legal/LegalModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { authService } from './services/authService';
import { productService } from './services/productService';
import { utmTracker } from './utils/utmTracker';
import { Product } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryProductName, setEnquiryProductName] = useState<string>('');
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(authService.isAuthenticated());
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacy');

  // Initialize theme and UTM tracking on mount
  useEffect(() => {
    // 1. Theme
    try {
      const saved = localStorage.getItem('earthsmile_theme');
      if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch {
      // ignore
    }

    // 2. UTM Tracking
    utmTracker.init();
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true');

      if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsEnquiryModalOpen(false);
        setIsSearchOpen(false);
        setIsLegalOpen(false);
        handleCloseProductModal();
        return;
      }

      if (isTyping) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'h') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 'p') {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 'b') {
        handleScrollToBrandingStudio();
      } else if (e.key.toLowerCase() === 'q') {
        handleOpenEnquiry();
      } else if (e.key.toLowerCase() === 'd') {
        const root = document.documentElement;
        const isDark = root.classList.toggle('dark');
        try {
          localStorage.setItem('earthsmile_theme', isDark ? 'dark' : 'light');
        } catch {
          // ignore
        }
      } else if (e.key.toLowerCase() === 't') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 'a') {
        handleOpenAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Intersection Observer for Active Section tracking
  useEffect(() => {
    const sections = ['products', 'why-us', 'custom-branding', 'b2b', 'product-details', 'sustainability', 'faq', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchronize route and handle clean popstate
  useEffect(() => {
    setProducts(productService.getProducts());

    const parseCurrentRoute = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // 0. Admin Portal routing: /admin or #admin
      if (pathname === '/admin' || pathname.startsWith('/admin/') || hash === '#admin') {
        setIsAdminRoute(true);
        setIsAdminAuthenticated(authService.isAuthenticated());
        setSelectedProductSlug(null);
        return;
      }
      setIsAdminRoute(false);

      // 1. Direct path routing: /product/:slug or /products/:slug
      const pathMatch = pathname.match(/^\/(?:product|products)\/([a-zA-Z0-9_-]+)\/?$/i);
      if (pathMatch && pathMatch[1]) {
        setSelectedProductSlug(pathMatch[1]);
        return;
      }

      // 2. Hash routing: #product/:slug or #product-:slug
      const hashMatch = hash.match(/^#product[/-]([a-zA-Z0-9_-]+)$/i);
      if (hashMatch && hashMatch[1]) {
        setSelectedProductSlug(hashMatch[1]);
        return;
      }

      // No product modal active
      setSelectedProductSlug(null);

      // Section anchor smooth scroll support
      const targetId = (hash ? hash.replace('#', '') : pathname.replace(/^\//, '')).replace(/\/$/, '');
      if (targetId && !['product', 'products', 'admin'].includes(targetId)) {
        const el = document.getElementById(targetId);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    };

    parseCurrentRoute();

    window.addEventListener('popstate', parseCurrentRoute);
    window.addEventListener('hashchange', parseCurrentRoute);

    return () => {
      window.removeEventListener('popstate', parseCurrentRoute);
      window.removeEventListener('hashchange', parseCurrentRoute);
    };
  }, []);

  const handleOpenEnquiry = (productName?: string) => {
    setEnquiryProductName(productName || '');
    setIsEnquiryModalOpen(true);
  };

  const handleSelectProduct = (productSlug: string) => {
    setSelectedProductSlug(productSlug);
    window.history.pushState(null, '', `/product/${productSlug}`);
  };

  const handleCloseProductModal = () => {
    setSelectedProductSlug(null);
    if (window.location.pathname.startsWith('/product/') || window.location.pathname.startsWith('/products/')) {
      window.history.pushState(null, '', '/');
    } else if (window.location.hash.startsWith('#product')) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const handleScrollToBrandingStudio = () => {
    const el = document.getElementById('custom-branding');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminRoute(true);
    setIsAdminAuthenticated(authService.isAuthenticated());
    window.history.pushState(null, '', '/admin');
  };

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    window.history.pushState(null, '', '/');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    authService.logout();
    setIsAdminAuthenticated(false);
    setIsAdminRoute(false);
    window.history.pushState(null, '', '/');
  };

  const handleOpenLegalModal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  const activeDetailProduct = selectedProductSlug
    ? productService.getProductBySlug(selectedProductSlug) || null
    : null;

  const relatedProducts = activeDetailProduct
    ? productService.getRelatedProducts(activeDetailProduct.id, activeDetailProduct.category, 2)
    : [];

  // Synchronize document title
  useEffect(() => {
    if (isAdminRoute) {
      document.title = 'Administrator Portal | EARTH SMILE';
    } else if (activeDetailProduct) {
      document.title = `${activeDetailProduct.name} | EARTH SMILE`;
    } else {
      document.title = 'EARTH SMILE – Eco-Conscious Dental Care & Custom Branding';
    }
  }, [isAdminRoute, activeDetailProduct]);

  // If viewing admin route, render restricted portal
  if (isAdminRoute) {
    if (isAdminAuthenticated) {
      return (
        <AdminDashboard
          onExit={handleExitAdmin}
          onLogout={handleAdminLogout}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={handleAdminLoginSuccess}
        onExit={handleExitAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] dark:bg-[#0E1611] text-[#1C1F1D] dark:text-[#E2ECE5] selection:bg-[#E2ECE3] selection:text-[#192E22] transition-colors duration-300">
      {/* Accessibility: Skip to Content Anchor */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#192E22] focus:text-white focus:rounded-md focus:shadow-xl focus:ring-2 focus:ring-emerald-400 font-medium text-xs tracking-wide"
      >
        Skip to main content
      </a>

      {/* 0. Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 1. Premium 3-Zone Sticky Navigation */}
      <Navbar
        onOpenEnquiry={handleOpenEnquiry}
        onOpenBrandingStudio={handleScrollToBrandingStudio}
        onOpenAdmin={handleOpenAdmin}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLegal={handleOpenLegalModal}
        activeSection={activeSection}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* 2. Hero Section */}
        <Hero
          onExploreProducts={() => {
            const el = document.getElementById('products');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreBranding={handleScrollToBrandingStudio}
          onSelectProduct={handleSelectProduct}
        />

        {/* 3. Product Showcase (Bamboo Toothbrush, Bamboo Tongue Cleaner, Duo Combo) */}
        <div id="products">
          <ProductShowcase
            products={products}
            onOpenEnquiry={handleOpenEnquiry}
            onSelectProduct={handleSelectProduct}
            onOpenBrandingStudio={handleScrollToBrandingStudio}
          />
        </div>

        {/* 4. Why Earth Smile (Standards & Craftsmanship) */}
        <WhyEarthSmileSection />

        {/* 5. Custom Branding: Live Pre-Print Logo Preview Studio */}
        <LiveLogoStudio onOpenEnquiry={handleOpenEnquiry} />

        {/* 6. Business / Bulk Orders */}
        <B2BSection
          onOpenEnquiry={handleOpenEnquiry}
          onOpenBrandingStudio={handleScrollToBrandingStudio}
        />

        {/* 7. Product Details (In-depth Technical Specs of the 3 Products) */}
        <ProductDetailsSection
          products={products}
          onOpenEnquiry={handleOpenEnquiry}
          onOpenBrandingStudio={handleScrollToBrandingStudio}
        />

        {/* 8. Sustainability Story (Moso Bamboo Lifecycle) */}
        <SustainabilitySection />

        {/* Verified Material Integrity & Quality */}
        <TrustSection />

        {/* 9. Frequently Answered Questions */}
        <FAQSection />

        {/* 10. Contact / Commercial Enquiry Form */}
        <ContactSection onOpenLegal={handleOpenLegalModal} />

        {/* High-Impact Brand Call-to-Action */}
        <FinalCTA onOpenEnquiry={handleOpenEnquiry} />
      </main>

      {/* 11. Premium Agency Footer */}
      <Footer
        onOpenEnquiry={handleOpenEnquiry}
        onOpenBrandingStudio={handleScrollToBrandingStudio}
        onOpenAdmin={handleOpenAdmin}
        onOpenLegal={handleOpenLegalModal}
      />

      {/* Product Detail Modal with Live Logo Tester */}
      {activeDetailProduct && (
        <ProductDetailModal
          product={activeDetailProduct}
          onClose={handleCloseProductModal}
          onOpenEnquiry={handleOpenEnquiry}
          onSelectRelated={handleSelectProduct}
          relatedProducts={relatedProducts}
        />
      )}

      {/* Inbound Lead / Commercial Quote Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultProductName={enquiryProductName}
        onOpenLegal={handleOpenLegalModal}
      />

      {/* Universal Site Search & Command Palette (Cmd+K or /) */}
      <SiteSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenEnquiry={handleOpenEnquiry}
        onOpenBrandingStudio={handleScrollToBrandingStudio}
        onSelectProduct={handleSelectProduct}
        onOpenLegal={handleOpenLegalModal}
      />

      {/* Comprehensive Compliance, Legal & Privacy Hub Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
      />

      {/* Floating Multi-Action Contact Widget (Instant WhatsApp, Helpline, Request Quote, Copy Info) */}
      <FloatingContactWidget onOpenEnquiry={handleOpenEnquiry} />

      {/* Floating Back-to-Top Button ↑ */}
      <BackToTop />

      {/* GDPR / Privacy Cookie Banner with Preferences */}
      <CookieBanner onOpenCookiePolicy={() => handleOpenLegalModal('cookies')} />

      {/* Keyboard Shortcuts Palette / Guide */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
