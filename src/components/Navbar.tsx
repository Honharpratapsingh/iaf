import type { ArtForm, Category } from '../types';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectResult: (artForm: ArtForm) => void;
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  onSelectResult,
  selectedCategory,
  onCategoryChange,
}: NavbarProps) {
  return (
    <header className="bg-panel-bg border-b border-charcoal/6 shrink-0 z-[2000] relative">
      <div className="px-4 md:px-6 py-3">
        {/* Top row: branding + search */}
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-semibold font-[family-name:var(--font-heading)] text-charcoal leading-tight truncate">
              Indian Art & Culture
            </h1>
            <p className="text-[11px] md:text-xs text-charcoal-light/50 tracking-wide hidden sm:block">
              Explore India's artistic heritage
            </p>
          </div>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSelectResult={onSelectResult}
          />
        </div>

        {/* Bottom row: category filters */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-0.5">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </div>
    </header>
  );
}
