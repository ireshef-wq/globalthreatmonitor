
export enum ThreatSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ThreatType {
  // Security & Conflict
  CONFLICT = 'CONFLICT',
  ARMED_CONFLICT = 'ARMED_CONFLICT',
  TERROR = 'TERROR',
  MILITARY_ACTIVITY = 'MILITARY_ACTIVITY',
  DRONE_ATTACK = 'DRONE_ATTACK',
  CYBER_ATTACK = 'CYBER_ATTACK',
  PIRACY = 'PIRACY',
  SABOTAGE = 'SABOTAGE',

  // Civil & Social
  CIVIL_UNREST = 'CIVIL_UNREST',
  PROTEST = 'PROTEST',
  RIOT = 'RIOT',
  STRIKE = 'STRIKE',
  POLITICAL_INSTABILITY = 'POLITICAL_INSTABILITY',
  ELECTION_UNREST = 'ELECTION_UNREST',
  MASS_GATHERING_RISK = 'MASS_GATHERING_RISK',
  REFUGEE_MOVEMENT = 'REFUGEE_MOVEMENT',

  // Natural Hazards
  EARTHQUAKE = 'EARTHQUAKE',
  SEISMIC = 'SEISMIC',
  VOLCANIC = 'VOLCANIC',
  TSUNAMI = 'TSUNAMI',
  FLOOD = 'FLOOD',
  FLASH_FLOOD = 'FLASH_FLOOD',
  STORM = 'STORM',
  EXTREME_WEATHER = 'EXTREME_WEATHER',
  HEATWAVE = 'HEATWAVE',
  DROUGHT = 'DROUGHT',
  WILDFIRE = 'WILDFIRE',
  LANDSLIDE = 'LANDSLIDE',
  AVALANCHE = 'AVALANCHE',

  // Climate & Environment
  CLIMATE_ANOMALY = 'CLIMATE_ANOMALY',
  AIR_POLLUTION = 'AIR_POLLUTION',
  WATER_CONTAMINATION = 'WATER_CONTAMINATION',
  TOXIC_RELEASE = 'TOXIC_RELEASE',
  SEA_LEVEL_RISE = 'SEA_LEVEL_RISE',
  DESERTIFICATION = 'DESERTIFICATION',

  // Health & Biological
  HEALTH = 'HEALTH',
  PANDEMIC = 'PANDEMIC',
  EPIDEMIC = 'EPIDEMIC',
  DISEASE_OUTBREAK = 'DISEASE_OUTBREAK',
  BIOLOGICAL_HAZARD = 'BIOLOGICAL_HAZARD',
  FOODBORNE_ILLNESS = 'FOODBORNE_ILLNESS',

  // Industrial & Technological
  INDUSTRIAL_ACCIDENT = 'INDUSTRIAL_ACCIDENT',
  NUCLEAR_INCIDENT = 'NUCLEAR_INCIDENT',
  CHEMICAL_SPILL = 'CHEMICAL_SPILL',
  EXPLOSION = 'EXPLOSION',
  GAS_LEAK = 'GAS_LEAK',
  DAM_FAILURE = 'DAM_FAILURE',
  TRANSPORT_ACCIDENT = 'TRANSPORT_ACCIDENT',
  AVIATION_INCIDENT = 'AVIATION_INCIDENT',
  MARITIME_ACCIDENT = 'MARITIME_ACCIDENT',

  // Infrastructure & Utilities
  POWER_OUTAGE = 'POWER_OUTAGE',
  GRID_FAILURE = 'GRID_FAILURE',
  WATER_SUPPLY_FAILURE = 'WATER_SUPPLY_FAILURE',
  TELECOM_OUTAGE = 'TELECOM_OUTAGE',
  INTERNET_DISRUPTION = 'INTERNET_DISRUPTION',
  FUEL_SHORTAGE = 'FUEL_SHORTAGE',
  SUPPLY_CHAIN_DISRUPTION = 'SUPPLY_CHAIN_DISRUPTION',

  // Space & Solar
  SOLAR_RADIATION = 'SOLAR_RADIATION',
  SOLAR_FLARE = 'SOLAR_FLARE',
  GEOMAGNETIC_STORM = 'GEOMAGNETIC_STORM',
  SPACE_WEATHER = 'SPACE_WEATHER',

  // Mobility & Travel
  TRAVEL_ALERT = 'TRAVEL_ALERT',
  TRAVEL_RESTRICTION = 'TRAVEL_RESTRICTION',
  BORDER_CLOSURE = 'BORDER_CLOSURE',
  EVACUATION_ORDER = 'EVACUATION_ORDER',
  MARINE = 'MARINE',
  PORT_CLOSURE = 'PORT_CLOSURE',
  AIRSPACE_RESTRICTION = 'AIRSPACE_RESTRICTION',

  // Information & Governance
  DISINFORMATION = 'DISINFORMATION',
  MISINFORMATION = 'MISINFORMATION',
  PROPAGANDA = 'PROPAGANDA',
  STATE_OF_EMERGENCY = 'STATE_OF_EMERGENCY',
  CURFEW = 'CURFEW',
  SANCTIONS = 'SANCTIONS',
  
  OTHER = 'OTHER'
}

export interface Threat {
  id: string;
  type: ThreatType;
  severity: ThreatSeverity;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  source: string;
  radiusKm?: number;
}

export interface UserLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number; // Monitoring radius
}

export interface AiSummary {
  locationId: string;
  summary: string;
  timestamp: number;
  threatCount: number;
}

export interface RouteAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  summary: string;
  alternatives: string;
  timestamp: number;
}

export interface Sensor {
  id: string;
  name: string;
  type: string; // e.g. "Seismic", "Satellite"
  provides: ThreatType[];
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  lastUpdate: number;
}

export enum UserRole {
  GUEST = 'GUEST',
  VIEWER = 'VIEWER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface AppSettings {
  disabledThreatTypes: ThreatType[];
  disabledSensors: string[]; // Sensor IDs
}
