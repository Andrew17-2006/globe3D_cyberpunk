export type GlobeRef = {
  controls: () => {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
  };
  pointOfView: (
    opts: { lat?: number; lng?: number; altitude?: number },
    ms?: number
  ) => void;
};