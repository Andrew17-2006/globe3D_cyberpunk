import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import { useStore } from '../store/useStore';
import { countryData } from '../data/mockData';

const GlobeComponent = () => {
  const globeEl = useRef<any>();
  const [countries, setCountries] = useState<any>({ features: [] });
  const [hoverD, setHoverD] = useState<any>(null);
  const { setSelectedCountry } = useStore();

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
      });

    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.pointOfView({ altitude: 2.5 }, 1000);
    }
  }, []);

  const handleCountryClick = (polygon: any) => {
    if (polygon && polygon.properties) {
      const countryCode = polygon.properties.ISO_A3;
      const data = countryData[countryCode];

      if (data) {
        setSelectedCountry(data);
        if (globeEl.current) {
          globeEl.current.controls().autoRotate = false;
        }
      }
    }
  };

  return (
    <div className="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.features}
        polygonAltitude={(d: any) => (d === hoverD ? 0.12 : 0.06)}
        polygonCapColor={(d: any) => {
          if (d === hoverD) {
            return 'rgba(0, 255, 255, 0.8)';
          }
          const countryCode = d.properties.ISO_A3;
          return countryData[countryCode] ? 'rgba(139, 92, 246, 0.4)' : 'rgba(100, 100, 100, 0.3)';
        }}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
        polygonStrokeColor={() => '#00ffff'}
        polygonLabel={({ properties }: any) => {
          const countryCode = properties.ISO_A3;
          const data = countryData[countryCode];
          return data ? `
            <div class="country-tooltip">
              <div style="font-weight: bold; color: #00ffff; font-size: 14px; margin-bottom: 4px;">
                ${data.name}
              </div>
              <div style="color: #a78bfa; font-size: 11px;">
                Click to view insights
              </div>
            </div>
          ` : `<div class="country-tooltip">${properties.ADMIN}</div>`;
        }}
        onPolygonHover={setHoverD}
        onPolygonClick={handleCountryClick}
        polygonsTransitionDuration={300}
        atmosphereColor="#00ffff"
        atmosphereAltitude={0.25}
      />
    </div>
  );
};

export default GlobeComponent;
