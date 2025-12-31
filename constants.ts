
import { ThreatSeverity, ThreatType, Sensor, AppSettings } from './types';

// Map Configuration
export const MAP_TILE_LAYER_URL_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const MAP_TILE_LAYER_URL_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
export const DEFAULT_CENTER: [number, number] = [20, 0];
export const DEFAULT_ZOOM = 2;

// Visual mapping for threats
export const SEVERITY_COLORS: Record<ThreatSeverity, string> = {
  [ThreatSeverity.LOW]: '#10b981', // green-500
  [ThreatSeverity.MEDIUM]: '#f59e0b', // amber-500
  [ThreatSeverity.HIGH]: '#ef4444', // red-500
  [ThreatSeverity.CRITICAL]: '#7f1d1d', // red-900 (pulsing)
};

// This map is used by the Icon component to lookup icon names (string based for simpler passing)
// The actual icons are imported in the component
export const THREAT_ICONS: Record<ThreatType, string> = {
  // Security & Conflict
  [ThreatType.CONFLICT]: 'Swords',
  [ThreatType.ARMED_CONFLICT]: 'Swords',
  [ThreatType.TERROR]: 'Siren',
  [ThreatType.MILITARY_ACTIVITY]: 'Crosshair',
  [ThreatType.DRONE_ATTACK]: 'Plane', // Fallback for drone
  [ThreatType.CYBER_ATTACK]: 'Cpu',
  [ThreatType.PIRACY]: 'Skull',
  [ThreatType.SABOTAGE]: 'Bomb',

  // Civil & Social
  [ThreatType.CIVIL_UNREST]: 'Megaphone',
  [ThreatType.PROTEST]: 'Megaphone',
  [ThreatType.RIOT]: 'Flame',
  [ThreatType.STRIKE]: 'Ban',
  [ThreatType.POLITICAL_INSTABILITY]: 'Landmark',
  [ThreatType.ELECTION_UNREST]: 'Vote',
  [ThreatType.MASS_GATHERING_RISK]: 'Users',
  [ThreatType.REFUGEE_MOVEMENT]: 'Footprints',

  // Natural Hazards
  [ThreatType.EARTHQUAKE]: 'Activity',
  [ThreatType.SEISMIC]: 'Activity',
  [ThreatType.VOLCANIC]: 'Mountain',
  [ThreatType.TSUNAMI]: 'Waves',
  [ThreatType.FLOOD]: 'Waves',
  [ThreatType.FLASH_FLOOD]: 'Waves',
  [ThreatType.STORM]: 'CloudLightning',
  [ThreatType.EXTREME_WEATHER]: 'ThermometerSnowflake',
  [ThreatType.HEATWAVE]: 'Sun',
  [ThreatType.DROUGHT]: 'SunDim',
  [ThreatType.WILDFIRE]: 'Flame',
  [ThreatType.LANDSLIDE]: 'MountainSnow',
  [ThreatType.AVALANCHE]: 'MountainSnow',

  // Climate & Environment
  [ThreatType.CLIMATE_ANOMALY]: 'CloudRain',
  [ThreatType.AIR_POLLUTION]: 'Wind',
  [ThreatType.WATER_CONTAMINATION]: 'Droplets',
  [ThreatType.TOXIC_RELEASE]: 'Biohazard',
  [ThreatType.SEA_LEVEL_RISE]: 'Waves',
  [ThreatType.DESERTIFICATION]: 'SunDim',

  // Health & Biological
  [ThreatType.HEALTH]: 'Stethoscope',
  [ThreatType.PANDEMIC]: 'Biohazard',
  [ThreatType.EPIDEMIC]: 'Biohazard',
  [ThreatType.DISEASE_OUTBREAK]: 'Biohazard',
  [ThreatType.BIOLOGICAL_HAZARD]: 'Biohazard',
  [ThreatType.FOODBORNE_ILLNESS]: 'Utensils',

  // Industrial & Technological
  [ThreatType.INDUSTRIAL_ACCIDENT]: 'Factory',
  [ThreatType.NUCLEAR_INCIDENT]: 'Radiation',
  [ThreatType.CHEMICAL_SPILL]: 'FlaskConical',
  [ThreatType.EXPLOSION]: 'Bomb',
  [ThreatType.GAS_LEAK]: 'Wind',
  [ThreatType.DAM_FAILURE]: 'Waves',
  [ThreatType.TRANSPORT_ACCIDENT]: 'Car',
  [ThreatType.AVIATION_INCIDENT]: 'Plane',
  [ThreatType.MARITIME_ACCIDENT]: 'Anchor',

  // Infrastructure & Utilities
  [ThreatType.POWER_OUTAGE]: 'ZapOff',
  [ThreatType.GRID_FAILURE]: 'ZapOff',
  [ThreatType.WATER_SUPPLY_FAILURE]: 'Droplets',
  [ThreatType.TELECOM_OUTAGE]: 'PhoneOff',
  [ThreatType.INTERNET_DISRUPTION]: 'WifiOff',
  [ThreatType.FUEL_SHORTAGE]: 'Fuel',
  [ThreatType.SUPPLY_CHAIN_DISRUPTION]: 'Truck',

  // Space & Solar
  [ThreatType.SOLAR_RADIATION]: 'Sun',
  [ThreatType.SOLAR_FLARE]: 'Sun',
  [ThreatType.GEOMAGNETIC_STORM]: 'Magnet',
  [ThreatType.SPACE_WEATHER]: 'Rocket',

  // Mobility & Travel
  [ThreatType.TRAVEL_ALERT]: 'Plane',
  [ThreatType.TRAVEL_RESTRICTION]: 'Ban',
  [ThreatType.BORDER_CLOSURE]: 'DoorClosed',
  [ThreatType.EVACUATION_ORDER]: 'LogOut',
  [ThreatType.MARINE]: 'Anchor',
  [ThreatType.PORT_CLOSURE]: 'Anchor',
  [ThreatType.AIRSPACE_RESTRICTION]: 'Plane',

  // Information & Governance
  [ThreatType.DISINFORMATION]: 'MessageSquareWarning',
  [ThreatType.MISINFORMATION]: 'MessageSquareWarning',
  [ThreatType.PROPAGANDA]: 'Megaphone',
  [ThreatType.STATE_OF_EMERGENCY]: 'Siren',
  [ThreatType.CURFEW]: 'Clock',
  [ThreatType.SANCTIONS]: 'Gavel',
  
  [ThreatType.OTHER]: 'AlertTriangle',
};

// Groupings for Settings Page
export const THREAT_GROUPS = {
  "Security & Conflict": [
    ThreatType.CONFLICT, ThreatType.ARMED_CONFLICT, ThreatType.TERROR, ThreatType.MILITARY_ACTIVITY, 
    ThreatType.DRONE_ATTACK, ThreatType.CYBER_ATTACK, ThreatType.PIRACY, ThreatType.SABOTAGE
  ],
  "Civil & Social": [
    ThreatType.CIVIL_UNREST, ThreatType.PROTEST, ThreatType.RIOT, ThreatType.STRIKE, 
    ThreatType.POLITICAL_INSTABILITY, ThreatType.ELECTION_UNREST, ThreatType.MASS_GATHERING_RISK, ThreatType.REFUGEE_MOVEMENT
  ],
  "Natural Hazards": [
    ThreatType.EARTHQUAKE, ThreatType.SEISMIC, ThreatType.VOLCANIC, ThreatType.TSUNAMI, 
    ThreatType.FLOOD, ThreatType.FLASH_FLOOD, ThreatType.STORM, ThreatType.EXTREME_WEATHER, 
    ThreatType.HEATWAVE, ThreatType.DROUGHT, ThreatType.WILDFIRE, ThreatType.LANDSLIDE, ThreatType.AVALANCHE
  ],
  "Climate & Environment": [
    ThreatType.CLIMATE_ANOMALY, ThreatType.AIR_POLLUTION, ThreatType.WATER_CONTAMINATION, 
    ThreatType.TOXIC_RELEASE, ThreatType.SEA_LEVEL_RISE, ThreatType.DESERTIFICATION
  ],
  "Health & Biological": [
    ThreatType.HEALTH, ThreatType.PANDEMIC, ThreatType.EPIDEMIC, ThreatType.DISEASE_OUTBREAK, 
    ThreatType.BIOLOGICAL_HAZARD, ThreatType.FOODBORNE_ILLNESS
  ],
  "Industrial & Technological": [
    ThreatType.INDUSTRIAL_ACCIDENT, ThreatType.NUCLEAR_INCIDENT, ThreatType.CHEMICAL_SPILL, 
    ThreatType.EXPLOSION, ThreatType.GAS_LEAK, ThreatType.DAM_FAILURE, ThreatType.TRANSPORT_ACCIDENT, 
    ThreatType.AVIATION_INCIDENT, ThreatType.MARITIME_ACCIDENT
  ],
  "Infrastructure & Utilities": [
    ThreatType.POWER_OUTAGE, ThreatType.GRID_FAILURE, ThreatType.WATER_SUPPLY_FAILURE, 
    ThreatType.TELECOM_OUTAGE, ThreatType.INTERNET_DISRUPTION, ThreatType.FUEL_SHORTAGE, ThreatType.SUPPLY_CHAIN_DISRUPTION
  ],
  "Space & Solar": [
    ThreatType.SOLAR_RADIATION, ThreatType.SOLAR_FLARE, ThreatType.GEOMAGNETIC_STORM, ThreatType.SPACE_WEATHER
  ],
  "Mobility & Travel": [
    ThreatType.TRAVEL_ALERT, ThreatType.TRAVEL_RESTRICTION, ThreatType.BORDER_CLOSURE, 
    ThreatType.EVACUATION_ORDER, ThreatType.MARINE, ThreatType.PORT_CLOSURE, ThreatType.AIRSPACE_RESTRICTION
  ],
  "Information & Governance": [
    ThreatType.DISINFORMATION, ThreatType.MISINFORMATION, ThreatType.PROPAGANDA, 
    ThreatType.STATE_OF_EMERGENCY, ThreatType.CURFEW, ThreatType.SANCTIONS
  ]
};

// Sensors
export const MOCK_SENSORS: Sensor[] = [
  { id: '1', name: 'USGS Earthquake Feed', type: 'Seismic API', provides: [ThreatType.EARTHQUAKE, ThreatType.SEISMIC], status: 'ONLINE', lastUpdate: Date.now() - 300000 },
  { id: '2', name: 'NASA FIRMS', type: 'Satellite Thermal', provides: [ThreatType.WILDFIRE], status: 'ONLINE', lastUpdate: Date.now() - 1200000 },
  { id: '3', name: 'NOAA Hurricane Center', type: 'Meteorological', provides: [ThreatType.STORM, ThreatType.FLOOD, ThreatType.EXTREME_WEATHER], status: 'ONLINE', lastUpdate: Date.now() - 600000 },
  { id: '4', name: 'GDELT Project', type: 'News Aggregator', provides: [ThreatType.CIVIL_UNREST, ThreatType.CONFLICT, ThreatType.TERROR, ThreatType.PROTEST], status: 'DEGRADED', lastUpdate: Date.now() - 3600000 },
  { id: '5', name: 'WHO Disease Outbreak News', type: 'Health Report', provides: [ThreatType.PANDEMIC, ThreatType.DISEASE_OUTBREAK], status: 'ONLINE', lastUpdate: Date.now() - 86400000 },
  { id: '6', name: 'Local Gov Feeds', type: 'Mixed', provides: [ThreatType.OTHER, ThreatType.INDUSTRIAL_ACCIDENT, ThreatType.TRAVEL_ALERT], status: 'OFFLINE', lastUpdate: Date.now() - 172800000 },
];

export const DEFAULT_SETTINGS: AppSettings = {
  disabledThreatTypes: [],
  disabledSensors: []
};

// Initial Mock Data
export const MOCK_THREATS = [
  {
    id: 't1',
    type: ThreatType.EARTHQUAKE,
    severity: ThreatSeverity.HIGH,
    title: 'M 6.2 Earthquake - Japan Region',
    description: 'Strong seismic activity detected off the coast of Honshu.',
    latitude: 36.2048,
    longitude: 138.2529,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    source: 'USGS Real-time',
    radiusKm: 150
  },
  {
    id: 't2',
    type: ThreatType.WILDFIRE,
    severity: ThreatSeverity.CRITICAL,
    title: 'Canyon Fire - California',
    description: 'Rapidly spreading wildfire in dry brush. Evacuation orders in effect.',
    latitude: 34.0522,
    longitude: -118.2437,
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    source: 'NASA FIRMS',
    radiusKm: 50
  },
  {
    id: 't3',
    type: ThreatType.STORM,
    severity: ThreatSeverity.MEDIUM,
    title: 'Tropical Storm Alpha',
    description: 'Developing system in the Atlantic. Heavy rains expected.',
    latitude: 25.7617,
    longitude: -80.1918,
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    source: 'NOAA Hurricane Center',
    radiusKm: 300
  },
  {
    id: 't4',
    type: ThreatType.DISEASE_OUTBREAK,
    severity: ThreatSeverity.LOW,
    title: 'Viral Outbreak Watch',
    description: 'Increased reports of respiratory illness in the region.',
    latitude: 48.8566,
    longitude: 2.3522,
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    source: 'WHO Disease Outbreak News',
    radiusKm: 500
  },
  {
    id: 't5',
    type: ThreatType.PROTEST,
    severity: ThreatSeverity.MEDIUM,
    title: 'Protests - Central Square',
    description: 'Large gathering expected in downtown area. Traffic disruptions.',
    latitude: 51.5074,
    longitude: -0.1278,
    timestamp: Date.now() - 1000 * 60 * 60 * 1,
    source: 'GDELT Project',
    radiusKm: 10
  }
];
