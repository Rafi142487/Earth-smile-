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
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { BackToTop } from './components/common/BackToTop';
import { CookieBanner } from './components/common/CookieBanner';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { authService } from './services/authService';
import { productService } from './services/productService';
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

  // Initialize theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('earthsmile_theme');
      if (saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch {
      // ignore
    }
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
        handleCloseProductModal();
        return;
      }

      if (isTyping) return;

      if (e.key === '?' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
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

  // Load products and synchronize route on mount and navigation
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

      // Section anchor smooth scroll support (e.g. /why-us, #b2b, #custom-branding)
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

  const handleAdminLogout = () => {
    authService.logout();
    setIsAdminAuthenticated(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  // Find active product for modal if selected
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
      {/* 0. Top Reading Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 1. Premium 3-Zone Sticky Navigation */}
      <Navbar
        onOpenEnquiry={handleOpenEnquiry}
        onOpenBrandingStudio={handleScrollToBrandingStudio}
        onOpenAdmin={handleOpenAdmin}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        activeSection={activeSection}
      />

      <main className="flex-1">
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
        <ContactSection />

        {/* High-Impact Brand Call-to-Action */}
        <FinalCTA onOpenEnquiry={handleOpenEnquiry} />
      </main>

      {/* 11. Premium Agency Footer */}
      <Footer
        onOpenEnquiry={handleOpenEnquiry}
        onOpenBrandingStudio={handleScrollToBrandingStudio}
        onOpenAdmin={handleOpenAdmin}
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
      />

      {/* Floating WhatsApp Button with Official Logo */}
      <WhatsAppButton />

      {/* Floating Back-to-Top Button ↑ */}
      <BackToTop />

      {/* GDPR / Privacy Cookie Banner */}
      <CookieBanner />

      {/* Keyboard Shortcuts Palette / Guide */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
