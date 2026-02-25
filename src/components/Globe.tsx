import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

import { useStore } from '../store/useStore';
import { countryData } from '../data/mockData';
import { CountryFeature } from './types/types';

const GlobeComponent = () => {
  const globeEl = useRef<React.ElementRef<typeof Globe>>();

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isTapRef = useRef(false);

  const [countries, setCountries] = useState<{ features: CountryFeature[] }>({
    features: [],
  });

  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const { selectedCountry, setSelectedCountry } = useStore();

  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
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

      controls.rotateSpeed = 0.4;
      controls.zoomSpeed = 0.7;
      controls.enablePan = false;

      controls.minDistance = 150;
      controls.maxDistance = 400;

      globeEl.current.pointOfView({ altitude: 2.5 }, 1200);
    }, 300);
  }, []);

  useEffect(() => {
    if (!globeEl.current || isMobile) return;
    globeEl.current.controls().autoRotate = !hoverD;
  }, [hoverD, isMobile]);

  useEffect(() => {
    if (!globeEl.current) return;

    const canvas = globeEl.current.renderer().domElement;

    const stop = () => {
      if (!globeEl.current) return;
      globeEl.current.controls().autoRotate = false;
    };

    canvas.addEventListener('touchstart', stop);

    return () => {
      canvas.removeEventListener('touchstart', stop);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    isTapRef.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - touchStart.current.x);
    const dy = Math.abs(t.clientY - touchStart.current.y);

    isTapRef.current = dx < 10 && dy < 10;
  };

  const handleCountryClick = (polygon: CountryFeature) => {
    if (!globeEl.current) return;

    const countryCode = polygon.properties.ISO_A3;
    const data = countryData[countryCode];

    if (!data) return;

    const controls = globeEl.current.controls();
    controls.autoRotate = false;

    globeEl.current.pointOfView(
      {
        lat: polygon.properties.LAT ?? 0,
        lng: polygon.properties.LON ?? 0,
        altitude: 1.5,
      },
      1200
    );

    setTimeout(() => {
      setSelectedCountry(data);
    }, 350);
  };

  return (
    <div
      className="globe-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
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
          const code = country.properties.ISO_A3;

          if (selectedCountry?.code === code) {
            return 'rgba(34,211,238,0.85)';
          }

          if (country === hoverD) {
            return 'rgba(0,255,255,0.85)';
          }

          if (countryData[code]) {
            return 'rgba(139,92,246,0.45)';
          }

          return 'rgba(80,80,80,0.25)';
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
        onPolygonHover={
          isMobile ? undefined : (d) => setHoverD(d as CountryFeature | null)
        }
        onPolygonClick={(d, event) => {
          if (event?.type === 'touchend' && !isTapRef.current) return;
          handleCountryClick(d as CountryFeature);
        }}
        polygonsTransitionDuration={300}
        atmosphereColor="#00ffff"
        atmosphereAltitude={0.28}
      />
    </div>
  );
};

export default GlobeComponent;