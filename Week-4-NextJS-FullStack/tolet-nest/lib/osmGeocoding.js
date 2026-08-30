/**
 * ==============================================================================================
 * 🌍 OpenStreetMap Nominatim Realtime Geocoding Search Engine for Bangladesh
 * ==============================================================================================
 * Queries live OSM Nominatim API for places, addresses, universities, restaurants (KFC etc.),
 * and cities across Bangladesh with client-side caching.
 * ==============================================================================================
 */

const geocodeCache = new Map();

export async function searchRealtimePlaces(query) {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  // Check cache first
  const cacheKey = cleanQuery.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      cleanQuery
    )}&countrycodes=bd&format=json&addressdetails=1&limit=8`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'bn,en',
        'User-Agent': 'ToLetNest-App-v2/1.0',
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const formattedResults = data.map((item) => {
      const addr = item.address || {};
      const road = addr.road || addr.suburb || addr.neighbourhood || '';
      const district = addr.city || addr.town || addr.county || addr.state_district || 'Bangladesh';
      const shortName = item.name || road || cleanQuery;

      return {
        id: `osm-${item.place_id}`,
        name: item.display_name,
        shortName: shortName,
        area: road ? `${road}, ${district}` : district,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type || item.class || 'place',
        categoryLabel: getCategoryEmojiLabel(item.type, item.class),
        isOSM: true,
      };
    });

    geocodeCache.set(cacheKey, formattedResults);
    return formattedResults;
  } catch (err) {
    console.warn('OSM Geocoding fetch error (falling back):', err);
    return [];
  }
}

function getCategoryEmojiLabel(type, osmClass) {
  if (osmClass === 'amenity' && (type === 'restaurant' || type === 'fast_food')) {
    return '🍔 Restaurant / Food';
  }
  if (type === 'university' || type === 'college' || type === 'school') {
    return '🎓 Campus / College';
  }
  if (type === 'hospital' || type === 'clinic') {
    return '🏥 Hospital / Medical';
  }
  if (osmClass === 'highway' || type === 'road' || type === 'residential') {
    return '🛣️ Street / Road';
  }
  if (type === 'city' || type === 'town' || type === 'administrative') {
    return '🏙️ District / City';
  }
  return '📍 Location / Place';
}
