'use client';

/**
 * EXAMPLE: How to use SearchBar + CategoryFilter on the Blog page
 * Copy the relevant parts into your actual /blog page component.
 */

import { useState, useMemo } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import LanguageSwitcher from '../components/LanguageSwitcher';

// Replace this with your real posts data (from Supabase / props / CMS)
const ALL_POSTS = [
  {
    id: 1,
    title: 'Top 12 AI Career Roles You Can Start in 2026',
    description: 'AI Data Annotator, Evaluator, Ethics Reviewer...',
    category: 'AI Careers',
    date: 'June 2026',
    readTime: '12 min',
  },
  {
    id: 2,
    title: 'Top 10 AI Tools Every Nigerian SME Should Use in 2026',
    description: 'From ChatGPT to automation platforms...',
    category: 'AI & Automation',
    date: 'June 2026',
    readTime: '8 min',
  },
  // ... add the rest of your posts
];

const CATEGORIES = [
  'All',
  'AI & Automation',
  'AI Careers',
  'Operations',
  'Digital Marketing',
  'AI Ethics',
  'Content & Prompts',
  'Business Growth',
];

export default function BlogPageExample() {
  const [searchResults, setSearchResults] = useState(ALL_POSTS);
  const [activeCategory, setActiveCategory] = useState('All');

  // Combine search + category filter
  const displayedPosts = useMemo(() => {
    if (activeCategory === 'All') return searchResults;
    return searchResults.filter((p) => p.category === activeCategory);
  }, [searchResults, activeCategory]);

  // Optional: counts per category
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: searchResults.length };
    CATEGORIES.slice(1).forEach((cat) => {
      c[cat] = searchResults.filter((p) => p.category === cat).length;
    });
    return c;
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header with Language Switcher */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-lg">RuffNeck Blog</div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          RuffNeck Knowledge Hub
        </h1>
        <p className="text-slate-400 mb-8">
          Practical AI, operations and digital growth insights
        </p>

        {/* Search */}
        <SearchBar
          items={ALL_POSTS}
          searchKeys={['title', 'description', 'category']}
          placeholder="Search articles..."
          onResults={setSearchResults}
          className="mb-6"
        />

        {/* Category Filters */}
        <CategoryFilter
          categories={CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
          counts={counts}
          className="mb-8"
        />

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-4">
          Showing {displayedPosts.length} article
          {displayedPosts.length !== 1 ? 's' : ''}
        </p>

        {/* Posts Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {displayedPosts.map((post) => (
            <article
              key={post.id}
              className="article-card p-5 cursor-pointer"
            >
              <span className="text-xs font-medium text-cyan-400">
                {post.category}
              </span>
              <h2 className="mt-1 text-lg font-semibold leading-snug">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                {post.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        {displayedPosts.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            No articles match your search or filter.
          </div>
        )}
      </main>
    </div>
  );
}
