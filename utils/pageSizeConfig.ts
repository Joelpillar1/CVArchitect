export interface PageSizeConfig {
  id: 'letter' | 'a4';
  name: string;
  dimensionsLabel: string;
  widthCss: string;
  heightCss: string;
  heightMm: number;
}

export const PAGE_SIZE_OPTIONS: PageSizeConfig[] = [
  {
    id: 'letter',
    name: 'Letter',
    dimensionsLabel: '8.5" x 11"',
    widthCss: '215.9mm',
    heightCss: '279.4mm',
    heightMm: 279.4,
  },
  {
    id: 'a4',
    name: 'A4',
    dimensionsLabel: '210 x 297 mm',
    widthCss: '210mm',
    heightCss: '297mm',
    heightMm: 297,
  },
];

export function getPageSizeConfig(size?: 'letter' | 'a4' | string): PageSizeConfig {
  const normalizedSize = (size || 'letter').toLowerCase();
  const config = PAGE_SIZE_OPTIONS.find((opt) => opt.id === normalizedSize);
  return config || PAGE_SIZE_OPTIONS[0]; // Fallback to Letter if not found
}
