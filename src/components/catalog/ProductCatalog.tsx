import React, { useState, useMemo } from 'react';
import { Product, FilterState } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { ProductVisual } from '../common/ProductVisual';
import { Search, SlidersHorizontal, ArrowUpRight, Check, X, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

interface ProductCatalogProps {
  products: Product[];
  onOpenEnquiry: (productName?: string) => void;
  onSelectProduct: (productSlug: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onOpenEnquiry,
  onSelectProduct,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    customBrandingOnly: false,
    sortBy: 'featured',
  });

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }
      // Custom Branding Only
      if (filters.customBrandingOnly && !p.customBrandingAvailable) {
        return false;
      }
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        const matchesMat = p.material.toLowerCase().includes(q);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(q));
        const matchesCat = p.categoryLabel.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesMat && !matchesTags && !matchesCat) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'moq-asc') return a.moq - b.moq;
      if (filters.sortBy === 'price-asc') return a.priceNumeric - b.priceNumeric;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, filters]);

  const activeCategory = CATEGORIES.find(c => c.slug === filters.category) || CATEGORIES[0];

  return (
    <section id="products" className="py-24 bg-[#FBFBF9] border-b border-[#EAE9E1] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[#2E4A37] mb-2">
              Dynamic Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-[#142018] tracking-tight">
              Sustainable Oral Care Solutions
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#5D6560] max-w-md">
            Engineered for wholesale distribution, clinics, luxury hospitality, and conscious retailers. All items support scalable private labeling.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#F4F4EE] border border-[#E3E2D8] rounded-xl p-4 sm:p-5 mb-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#79827C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search bamboo toothbrush, bamboo tongue cleaner, dental combo..."
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#DCDAD0] rounded-lg text-sm text-[#1C221F] placeholder:text-[#8B938D] focus:outline-none focus:ring-1 focus:ring-[#192E22] focus:border-[#192E22] transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters: Custom Branding toggle & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilters(prev => ({ ...prev, customBrandingOnly: !prev.customBrandingOnly }))}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
                filters.customBrandingOnly
                  ? 'bg-[#192E22] text-white border-[#192E22]'
                  : 'bg-white text-[#4A534E] border-[#DCDAD0] hover:border-[#192E22]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Laser Branding Ready</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-white border border-[#DCDAD0] px-3 py-2 rounded-lg text-xs">
              <span className="text-[#79827C] whitespace-nowrap">Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                className="bg-transparent font-medium text-[#1C221F] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="moq-asc">MOQ: Low to High</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name-asc">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {CATEGORIES.map(cat => {
            const isActive = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.slug }))}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#192E22] text-white shadow-xs'
                    : 'bg-[#EFEFE8] text-[#555E58] hover:bg-[#E5E4DC] hover:text-[#192E22]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Catalog Results Header */}
        <div className="flex items-center justify-between text-xs text-[#6B736E] mb-6 pb-2 border-b border-[#EAE9E1]">
          <span>
            Showing <strong className="font-semibold text-[#192E22] tabular-nums">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
            {filters.category !== 'all' && ` in ${activeCategory.name}`}
          </span>
          {(filters.searchQuery || filters.category !== 'all' || filters.customBrandingOnly) && (
            <button
              onClick={() => setFilters({ searchQuery: '', category: 'all', customBrandingOnly: false, sortBy: 'featured' })}
              className="text-[#BD7B3C] hover:underline font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid: 3-column desktop layout adhering to E-commerce reference */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white border border-[#E5E4DC] rounded-xl overflow-hidden hover:border-[#192E22]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Lead Image Area (65-75% height proportion with hover lift) */}
                  <div
                    onClick={() => onSelectProduct(product.slug)}
                    className="cursor-pointer relative overflow-hidden bg-[#F6F6F0] p-2"
                  >
                    <ProductVisual
                      type={
                        product.slug.includes('toothbrush')
                          ? 'toothbrush'
                          : product.slug.includes('cleaner')
                          ? 'tongue-cleaner'
                          : product.slug.includes('case')
                          ? 'case'
                          : 'combo'
                      }
                      imageUrl={product.images[0]?.url}
                      alt={product.name}
                      aspectRatio="4:3"
                      enable3DTilt={false}
                      className="group-hover:scale-[1.03] transition-transform duration-500"
                    />

                    {/* Laser Engraving indicator if available */}
                    {product.customBrandingAvailable && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-medium text-[#2E4A37] border border-[#E0E0D6] shadow-xs">
                        Custom Branding Available
                      </div>
                    )}

                    {product.slug === 'bamboo-dental-combo' && (
                      <div className="absolute top-4 left-4 bg-[#192E22] text-white px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold shadow-xs">
                        Together in One Set
                      </div>
                    )}
                  </div>

                  {/* Product Metadata & Info (Strict Zero-Pill discipline: unboxed clean text) */}
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-2 text-xs text-[#737C76] mb-2">
                      <span className="font-medium uppercase tracking-wider text-[11px] text-[#2D5A3C]">
                        {product.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#BD7B3C] font-semibold tabular-nums">
                        MOQ {product.moq} {product.moqUnit}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product.slug)}
                      className="font-serif text-xl font-semibold text-[#142018] group-hover:text-[#BD7B3C] transition-colors cursor-pointer mb-2 line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#5B635E] line-clamp-2 leading-relaxed mb-4">
                      {product.shortDescription}
                    </p>

                    {/* Features list snippet */}
                    <div className="space-y-1 mb-4">
                      {product.features.slice(0, 2).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#444D47]">
                          <Check className="w-3.5 h-3.5 text-[#2D5A3C] shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action & Price Baseline */}
                <div className="p-6 pt-0 border-t border-[#F2F1EA] mt-2">
                  <div className="flex items-center justify-between pt-4 mb-4">
                    <div>
                      <span className="text-[11px] text-[#737C76] block">Wholesale Rate</span>
                      <span className="text-sm font-semibold text-[#142018] font-mono tabular-nums">
                        {product.price}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product.slug)}
                      className="text-xs font-semibold text-[#192E22] hover:text-[#BD7B3C] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Specifications</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenEnquiry(product.name)}
                      className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#192E22] hover:bg-[#254231] rounded-lg transition-all text-center cursor-pointer shadow-xs"
                    >
                      Enquire Now
                    </button>

                    <a
                      href={buildWhatsAppUrl({
                        productName: product.name,
                        quantity: product.moq,
                        customBranding: product.customBrandingAvailable,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 text-xs font-semibold text-[#192E22] bg-[#EAF2EC] hover:bg-[#DCEADA] border border-[#CCDDCF] rounded-lg transition-all text-center flex items-center justify-center cursor-pointer"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-[#FAF9F5] border border-dashed border-[#DCDAD0] rounded-2xl p-12 text-center max-w-lg mx-auto">
            <p className="font-serif text-xl font-semibold text-[#192E22] mb-2">
              No matching products found
            </p>
            <p className="text-sm text-[#5B635E] mb-6">
              We couldn't find any products matching "{filters.searchQuery}". Would you like to request a bespoke custom dental product manufacturing quote?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setFilters({ searchQuery: '', category: 'all', customBrandingOnly: false, sortBy: 'featured' })}
                className="px-4 py-2 text-xs font-semibold text-[#192E22] bg-white border border-[#D5D4CA] rounded-lg"
              >
                Clear Filters
              </button>
              <button
                onClick={() => onOpenEnquiry('Bespoke Custom Dental Product')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#192E22] rounded-lg"
              >
                Request Custom Solution
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
