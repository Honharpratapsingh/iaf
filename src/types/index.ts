export type Category =
  | 'Painting'
  | 'Textile'
  | 'Sculpture'
  | 'Craft'
  | 'Folk Art'
  | 'Tribal Art'
  | 'Performance Art';

export interface ArtForm {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  latitude: number;
  longitude: number;
  category: Category;
  period: string;
  origin: string;
  artists: string;
  techniques: string;
  materials: string;
  historicalContext: string;
  culturalSignificance: string;
  description: string;
  image: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Painting: '#C2592A',
  Textile: '#8B6C42',
  Sculpture: '#5B7553',
  Craft: '#9B6B8A',
  'Folk Art': '#D4943A',
  'Tribal Art': '#6B7B3A',
  'Performance Art': '#7B5B6B',
};

export const ALL_CATEGORIES: Category[] = [
  'Painting',
  'Textile',
  'Sculpture',
  'Craft',
  'Folk Art',
  'Tribal Art',
  'Performance Art',
];
