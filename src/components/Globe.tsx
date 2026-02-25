import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

import { useStore } from '../store/useStore';
import { countryData } from '../data/mockData';
import { CountryFeature } from './types/types';

const GlobeComponent = () => {
  const globeEl = useRef<React.ElementRef<typeof Globe>>();

  const [countries, setCountries] = useState<{ features: CountryFeature[] }>({
    features: [],
  });

  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const { setSelectedCountry } = useStore();

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson'
    )
      .then((res) => res.json())
      .then((data) => setCountries(data));

    setTimeout(() => {
      if (!globeEl.current) return;

      const controls = globeEl.current.controls();

      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.18;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      controls.minDistance = 150;
      controls.maxDistance = 400;

      globeEl.current.pointOfView({ altitude: 2.5 }, 1200);
    }, 300);
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;

    globeEl.current.controls().autoRotate = !hoverD;
  }, [hoverD]);

  const handleCountryClick = (polygon: CountryFeature) => {
    const countryCode = polygon.properties.ISO_A3;
    const data = countryData[countryCode];

    if (!data || !globeEl.current) return;

    setSelectedCountry(data);

    globeEl.current.controls().autoRotate = false;

    globeEl.current.pointOfView(
      {
        lat: polygon.properties.LAT ?? 0,
        lng: polygon.properties.LON ?? 0,
        altitude: 1.5,
      },
      1200
    );
  };

  return (
    <div className="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.features}
        polygonAltitude={(d) => {
          const country = d as CountryFeature;
          return country === hoverD ? 0.12 : 0.06;
        }}
        polygonCapColor={(d) => {
          const country = d as CountryFeature;

          if (country === hoverD) return 'rgba(0,255,255,0.85)';

          const code = country.properties.ISO_A3;
          return countryData[code]
            ? 'rgba(139,92,246,0.45)'
            : 'rgba(80,80,80,0.25)';
        }}
        polygonSideColor={() => 'rgba(0,0,0,0.15)'}
        polygonStrokeColor={() => '#00ffff'}
        polygonLabel={(d) => {
          const country = d as CountryFeature;
          const code = country.properties.ISO_A3;
          const data = countryData[code];

          return data
            ? `<div class="country-tooltip">
                <b style="color:#00ffff">${data.name}</b>
                <div style="color:#a78bfa;font-size:11px">
                  Click to explore
                </div>
              </div>`
            : `<div>${country.properties.ADMIN}</div>`;
        }}
        onPolygonHover={(d) => setHoverD(d as CountryFeature | null)}
        onPolygonClick={(d) => handleCountryClick(d as CountryFeature)}
        polygonsTransitionDuration={300}
        atmosphereColor="#00ffff"
        atmosphereAltitude={0.28}
      />
    </div>
  );
};

export default GlobeComponent;