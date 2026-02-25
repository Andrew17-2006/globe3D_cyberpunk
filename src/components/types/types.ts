export interface CountryFeature {
  id?: string;
  properties: {
    ISO_A3?: string;
    iso_a3?: string;
    ADMIN?: string;
    name?: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][][];
  };
}