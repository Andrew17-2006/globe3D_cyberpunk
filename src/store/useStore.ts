import { create } from 'zustand';

export interface CountryData {
  name: string;
  code: string;
  techTrends: string[];
  programmingLanguages: { name: string; score: number }[];
  githubActivity: {
    repositories: number;
    developers: number;
    growth: string;
  };
  startupEcosystem: {
    unicorns: number;
    funding: string;
    hotSectors: string[];
  };
  insights: string[];
}

interface AppState {
  selectedCountry: CountryData | null;
  isLoading: boolean;
  setSelectedCountry: (country: CountryData | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedCountry: null,
  isLoading: true,
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
