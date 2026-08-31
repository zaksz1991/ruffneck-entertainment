'use client';

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  counts?: Record<string, number>;
  className?: string;
}

export default function CategoryFilter({
  categories,
  active,
  onChange,
  counts,
  className = '',
}: CategoryFilterProps) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 ${className}`}
    >
      {categories.map((cat) => {
        const isActive = active === cat;
        const count = counts?.[cat];

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'
              }
            `}
          >
            {cat}
            {typeof count === 'number' && (
              <span
                className={`ml-1.5 text-xs ${
                  isActive ? 'text-cyan-100' : 'text-slate-500'
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
