import { INITIAL_PRODUCTS } from '../data/products';
import { Product, FilterState } from '../types';

export const productService = {
  getProducts(): Product[] {
    return INITIAL_PRODUCTS;
  },

  getProductBySlug(slug: string): Product | undefined {
    return INITIAL_PRODUCTS.find(p => p.slug === slug || p.id === slug);
  },

  getFeaturedProducts(): Product[] {
    return INITIAL_PRODUCTS.filter(p => p.featured);
  },

  getProductsByCategory(categoryId: string): Product[] {
    if (categoryId === 'all') return INITIAL_PRODUCTS;
    return INITIAL_PRODUCTS.filter(p => p.category === categoryId);
  },

  getRelatedProducts(currentProductId: string, _category: string, limit = 2): Product[] {
    return INITIAL_PRODUCTS.filter(p => p.id !== currentProductId).slice(0, limit);
  },

  filterProducts(filters: FilterState): Product[] {
    return INITIAL_PRODUCTS.filter(p => {
      // Category filter
      if (filters.category && filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }

      // Custom branding filter
      if (filters.customBrandingOnly && !p.customBrandingAvailable) {
        return false;
      }

      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        const matchesMaterial = p.material.toLowerCase().includes(query);
        const matchesTags = p.tags.some(t => t.toLowerCase().includes(query));
        const matchesCategory = p.categoryLabel.toLowerCase().includes(query);

        if (!matchesName && !matchesDesc && !matchesMaterial && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (filters.sortBy === 'moq-asc') {
        return a.moq - b.moq;
      }
      if (filters.sortBy === 'price-asc') {
        return (a.priceNumeric || 0) - (b.priceNumeric || 0);
      }
      return 0; // Default featured
    });
  },
};
