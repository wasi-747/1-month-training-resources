'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Route
} from 'lucide-react';

// University Campuses in Dhaka with exact real GPS coordinates
export const DHAKA_UNIVERSITIES = [
  { id: 'nsu', name: 'North South University (NSU)', shortName: 'NSU (Gate 2/8)', area: 'Bashundhara R/A', lat: 23.8165, lng: 90.4285, students: '22k+ Students' },
  { id: 'iub', name: 'Independent University, Bangladesh (IUB)', shortName: 'IUB (Block B)', area: 'Bashundhara R/A', lat: 23.8152, lng: 90.4320, students: '12k+ Students' },
  { id: 'brac', name: 'BRAC University (New Campus)', shortName: 'BRAC (Merul Badda)', area: 'Badda', lat: 23.7745, lng: 90.4258, students: '18k+ Students' },
  { id: 'ewu', name: 'East West University (EWU)', shortName: 'East West (Aftabnagar)', area: 'Aftabnagar', lat: 23.7680, lng: 90.4350, students: '14k+ Students' },
  { id: 'aiub', name: 'AIUB Permanent Campus', shortName: 'AIUB (Kuril)', area: 'Kuril', lat: 23.8222, lng: 90.4215, students: '15k+ Students' },
  { id: 'uiu', name: 'United International University (UIU)', shortName: 'UIU (Madani Ave)', area: 'United City', lat: 23.7978, lng: 90.4496, students: '10k+ Students' },
  { id: 'du', name: 'Dhaka University (Nilkhet/TSC)', shortName: 'Dhaka Univ (TSC)', area: 'Nilkhet', lat: 23.7340, lng: 90.3928, students: '35k+ Students' },
  { id: 'dhanmondi27', name: 'Dhanmondi 27 (Daffodil/UIU Old)', shortName: 'Dhanmondi 27', area: 'Dhanmondi', lat: 23.7538, lng: 90.3742, students: 'Student Hub' },
  { id: 'saidnagar', name: 'Saidnagar 100ft Mess Corridor', shortName: 'Saidnagar 100ft', area: 'Saidnagar', lat: 23.7995, lng: 90.4420, students: 'Budget Mess' },
];

export default function RealDhakaStreetLeafletMap({
  userLocation,
  listings = [],
  selectedListing,
  onSelectListing,
  activeRouteListing,
  onClearRoute,
  mapHeight = '230px',
  showFullControls = true,
  interactivePin = false,
  onCenterChange,
  flyToLocation,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerGroupRef = useRef(null);
  const routeLayerGroupRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [mapTheme, setMapTheme] = useState('osm'); // 'osm' (Standard OSM with native Bangla fonts) | 'hot' | 'cyclosm'
  const [routeDetails, setRouteDetails] = useState(null);
  const [isRoutingLoading, setIsRoutingLoading] = useState(false);
  const [LInstance, setLInstance] = useState(null);
  const [isPinDragging, setIsPinDragging] = useState(false);

  // Dynamically load Leaflet on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        setLInstance(L.default || L);
      });
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!LInstance || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = LInstance;
    const initialLat = userLocation?.lat || 23.8165;
    const initialLng = userLocation?.lng || 90.4285;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // 100% Free Official OpenStreetMap Foundation Tile Servers (Native Bangla & English font support)
    const tileUrl =
      mapTheme === 'cyclosm'
        ? 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
        : mapTheme === 'hot'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    mapInstanceRef.current._tileLayer = tileLayer;

    // Layer Groups
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    // Interactive Pin move listener (Foodpanda / Pathao live pin drag)
    if (interactivePin && onCenterChange) {
      map.on('movestart', () => {
        setIsPinDragging(true);
      });
      map.on('move', () => {
        const center = map.getCenter();
        onCenterChange({ lat: center.lat, lng: center.lng, isDragging: true });
      });
      map.on('moveend', () => {
        setIsPinDragging(false);
        const center = map.getCenter();
        onCenterChange({ lat: center.lat, lng: center.lng, isDragging: false });
      });
    }

    // Ensure map tiles recalculate size after mount
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    // Lock parent window scroll on mouse wheel
    const container = mapContainerRef.current;
    if (container) {
      container.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.deltaY < 0) map.zoomIn();
          else map.zoomOut();
        },
        { passive: false }
      );
    }

    return () => {
      try {
        map.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      mapInstanceRef.current = null;
    };
  }, [LInstance]);

  // Update Tile Theme
  useEffect(() => {
    if (!LInstance || !mapInstanceRef.current || !mapInstanceRef.current._tileLayer) return;
    const L = LInstance;
    const map = mapInstanceRef.current;

    map.removeLayer(map._tileLayer);

    const tileUrl =
      mapTheme === 'cyclosm'
        ? 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
        : mapTheme === 'hot'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    map._tileLayer = newTileLayer;
  }, [mapTheme, LInstance]);

  // Fly to target when explicitly requested (e.g. search click or GPS locate)
  useEffect(() => {
    if (!mapInstanceRef.current || !flyToLocation) return;
    mapInstanceRef.current.flyTo([flyToLocation.lat, flyToLocation.lng], 16, { duration: 0.8 });
  }, [flyToLocation?.lat, flyToLocation?.lng]);

  // Update User & University Center (Only in normal Radar mode)
  useEffect(() => {
    if (!LInstance || !mapInstanceRef.current || !userLocation) return;
    if (interactivePin) return; // Prevent fighting against user's manual dragging in pin-drop mode!
    const L = LInstance;
    const map = mapInstanceRef.current;

    const lat = userLocation.lat || 23.8165;
    const lng = userLocation.lng || 90.4285;

    // Re-center smoothly
    if (!activeRouteListing) {
      map.panTo([lat, lng], { animate: true, duration: 0.6 });
    }

    // User Location Pulsing Marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-user-map-pin',
        html: `
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; background: rgba(56, 189, 248, 0.35); border-radius: 50%; animation: user-pulse 1.8s infinite;"></div>
            <div style="width: 14px; height: 14px; background: #0284c7; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      userMarkerRef.current = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindTooltip(`📍 ${userLocation.name || 'Your Location'}`, { permanent: false, direction: 'top' });
    }
  }, [userLocation, LInstance, activeRouteListing, interactivePin]);

  // Render Property Markers & University Landmarks
  useEffect(() => {
    if (!LInstance || !mapInstanceRef.current || !markersLayerGroupRef.current) return;
    const L = LInstance;
    const layer = markersLayerGroupRef.current;
    layer.clearLayers();

    // 1. Add University Campus Landmark Pins
    DHAKA_UNIVERSITIES.forEach((univ) => {
      const univIcon = L.divIcon({
        className: 'custom-univ-pin',
        html: `
          <div style="
            background: #1e293b;
            border: 1.5px solid #38bdf8;
            color: #38bdf8;
            padding: 3px 6px;
            border-radius: 6px;
            font-size: 10px;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6);
          ">
            🎓 ${univ.shortName}
          </div>
        `,
        iconSize: [80, 22],
        iconAnchor: [40, 11],
      });

      L.marker([univ.lat, univ.lng], { icon: univIcon, zIndexOffset: 200 })
        .addTo(layer)
        .bindTooltip(`🏛️ ${univ.name}<br/>${univ.students}`, { direction: 'top' });
    });

    // 2. Add Property Listings Markers
    listings.forEach((item) => {
      if (!item.location || !item.location.coordinates) return;
      const [lng, lat] = item.location.coordinates;

      const isSeat = item.rentalCategory === 'seat' || item.propertyType === 'seat_rent';
      const isDining = item.rentalCategory === 'dining_space' || item.propertyType === 'dining_space';
      const isSelected = selectedListing?._id === item._id || activeRouteListing?._id === item._id;

      const pinColor = isSeat ? '#4ade80' : isDining ? '#f6cd8b' : '#c9722d';

      const propIcon = L.divIcon({
        className: 'custom-prop-pin',
        html: `
          <div style="
            position: relative;
            background: ${isSelected ? '#ffffff' : pinColor};
            color: ${isSelected ? '#14120f' : '#ffffff'};
            border: 2px solid ${isSelected ? pinColor : '#1e1b17'};
            padding: 3px 7px;
            border-radius: 12px;
            font-size: 10px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 2px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.6);
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            ${isSeat ? '🛏️' : isDining ? '🍽️' : '৳'}${(item.rentAmount / 1000).toFixed(1)}k
          </div>
        `,
        iconSize: [48, 22],
        iconAnchor: [24, 11],
      });

      const marker = L.marker([lat, lng], { icon: propIcon, zIndexOffset: isSelected ? 800 : 400 })
        .addTo(layer)
        .on('click', () => {
          if (onSelectListing) onSelectListing(item);
        });

      marker.bindTooltip(`<b>${item.title}</b><br/>📍 ${item.addressText || item.area}`, { direction: 'top' });
    });
  }, [listings, selectedListing, activeRouteListing, LInstance]);

  // 🧭 Real Road Routing Engine (OSRM Free Road Engine)
  useEffect(() => {
    if (!LInstance || !mapInstanceRef.current || !routeLayerGroupRef.current) return;
    const L = LInstance;
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerGroupRef.current;
    routeLayer.clearLayers();

    if (!activeRouteListing || !userLocation) {
      setRouteDetails(null);
      return;
    }

    const startLat = userLocation.lat || 23.8165;
    const startLng = userLocation.lng || 90.4285;
    const [destLng, destLat] = activeRouteListing.location?.coordinates || [90.4285, 23.8165];

    // Accurate Haversine Distance in meters
    const R = 6371000;
    const dLatRad = ((destLat - startLat) * Math.PI) / 180;
    const dLngRad = ((destLng - startLng) * Math.PI) / 180;
    const a =
      Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
      Math.cos((startLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLngRad / 2) *
        Math.sin(dLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistanceMeters = Math.round(R * c);
    const isUnder1Km = straightDistanceMeters < 1000;

    setIsRoutingLoading(true);

    // Dynamic OSRM Profile: 'driving' for >= 1km, 'walking' for < 1km
    const profile = isUnder1Km ? 'walking' : 'driving';
    const osrmUrl = `https://router.project-osrm.org/route/v1/${profile}/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then((res) => res.json())
      .then((data) => {
        setIsRoutingLoading(false);
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceMeters = route.distance ? Math.round(route.distance) : straightDistanceMeters;
          const distanceKm = distanceMeters / 1000;
          const distanceStr = distanceMeters < 1000 ? `${distanceMeters}m` : `${distanceKm.toFixed(1)} km`;

          // Realistic Time Calculation (Dhaka City traffic calibrated)
          let primaryText = '';
          let secondaryText = '';
          let googleTravelMode = 'driving';

          if (distanceKm < 1.0) {
            // Walking Mode (< 1 km)
            googleTravelMode = 'walking';
            const walkMins = Math.max(1, Math.round(distanceKm * 13)); // ~4.6 km/h walking speed
            const rickshawMins = Math.max(1, Math.round(distanceKm * 5)); // rickshaw speed
            primaryText = `🚶 ${walkMins} min walk (${distanceStr})`;
            secondaryText = `🛺 ${rickshawMins} min`;
          } else {
            // Driving / Ride Mode (>= 1 km)
            googleTravelMode = 'driving';
            // Car in Dhaka traffic: ~20 km/h + 3 min traffic base
            const driveMins = Math.max(4, Math.round(distanceKm * 3.2 + 3));
            // Motorbike / Pathao: ~30 km/h + 2 min base
            const bikeMins = Math.max(3, Math.round(distanceKm * 2.0 + 2));
            primaryText = `🚗 ${driveMins} min drive (${distanceStr})`;
            secondaryText = `🛵 ${bikeMins} min bike`;
          }

          setRouteDetails({
            distanceMeters,
            distanceKm,
            distanceStr,
            primaryText,
            secondaryText,
            googleTravelMode,
            destination: activeRouteListing.title,
            address: activeRouteListing.addressText,
            destCoords: [destLat, destLng],
            startCoords: [startLat, startLng],
          });

          // Draw Glowing Road Polyline
          const geojsonLayer = L.geoJSON(route.geometry, {
            style: {
              color: '#38bdf8',
              weight: 5,
              opacity: 0.9,
              dashArray: '8, 8',
              lineCap: 'round',
              lineJoin: 'round',
            },
          }).addTo(routeLayer);

          // Add pulsing start & end highlight
          map.fitBounds(geojsonLayer.getBounds(), { padding: [35, 35], maxZoom: 16 });
        } else {
          // Fallback direct line if offline or OSRM unavailable
          const distanceMeters = straightDistanceMeters;
          const distanceKm = distanceMeters / 1000;
          const distanceStr = distanceMeters < 1000 ? `${distanceMeters}m` : `${distanceKm.toFixed(1)} km`;

          let primaryText = '';
          let secondaryText = '';
          let googleTravelMode = 'driving';

          if (distanceKm < 1.0) {
            googleTravelMode = 'walking';
            const walkMins = Math.max(1, Math.round(distanceKm * 13));
            const rickshawMins = Math.max(1, Math.round(distanceKm * 5));
            primaryText = `🚶 ${walkMins} min walk (${distanceStr})`;
            secondaryText = `🛺 ${rickshawMins} min`;
          } else {
            googleTravelMode = 'driving';
            const driveMins = Math.max(4, Math.round(distanceKm * 3.2 + 3));
            const bikeMins = Math.max(3, Math.round(distanceKm * 2.0 + 2));
            primaryText = `🚗 ${driveMins} min drive (${distanceStr})`;
            secondaryText = `🛵 ${bikeMins} min bike`;
          }

          setRouteDetails({
            distanceMeters,
            distanceKm,
            distanceStr,
            primaryText,
            secondaryText,
            googleTravelMode,
            destination: activeRouteListing.title,
            address: activeRouteListing.addressText,
            destCoords: [destLat, destLng],
            startCoords: [startLat, startLng],
          });

          const polyline = L.polyline(
            [
              [startLat, startLng],
              [destLat, destLng],
            ],
            { color: '#38bdf8', weight: 4, dashArray: '6, 6' }
          ).addTo(routeLayer);
          map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
        }
      })
      .catch((err) => {
        setIsRoutingLoading(false);
        console.warn('OSRM routing fetch failed:', err);
      });
  }, [activeRouteListing, userLocation, LInstance]);

  return (
    <div
      style={{
        position: 'relative',
        height: mapHeight,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--border-medium)',
        background: '#1a1714',
      }}
    >
      {/* Map DOM Element */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', outline: 'none' }} />

      {/* Top Map Controls */}
      {showFullControls && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 500, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setMapTheme((prev) => (prev === 'osm' ? 'hot' : prev === 'hot' ? 'cyclosm' : 'osm'))}
            style={{
              background: 'rgba(20, 18, 15, 0.88)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '5px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            title="Toggle Map Style (Standard OSM with native Bangla / Humanitarian / CyclOSM)"
          >
            <Layers size={13} style={{ color: 'var(--brand-primary)' }} />
          </button>

          <button
            onClick={() => {
              if (mapInstanceRef.current && userLocation) {
                mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 16);
              }
            }}
            style={{
              background: 'rgba(20, 18, 15, 0.88)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--border-subtle)',
              color: '#38bdf8',
              padding: '5px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
            title="Re-center to my location"
          >
            <Crosshair size={13} />
          </button>
        </div>
      )}

      {/* 🧭 Active Road Navigation Route Floating Card */}
      {routeDetails && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            right: '8px',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1px solid #38bdf8',
            borderRadius: '10px',
            padding: '8px 12px',
            zIndex: 600,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>
                {routeDetails.primaryText}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>• {routeDetails.secondaryText}</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', marginTop: '1px' }}>
              To: {routeDetails.address || routeDetails.destination}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexShrink: 0 }}>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${routeDetails.startCoords[0]},${routeDetails.startCoords[1]}&destination=${routeDetails.destCoords[0]},${routeDetails.destCoords[1]}&travelmode=${routeDetails.googleTravelMode}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#0284c7',
                color: '#fff',
                textDecoration: 'none',
                padding: '4px 8px',
                borderRadius: '5px',
                fontSize: '0.68rem',
                fontWeight: 700,
                fontFamily: 'Space Grotesk',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              GPS <ExternalLink size={10} />
            </a>

            {onClearRoute && (
              <button
                onClick={onClearRoute}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🎯 Interactive Center Pin-Drop (Foodpanda / Pathao Style) */}
      {interactivePin && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: isPinDragging ? 'translate(-50%, -120%) scale(1.12)' : 'translate(-50%, -100%) scale(1)',
            transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 500,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Main Pin */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPinDragging ? '0 14px 24px rgba(0,0,0,0.6)' : '0 4px 10px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }} />
          </div>
          {/* Bottom shadow dot */}
          <div
            style={{
              width: isPinDragging ? '14px' : '8px',
              height: isPinDragging ? '5px' : '3px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.45)',
              filter: 'blur(1px)',
              marginTop: isPinDragging ? '12px' : '2px',
              transition: 'all 0.15s ease',
            }}
          />
        </div>
      )}
    </div>
  );
}
