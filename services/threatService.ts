
import { Threat, ThreatSeverity, ThreatType } from '../types';
import { MOCK_THREATS } from '../constants';

// USGS Earthquake API
const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';

export const fetchGlobalThreats = async (): Promise<Threat[]> => {
  let threats: Threat[] = [...MOCK_THREATS];

  try {
    const response = await fetch(USGS_API_URL);
    if (response.ok) {
      const data = await response.json();
      const earthquakeThreats: Threat[] = data.features.map((feature: any) => ({
        id: feature.id,
        type: ThreatType.EARTHQUAKE, // More specific than SEISMIC
        severity: feature.properties.mag > 6 ? ThreatSeverity.HIGH : ThreatSeverity.MEDIUM,
        title: `M ${feature.properties.mag} Earthquake - ${feature.properties.place}`,
        description: `Depth: ${feature.geometry.coordinates[2]}km. Status: ${feature.properties.status}.`,
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
        timestamp: feature.properties.time,
        source: 'USGS Real-time',
        radiusKm: feature.properties.mag * 20 // Rough estimate of impact radius
      }));
      
      // Merge real data with mock data
      threats = [...threats, ...earthquakeThreats];
    }
  } catch (error) {
    console.error("Failed to fetch USGS data, falling back to mock only", error);
  }

  return threats;
};

// Helper to filter threats by radius
export const getThreatsNearLocation = (
  lat: number,
  lng: number,
  radiusKm: number,
  allThreats: Threat[]
): Threat[] => {
  return allThreats.filter(threat => {
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
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
