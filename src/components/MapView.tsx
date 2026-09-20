import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ArtForm, Category } from '../types';
import { CATEGORY_COLORS } from '../types';
import Legend from './Legend';

/* ── Custom SVG marker factory ─────────────────────── */
function createMarkerIcon(category: Category, isSelected: boolean): L.DivIcon {
  const color = CATEGORY_COLORS[category];
  const size = isSelected ? 32 : 24;
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: `art-marker ${isSelected ? 'art-marker-selected' : ''}`,
    html: `
      <svg width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - borderWidth}" fill="${color}" stroke="#FFFCF8" stroke-width="${borderWidth}"/>
        <path d="M${size / 2} ${size}L${size / 2 - 4} ${size - 5}H${size / 2 + 4}Z" fill="${color}"/>
        ${isSelected ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 6}" fill="#FFFCF8"/>` : ''}
      </svg>
    `,
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    tooltipAnchor: [0, -size],
  });
}

/* ── Map controls: fly-to on selection ─────────────── */
function MapController({
  selectedArt,
}: {
  selectedArt: ArtForm | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedArt) {
      map.flyTo([selectedArt.latitude, selectedArt.longitude], 8, {
        duration: 0.8,
      });
    }
  }, [selectedArt, map]);

  return null;
}

/* ── Markers layer ──────────────────────────────────── */
function MarkersLayer({
  artForms,
  selectedArt,
  onSelectArt,
}: {
  artForms: ArtForm[];
  selectedArt: ArtForm | null;
  onSelectArt: (art: ArtForm) => void;
}) {
  const map = useMap();
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const currentMarkers = markersRef.current;

    // Remove old markers not in new list
    const newIds = new Set(artForms.map((a) => a.id));
    currentMarkers.forEach((marker, id) => {
      if (!newIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // Add or update markers
    artForms.forEach((art) => {
      const isSelected = selectedArt?.id === art.id;
      const existing = currentMarkers.get(art.id);

      if (existing) {
        // Update icon for selection state
        existing.setIcon(createMarkerIcon(art.category, isSelected));
        existing.setZIndexOffset(isSelected ? 1000 : 0);
      } else {
        // Create new marker
        const marker = L.marker([art.latitude, art.longitude], {
          icon: createMarkerIcon(art.category, isSelected),
          zIndexOffset: isSelected ? 1000 : 0,
          keyboard: true,
          title: art.name,
        });

        marker.bindTooltip(
          `<strong>${art.name}</strong><br/><span style="color:#6b6b6b;font-size:11px">${art.state}</span>`,
          {
            className: 'marker-tooltip',
            direction: 'top',
            offset: [0, -4],
          }
        );

        marker.on('click', () => onSelectArt(art));
        marker.addTo(map);
        currentMarkers.set(art.id, marker);
      }
    });

    return () => { };
  }, [artForms, selectedArt, map, onSelectArt]);

  // Cleanup all markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, []);

  return null;
}

/* ── Main MapView ────────────────────────────────────── */
interface MapViewProps {
  artForms: ArtForm[];
  selectedArt: ArtForm | null;
  onSelectArt: (art: ArtForm) => void;
}

export default function MapView({ artForms, selectedArt, onSelectArt }: MapViewProps) {
  const center: [number, number] = [22.5, 82.0];

  return (
    <div className="relative flex-1 h-full">
      <MapContainer
        center={center}
        zoom={5}
        minZoom={4}
        maxZoom={12}
        zoomControl={true}
        className="w-full h-full"
        style={{ background: '#FAF6F0' }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController selectedArt={selectedArt} />
        <MarkersLayer
          artForms={artForms}
          selectedArt={selectedArt}
          onSelectArt={onSelectArt}
        />
      </MapContainer>

      {/* Legend */}
      <Legend />

      {/* Default overlay when nothing selected */}
      {!selectedArt && (
        <div className="absolute top-4 right-4 z-[1000] max-w-[260px] bg-panel-bg/95 backdrop-blur-sm border border-charcoal/8 rounded-xl px-4 py-3 shadow-md pointer-events-none">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-charcoal leading-snug">
                Select a location on the map
              </p>
              <p className="text-[11px] text-charcoal-light/60 mt-0.5 leading-snug">
                to discover its art and cultural traditions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}