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
import { productService } from './services/productService';
import { Product } from './types';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryProductName, setEnquiryProductName] = useState<string>('');
  const [activeSection, setActiveSection] = useState('home');

  // Load products on mount
  useEffect(() => {
    setProducts(productService.getProducts());

    // Listen to hash changes (for direct product links like #product/bamboo-toothbrush)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const slug = hash.replace('#product/', '');
        setSelectedProductSlug(slug);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenEnquiry = (productName?: string) => {
    setEnquiryProductName(productName || '');
    setIsEnquiryModalOpen(true);
  };

  const handleSelectProduct = (productSlug: string) => {
    setSelectedProductSlug(productSlug);
    window.location.hash = `#product/${productSlug}`;
  };

  const handleCloseProductModal = () => {
    setSelectedProductSlug(null);
    if (window.location.hash.startsWith('#product/')) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleScrollToBrandingStudio = () => {
    const el = document.getElementById('custom-branding');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find active product for modal if selected
  const activeDetailProduct = selectedProductSlug
    ? productService.getProductBySlug(selectedProductSlug) || null
    : null;

  const relatedProducts = activeDetailProduct
    ? productService.getRelatedProducts(activeDetailProduct.id, activeDetailProduct.category, 2)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1F1D] selection:bg-[#E2ECE3] selection:text-[#192E22]">
      {/* 1. Premium 3-Zone Sticky Navigation */}
      <Navbar
        onOpenEnquiry={handleOpenEnquiry}
        onOpenBrandingStudio={handleScrollToBrandingStudio}
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

      {/* Floating Discreet WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
