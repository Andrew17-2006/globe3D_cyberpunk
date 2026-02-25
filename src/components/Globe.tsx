import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

import { useStore } from '../store/useStore';
import { countryData } from '../data/mockData';
import { CountryFeature } from './types/types';

const GlobeComponent = () => {
  //фіксовані коди країн
  const isoFix: Record<string, string> = {
    DE: 'DEU',
    IN: 'IND',
    BR: 'BRA',
    FR: 'FRA',
    GB: 'GBR',
    CN: 'CHN',
    JP: 'JPN',
    AU: 'AUS',
    CA: 'CAN',
    US: 'USA',
  };

  const nameFix: Record<string, string> = {
    Germany: 'DEU',
    India: 'IND',
    Brazil: 'BRA',
    France: 'FRA',
    Canada: 'CAN',
    Australia: 'AUS',
    China: 'CHN',
    Japan: 'JPN',
    'United Kingdom': 'GBR',
    'United States': 'USA',
  };

  const globeEl = useRef<React.ElementRef<typeof Globe>>();

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isTapRef = useRef(false);

  const [countries, setCountries] = useState<{ features: CountryFeature[] }>({
    features: [],
  });

  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const { selectedCountry, setSelectedCountry } = useStore();

  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window;

  //хелпер для коду країни
  const getCountryCode = (polygon: CountryFeature): string => {
    let code =
      polygon.properties.ISO_A3 ||
      polygon.properties.iso_a3 ||
      '';

    if (code === '-99') {
      code = '';
    }

    if (isoFix[code]) {
      return isoFix[code];
    }

    const name =
      polygon.properties.name ||
      polygon.properties.ADMIN;

    if (name && nameFix[name]) {
      return nameFix[name];
    }

    return code;
  };

  const getPolygonCenter = (polygon: CountryFeature) => {
    let latSum = 0;
    let lngSum = 0;
    let count = 0;

    const addCoord = (coord: unknown) => {
      if (
        Array.isArray(coord) &&
        coord.length >= 2 &&
        typeof coord[0] === 'number' &&
        typeof coord[1] === 'number'
      ) {
        lngSum += coord[0];
        latSum += coord[1];
        count++;
      }
    };

    const geometry = polygon.geometry;

    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach((ring) => {
        ring.forEach(addCoord);
      });
    }

    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach((poly) => {
        poly.forEach((ring) => {
          ring.forEach(addCoord);
        });
      });
    }

    return {
      lat: count ? latSum / count : 0,
      lng: count ? lngSum / count : 0,
    };
  };

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
    )
      .then((res) => res.json())
      .then((data: { features: CountryFeature[] }) => {
        const filtered = {
          ...data,
          features: data.features.filter(
            (f) => getPolygonSize(f) > 30
          ),
        };

        setCountries(filtered);
      });

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

    const code = getCountryCode(polygon);
    if (!code) return;

    const data = countryData[code];
    if (!data) {
      setSelectedCountry({
        name:
          polygon.properties.ADMIN ||
          polygon.properties.name ||
          'Unknown',
        code,
        techTrends: ['No data yet'],
        programmingLanguages: [],
        githubActivity: {
          repositories: 0,
          developers: 0,
          growth: 'N/A',
        },
        startupEcosystem: {
          unicorns: 0,
          funding: 'N/A',
          hotSectors: [],
        },
        insights: ['No insights yet'],
      });
      return;
    }

    const { lat, lng } = getPolygonCenter(polygon);

    const controls = globeEl.current.controls();
    controls.autoRotate = false;

    globeEl.current.pointOfView(
      {
        lat,
        lng,
        altitude: 1.4,
      },
      1200
    );

    setTimeout(() => {
      setSelectedCountry(data);
    }, 350);
  };

  const getPolygonSize = (polygon: CountryFeature) => {
    let count = 0;

    const geometry = polygon.geometry;

    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach(ring => {
        count += ring.length;
      });
    }

    if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(poly => {
        poly.forEach(ring => {
          count += ring.length;
        });
      });
    }

    return count;
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
        lineHoverPrecision={0.1}
        polygonsData={countries.features}
        polygonAltitude={(d) => {
          const country = d as CountryFeature;

          const code = getCountryCode(country);

          if (selectedCountry?.code === code) return 0.18;

          if (country === hoverD) return 0.12;

          if (countryData[code]) return 0.09;

          return 0.06;
        }}
        polygonCapColor={(d) => {
          const country = d as CountryFeature;
          const code = getCountryCode(country);

          if (selectedCountry?.code === code) {
            return 'rgba(34,211,238,0.9)';
          }

          if (country === hoverD) {
            return 'rgba(0,255,255,0.85)';
          }

          if (countryData[code]) {
            return 'rgba(236,72,153,0.6)';
          }

          return 'rgba(80,80,80,0.25)';
        }}
        polygonSideColor={() => 'rgba(0,0,0,0.15)'}
        polygonStrokeColor={(d) => {
          const country = d as CountryFeature;

          const code = getCountryCode(country);

          if (selectedCountry?.code === code) return '#22d3ee';

          if (countryData[code]) return '#ec4899';

          return '#00ffff';
        }}
        polygonLabel={(d) => {
          const country = d as CountryFeature;
          const code = getCountryCode(country);
          const data = countryData[code];

          return data
            ? `<div class="country-tooltip">
                <b style="color:#00ffff">${data.name}</b>
                <div style="color:#a78bfa;font-size:11px">
                  Click to explore
                </div>
              </div>`
            : `<div>${country.properties.name || country.properties.ADMIN}</div>`;
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