import { ALL_CATEGORIES, CATEGORY_COLORS } from '../types';

export default function Legend() {
  return (
    <div
      className="absolute bottom-6 left-3 z-[1000] bg-panel-bg/95 backdrop-blur-sm border border-charcoal/8 rounded-xl px-3 py-2.5 shadow-md"
      role="complementary"
      aria-label="Map legend showing category colors"
    >
      <p className="text-[10px] uppercase tracking-widest text-charcoal-light/50 font-semibold mb-1.5">Legend</p>
      <ul className="space-y-1">
        {ALL_CATEGORIES.map((cat) => (
          <li key={cat} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              aria-hidden="true"
            />
            <span className="text-[11px] text-charcoal-light leading-tight">{cat}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
