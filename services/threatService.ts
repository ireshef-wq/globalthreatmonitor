import { Threat } from '../types';
import { MOCK_THREATS } from '../constants';

/**
 * Frontend data access layer.
 *
 * v1 strategy:
 * - Prefer calling our Pages Worker API (/api/events) so we can later swap in D1+KV
 *   without changing the UI.
 * - Fall back to mock data if the API is unavailable (local dev without functions).
 */
export const fetchGlobalThreats = async (): Promise<Threat[]> => {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    // Expecting { threats: Threat[] }
    if (data?.threats && Array.isArray(data.threats)) return data.threats as Threat[];
    // Backward compatibility: if API returns Threat[] directly
    if (Array.isArray(data)) return data as Threat[];
  } catch (err) {
    console.warn('Failed to fetch /api/events, falling back to mock data.', err);
  }
  return [...MOCK_THREATS];
};

// Helper to filter threats by radius
export const getThreatsNearLocation = (
  lat: number,
  lng: number,
  radiusKm: number,
  allThreats: Threat[]
): Threat[] => {
  return allThreats.filter((threat) => {
    const distance = calculateDistance(lat, lng, threat.latitude, threat.longitude);
    return distance <= radiusKm;
  });
};

// Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
