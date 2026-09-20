import { useState, useCallback, useRef, useEffect } from 'react';
import type { ArtForm } from '../types';
import { artForms } from '../data/artForms';

interface SearchResult {
  artForm: ArtForm;
  matchType: 'name' | 'state' | 'region';
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectResult: (artForm: ArtForm) => void;
}

export default function SearchBar({ searchQuery, onSearchChange, onSelectResult }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase().trim();
    const matched: SearchResult[] = [];

    artForms.forEach((art) => {
      if (art.name.toLowerCase().includes(q)) {
        matched.push({ artForm: art, matchType: 'name' });
      } else if (art.state.toLowerCase().includes(q)) {
        matched.push({ artForm: art, matchType: 'state' });
      } else if (art.region.toLowerCase().includes(q)) {
        matched.push({ artForm: art, matchType: 'region' });
      }
    });

    setResults(matched);
  }, []);

  useEffect(() => {
    search(searchQuery);
  }, [searchQuery, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (artForm: ArtForm) => {
    onSelectResult(artForm);
    setIsFocused(false);
    onSearchChange('');
  };

  const getMatchLabel = (matchType: SearchResult['matchType']) => {
    switch (matchType) {
      case 'name': return 'Name';
      case 'state': return 'State';
      case 'region': return 'Region';
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-light opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search art, state, or region…"
          aria-label="Search art forms by name, state, or region"
          className="w-full pl-10 pr-9 py-2 text-sm bg-ivory-warm border border-charcoal/10 rounded-lg placeholder:text-charcoal-light/50 text-charcoal focus:border-terracotta/40 focus:ring-0 focus:outline-none transition-colors"
        />

        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-charcoal/10 transition-colors text-charcoal-light"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isFocused && searchQuery.trim() && (
        <div
          ref={dropdownRef}
          className="search-dropdown absolute top-full left-0 right-0 mt-1.5 bg-panel-bg border border-charcoal/10 rounded-lg shadow-lg overflow-hidden z-[9999]"
          role="listbox"
          aria-label="Search results"
        >
          {results.length > 0 ? (
            <ul className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
              {results.map((result) => (
                <li key={result.artForm.id}>
                  <button
                    onClick={() => handleSelect(result.artForm)}
                    className="w-full text-left px-3 py-2 hover:bg-ivory-warm transition-colors flex items-center justify-between gap-2"
                    role="option"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-charcoal truncate">{result.artForm.name}</p>
                      <p className="text-xs text-charcoal-light/70">{result.artForm.state} · {result.artForm.region}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-terracotta/70 font-medium shrink-0">
                      {getMatchLabel(result.matchType)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-charcoal-light/60">No art forms found for "{searchQuery}"</p>
              <p className="text-xs text-charcoal-light/40 mt-1">Try searching by name, state, or region</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
