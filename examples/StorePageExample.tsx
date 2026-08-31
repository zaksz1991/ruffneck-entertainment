'use client';

/**
 * EXAMPLE: How to use SearchBar + CategoryFilter + CurrencySwitcher on the Store
 * Copy the relevant parts into your actual /store page component.
 */

import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import CurrencySwitcher from '../components/CurrencySwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useCurrency } from '../hooks/useCurrency';

// Replace with your real products (from Supabase / props)
const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'AI Data Annotator Guide',
    description: 'Complete guide to becoming a professional data annotator.',
    category: 'AI Career Guides',
    priceNGN: 3500, // always store base price in NGN
    tiers: [
      { name: 'Beginner', priceNGN: 3500 },
      { name: 'Intermediate', priceNGN: 6500 },
      { name: 'Advanced', priceNGN: 10000 },
    ],
  },
  {
    id: 2,
    name: 'Ultimate Business Prompt Pack 2026',
    description: '200+ tested prompts for video, content and business.',
    category: 'Prompt Packs',
    priceNGN: 3500,
    tiers: [
      { name: 'Essential 50', priceNGN: 3500 },
      { name: 'Pro 100', priceNGN: 6000 },
      { name: 'Full 200+', priceNGN: 9000 },
    ],
  },
  // ... rest of your products
];

const CATEGORIES = [
  'All Products',
  'AI Career Guides',
  'Prompt Packs',
  'Templates',
  'Design Assets',
  'Business Toolkits',
  'IT Services',
];

export default function StorePageExample() {
  const [searchResults, setSearchResults] = useState(ALL_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const { formatPrice, currency } = useCurrency();

  const displayedProducts = useMemo(() => {
    if (activeCategory === 'All Products') return searchResults;
    return searchResults.filter((p) => p.category === activeCategory);
  }, [searchResults, activeCategory]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { 'All Products': searchResults.length };
    CATEGORIES.slice(1).forEach((cat) => {
      c[cat] = searchResults.filter((p) => p.category === cat).length;
    });
    return c;
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-lg">RuffNeck Store</div>
          <div className="flex items-center gap-4">
            <CurrencySwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          RuffNeck Digital Store
        </h1>
        <p className="text-slate-400 mb-8">
          AI guides, prompt packs, templates & more — instant delivery
        </p>

        {/* Search + Currency already in header, but can also place here */}
        <SearchBar
          items={ALL_PRODUCTS}
          searchKeys={['name', 'description', 'category']}
          placeholder="Search products..."
          onResults={setSearchResults}
          className="mb-6"
        />

        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
          counts={counts}
          className="mb-8"
        />

        <p className="text-sm text-slate-500 mb-4">
          Showing {displayedProducts.length} product
          {displayedProducts.length !== 1 ? 's' : ''} · Currency: {currency}
        </p>

        {/* Products Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => {
            const price = formatPrice(product.priceNGN);
            return (
              <div key={product.id} className="product-card p-5 flex flex-col">
                <span className="text-xs font-medium text-cyan-400">
                  {product.category}
                </span>
                <h2 className="mt-1 text-lg font-semibold leading-snug">
                  {product.name}
                </h2>
                <p className="mt-2 text-sm text-slate-400 flex-1">
                  {product.description}
                </p>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">From</p>
                    <p className="text-xl font-bold text-white">
                      {price.formatted}
                    </p>
                  </div>
                  <button className="btn-primary text-sm px-4 py-2">
                    View options
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {displayedProducts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No products match your search or filter.
          </div>
        )}
      </main>
    </div>
  );
}
