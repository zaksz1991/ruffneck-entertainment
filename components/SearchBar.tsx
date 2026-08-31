'use client';

import { useState, useMemo } from 'react';

interface SearchBarProps<T> {
  items: T[];
  searchKeys: (keyof T)[];
  placeholder?: string;
  onResults: (filtered: T[]) => void;
  className?: string;
}

export default function SearchBar<T extends Record<string, any>>({
  items,
  searchKeys,
  placeholder = 'Search...',
  onResults,
  className = '',
}: SearchBarProps<T>) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;

    const lower = query.toLowerCase().trim();
    return items.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lower);
        }
        if (Array.isArray(value)) {
          return value.some(
            (v) => typeof v === 'string' && v.toLowerCase().includes(lower)
          );
        }
        return false;
      })
    );
  }, [items, query, searchKeys]);

  // Push results to parent whenever filtered changes
  useMemo(() => {
    onResults(filtered);
  }, [filtered, onResults]);

  const clear = () => {
    setQuery('');
    onResults(items);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-lg leading-none"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {query && (
        <p className="mt-2 text-sm text-slate-400">
          {filtered.length === 0
            ? 'No results found'
            : `Showing ${filtered.length} of ${items.length} results`}
        </p>
      )}
    </div>
  );
}
