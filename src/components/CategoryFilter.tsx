import type { Category } from '../types';
import { ALL_CATEGORIES } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <nav aria-label="Filter art forms by category" className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onCategoryChange(null)}
        aria-pressed={selectedCategory === null}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
          selectedCategory === null
            ? 'bg-terracotta text-white border-terracotta shadow-sm'
            : 'bg-transparent text-charcoal-light border-charcoal/12 hover:border-terracotta/30 hover:text-terracotta'
        }`}
      >
        All
      </button>
      {ALL_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(selectedCategory === cat ? null : cat)}
          aria-pressed={selectedCategory === cat}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
            selectedCategory === cat
              ? 'bg-terracotta text-white border-terracotta shadow-sm'
              : 'bg-transparent text-charcoal-light border-charcoal/12 hover:border-terracotta/30 hover:text-terracotta'
          }`}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}
