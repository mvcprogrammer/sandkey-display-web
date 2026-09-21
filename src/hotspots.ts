/**
 * The home screen hotspots, transcribed from the legacy image map without change.
 *
 * The coordinates are absolute pixels against a 1920x1080 aerial photograph, so the image
 * must not be scaled. Generated from Views/Home/Index.cshtml at commit c241254.
 */
export interface Hotspot {
  shape: 'rect' | 'poly'
  coords: string
  to: string
  alt: string
}

export const HOTSPOTS: readonly Hotspot[] = [
  { shape: 'rect', coords: '973,514,1199,827', to: '/Condo/100', alt: 'LANDMARK TOWERS' },
  { shape: 'rect', coords: '0,86,91,137', to: '/Condo/101', alt: 'HARBOUR LIGHT TOWERS' },
  { shape: 'rect', coords: '21,137,133,203', to: '/Condo/102', alt: 'SOUTH BAY' },
  { shape: 'poly', coords: '91,224,438,455,359,612,608,636,650,461,188,203', to: '/Condo/103', alt: 'BAYSIDE' },
  { shape: 'rect', coords: '123,34,227,86', to: '/Condo/104', alt: 'DANS ISLAND' },
  { shape: 'rect', coords: '176,94,227,150', to: '/Condo/105', alt: 'CABANA CLUB' },
  { shape: 'rect', coords: '234,18,460,121', to: '/Condo/106', alt: 'ULTIMAR' },
  { shape: 'rect', coords: '279,130,555,223', to: '/Condo/107', alt: 'SOUTH BEACH 1' },
  { shape: 'rect', coords: '460,238,555,327', to: '/Condo/108', alt: 'SOUTH BEACH 2' },
  { shape: 'rect', coords: '398,219,457,280', to: '/Condo/109', alt: 'SOUTH BEACH 3' },
  { shape: 'rect', coords: '559,223,653,343', to: '/Condo/110', alt: 'Sand Key Club' },
  { shape: 'rect', coords: '659,273,703,359', to: '/Condo/111', alt: 'UTOPIA' },
  { shape: 'rect', coords: '703,223,905,422', to: '/Condo/112', alt: 'CRESCENT BEACH CLUB' },
  { shape: 'rect', coords: '917,359,946,540', to: '/Condo/113', alt: 'LIGHTHOUSE1' },
  { shape: 'rect', coords: '923,296,1024,359', to: '/Condo/114', alt: 'LIGHTHOUSE2' },
  { shape: 'rect', coords: '960,370,1046,503', to: '/Condo/115', alt: 'HARBOUR LIGHT' },
  { shape: 'rect', coords: '1243,503,1462,895', to: '/Condo/116', alt: 'MERIDIAN ON SAND KEY' },
  { shape: 'rect', coords: '1475,574,1920,1080', to: '/Condo/117', alt: 'GRANDE' },
  { shape: 'rect', coords: '1370,47,1715,134', to: '/Residential/', alt: '' },
  { shape: 'rect', coords: '1370,200,1715,285', to: '/Rental/', alt: '' },
]
