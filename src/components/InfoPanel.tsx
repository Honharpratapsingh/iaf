import type { ArtForm } from '../types';
import { CATEGORY_COLORS } from '../types';

interface InfoPanelProps {
  artForm: ArtForm | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoPanel({ artForm, isOpen, onClose }: InfoPanelProps) {
  if (!artForm || !isOpen) return null;

  const categoryColor = CATEGORY_COLORS[artForm.category];

  const sections: { label: string; content: string }[] = [
    { label: 'Origin', content: artForm.origin },
    { label: 'Historical Context', content: artForm.historicalContext },
    { label: 'Techniques', content: artForm.techniques },
    { label: 'Materials', content: artForm.materials },
    { label: 'Notable Artists', content: artForm.artists },
    { label: 'Cultural Significance', content: artForm.culturalSignificance },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-[1100] md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="complementary"
        aria-label={`Details about ${artForm.name}`}
        className={`
          fixed md:relative z-[1200] md:z-auto
          bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto
          max-h-[75vh] md:max-h-none md:h-full
          w-full md:w-[380px] lg:w-[420px] md:min-w-[350px]
          bg-panel-bg border-t md:border-t-0 md:border-l border-charcoal/8
          flex flex-col overflow-hidden
          panel-slide-up md:panel-slide-in
          shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:shadow-none
          rounded-t-2xl md:rounded-none
        `}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-charcoal/15" aria-hidden="true" />
        </div>

        {/* Header */}
        <header className="px-5 pt-3 pb-4 border-b border-charcoal/6 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-charcoal leading-tight">
                {artForm.name}
              </h2>
              <p className="text-sm text-charcoal-light/70 mt-0.5">
                {artForm.state} · {artForm.region} India
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-charcoal/5 transition-colors text-charcoal-light"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {artForm.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-charcoal-light bg-charcoal/5 border border-charcoal/8">
              {artForm.period}
            </span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Description */}
          <div className="px-5 py-4 border-b border-charcoal/5">
            <p className="text-sm text-charcoal leading-relaxed">{artForm.description}</p>
          </div>

          {/* Detail sections */}
          <div className="px-5 py-2">
            {sections.map((section) => (
              <div key={section.label} className="py-3 border-b border-charcoal/4 last:border-b-0">
                <h3 className="text-[11px] uppercase tracking-widest font-semibold text-terracotta/80 mb-1.5">
                  {section.label}
                </h3>
                <p className="text-[13px] text-charcoal-light leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Bottom padding */}
          <div className="h-6" />
        </div>
      </aside>
    </>
  );
}
