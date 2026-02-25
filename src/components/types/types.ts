export interface CountryFeature {
  properties: {
    ISO_A3: string;
    ADMIN: string;
    LAT?: number;
    LON?: number;
  };
}