import { Threat, ThreatSeverity, ThreatType } from '../../types';
import { MOCK_THREATS } from '../../constants';

// USGS Earthquake GeoJSON feed (M4.5+, last 24h). Public, no key.
const USGS_API_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';

export const onRequest: PagesFunction = async () => {
  let threats: Threat[] = [...MOCK_THREATS];

  try {
    const response = await fetch(USGS_API_URL, {
      cf: {
        // Let Cloudflare cache this at the edge to reduce calls.
        cacheTtl: 60,
        cacheEverything: true,
      },
    });

    if (response.ok) {
      const data: any = await response.json();
      const earthquakeThreats: Threat[] = (data?.features ?? []).map((feature: any) => {
        const mag = feature?.properties?.mag ?? 0;
        const place = feature?.properties?.place ?? 'Unknown location';
        const coords = feature?.geometry?.coordinates ?? [0, 0, 0];

        const severity =
          mag >= 7 ? ThreatSeverity.CRITICAL :
          mag >= 6 ? ThreatSeverity.HIGH :
          mag >= 5 ? ThreatSeverity.MEDIUM :
          ThreatSeverity.LOW;

        return {
          id: String(feature?.id ?? crypto.randomUUID()),
          type: ThreatType.EARTHQUAKE,
          severity,
          title: `M ${mag.toFixed(1)} Earthquake - ${place}`,
          description: `Depth: ${coords[2]}km. Status: ${feature?.properties?.status ?? 'unknown'}.`,
          latitude: Number(coords[1] ?? 0),
          longitude: Number(coords[0] ?? 0),
          timestamp: Number(feature?.properties?.time ?? Date.now()),
          source: 'USGS Real-time',
          radiusKm: Math.max(25, mag * 20),
        };
      });

      threats = [...threats, ...earthquakeThreats];
    }
  } catch (e) {
    // Return mock threats only if USGS call fails.
    console.warn('USGS fetch failed:', e);
  }

  return new Response(JSON.stringify({ threats }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=30',
    },
  });
};
