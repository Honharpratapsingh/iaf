import { useState, useMemo, useCallback } from 'react';
import type { ArtForm, Category } from './types';
import { artForms } from './data/artForms';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import InfoPanel from './components/InfoPanel';

export default function App() {
  const [selectedArt, setSelectedArt] = useState<ArtForm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Filter art forms by category
  const filteredArtForms = useMemo(() => {
    if (!selectedCategory) return artForms;
    return artForms.filter((art) => art.category === selectedCategory);
  }, [selectedCategory]);

  // Handle marker click
  const handleSelectArt = useCallback(
    (art: ArtForm) => {
      if (selectedArt?.id === art.id && isPanelOpen) {
        // Click same marker again → close panel
        setIsPanelOpen(false);
        setSelectedArt(null);
      } else {
        // Click new marker → open/update panel
        setSelectedArt(art);
        setIsPanelOpen(true);
      }
    },
    [selectedArt, isPanelOpen]
  );

  // Handle search result selection
  const handleSearchSelect = useCallback((art: ArtForm) => {
    // If a category filter is active and the selected art doesn't match, clear the filter
    setSelectedCategory((prev) => {
      if (prev && art.category !== prev) return null;
      return prev;
    });
    setSelectedArt(art);
    setIsPanelOpen(true);
  }, []);

  // Handle panel close
  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedArt(null);
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: Category | null) => {
      setSelectedCategory(category);
      // If selected art is not in the new filter, close panel
      if (category && selectedArt && selectedArt.category !== category) {
        setSelectedArt(null);
        setIsPanelOpen(false);
      }
    },
    [selectedArt]
  );

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectResult={handleSearchSelect}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="flex flex-1 min-h-0 relative">
        <MapView
          artForms={filteredArtForms}
          selectedArt={selectedArt}
          onSelectArt={handleSelectArt}
        />
        <InfoPanel
          artForm={selectedArt}
          isOpen={isPanelOpen}
          onClose={handleClosePanel}
        />
      </main>
    </>
  );
}
