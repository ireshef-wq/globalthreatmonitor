
import React from 'react';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { 
  Activity, Flame, Waves, CloudLightning, Biohazard, ShieldAlert, AlertTriangle, MapPin, 
  Swords, Siren, Megaphone, Plane, Cloud, Anchor, ThermometerSnowflake, Mountain, Factory, Radiation, Stethoscope, Sun,
  Crosshair, Skull, Bomb, Vote, Users, Footprints, SunDim, MountainSnow, CloudRain, Wind, Droplets, Utensils,
  FlaskConical, Car, ZapOff, PhoneOff, WifiOff, Fuel, Truck, Magnet, Rocket, DoorClosed, LogOut, MessageSquareWarning, Clock, Gavel
} from 'lucide-react';
import { ThreatType, ThreatSeverity } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface IconProps {
  type: ThreatType | 'USER_LOCATION';
  severity?: ThreatSeverity;
}

const getIconComponent = (type: string) => {
  switch (type) {
    // Security & Conflict
    case ThreatType.CONFLICT: return Swords;
    case ThreatType.ARMED_CONFLICT: return Swords;
    case ThreatType.TERROR: return Siren;
    case ThreatType.MILITARY_ACTIVITY: return Crosshair;
    case ThreatType.DRONE_ATTACK: return Plane;
    case ThreatType.CYBER_ATTACK: return Users; // Closest approximation available in lucide default for "hack"
    case ThreatType.PIRACY: return Skull;
    case ThreatType.SABOTAGE: return Bomb;

    // Civil & Social
    case ThreatType.CIVIL_UNREST: return Megaphone;
    case ThreatType.PROTEST: return Megaphone;
    case ThreatType.RIOT: return Flame;
    case ThreatType.STRIKE: return Users; // "Ban" is good, but Users for strike is also standard
    case ThreatType.POLITICAL_INSTABILITY: return Gavel; // Landmark alternative
    case ThreatType.ELECTION_UNREST: return Vote;
    case ThreatType.MASS_GATHERING_RISK: return Users;
    case ThreatType.REFUGEE_MOVEMENT: return Footprints;

    // Natural Hazards
    case ThreatType.EARTHQUAKE: return Activity;
    case ThreatType.SEISMIC: return Activity;
    case ThreatType.VOLCANIC: return Mountain;
    case ThreatType.TSUNAMI: return Waves;
    case ThreatType.FLOOD: return Waves;
    case ThreatType.FLASH_FLOOD: return Waves;
    case ThreatType.STORM: return CloudLightning;
    case ThreatType.EXTREME_WEATHER: return ThermometerSnowflake;
    case ThreatType.HEATWAVE: return Sun;
    case ThreatType.DROUGHT: return SunDim;
    case ThreatType.WILDFIRE: return Flame;
    case ThreatType.LANDSLIDE: return MountainSnow;
    case ThreatType.AVALANCHE: return MountainSnow;

    // Climate & Environment
    case ThreatType.CLIMATE_ANOMALY: return CloudRain;
    case ThreatType.AIR_POLLUTION: return Wind;
    case ThreatType.WATER_CONTAMINATION: return Droplets;
    case ThreatType.TOXIC_RELEASE: return Biohazard;
    case ThreatType.SEA_LEVEL_RISE: return Waves;
    case ThreatType.DESERTIFICATION: return SunDim;

    // Health & Biological
    case ThreatType.HEALTH: return Stethoscope;
    case ThreatType.PANDEMIC: return Biohazard;
    case ThreatType.EPIDEMIC: return Biohazard;
    case ThreatType.DISEASE_OUTBREAK: return Biohazard;
    case ThreatType.BIOLOGICAL_HAZARD: return Biohazard;
    case ThreatType.FOODBORNE_ILLNESS: return Utensils;

    // Industrial & Technological
    case ThreatType.INDUSTRIAL_ACCIDENT: return Factory;
    case ThreatType.NUCLEAR_INCIDENT: return Radiation;
    case ThreatType.CHEMICAL_SPILL: return FlaskConical;
    case ThreatType.EXPLOSION: return Bomb;
    case ThreatType.GAS_LEAK: return Wind;
    case ThreatType.DAM_FAILURE: return Waves;
    case ThreatType.TRANSPORT_ACCIDENT: return Car;
    case ThreatType.AVIATION_INCIDENT: return Plane;
    case ThreatType.MARITIME_ACCIDENT: return Anchor;

    // Infrastructure
    case ThreatType.POWER_OUTAGE: return ZapOff;
    case ThreatType.GRID_FAILURE: return ZapOff;
    case ThreatType.WATER_SUPPLY_FAILURE: return Droplets;
    case ThreatType.TELECOM_OUTAGE: return PhoneOff;
    case ThreatType.INTERNET_DISRUPTION: return WifiOff;
    case ThreatType.FUEL_SHORTAGE: return Fuel;
    case ThreatType.SUPPLY_CHAIN_DISRUPTION: return Truck;

    // Space
    case ThreatType.SOLAR_RADIATION: return Sun;
    case ThreatType.SOLAR_FLARE: return Sun;
    case ThreatType.GEOMAGNETIC_STORM: return Magnet;
    case ThreatType.SPACE_WEATHER: return Rocket;

    // Travel
    case ThreatType.TRAVEL_ALERT: return Plane;
    case ThreatType.TRAVEL_RESTRICTION: return DoorClosed;
    case ThreatType.BORDER_CLOSURE: return DoorClosed;
    case ThreatType.EVACUATION_ORDER: return LogOut;
    case ThreatType.MARINE: return Anchor;
    case ThreatType.PORT_CLOSURE: return Anchor;
    case ThreatType.AIRSPACE_RESTRICTION: return Plane;

    // Governance
    case ThreatType.DISINFORMATION: return MessageSquareWarning;
    case ThreatType.MISINFORMATION: return MessageSquareWarning;
    case ThreatType.PROPAGANDA: return Megaphone;
    case ThreatType.STATE_OF_EMERGENCY: return Siren;
    case ThreatType.CURFEW: return Clock;
    case ThreatType.SANCTIONS: return Gavel;

    case 'USER_LOCATION': return MapPin;
    default: return AlertTriangle;
  }
};

export const createCustomIcon = (type: ThreatType | 'USER_LOCATION', severity: ThreatSeverity = ThreatSeverity.LOW) => {
  const IconComponent = getIconComponent(type);
  const color = type === 'USER_LOCATION' ? '#3b82f6' : SEVERITY_COLORS[severity];
  const size = type === 'USER_LOCATION' ? 32 : 24;
  
  // Create a pulsing effect for high/critical threats
  const isPulsing = severity === ThreatSeverity.CRITICAL || severity === ThreatSeverity.HIGH;

  const iconMarkup = renderToStaticMarkup(
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
       {isPulsing && (
         <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.4,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
         }}></div>
       )}
       <div style={{
          backgroundColor: '#1f2937', // gray-800 background for contrast
          borderRadius: '50%',
          padding: '4px',
          border: `2px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
       }}>
          <IconComponent size={size - 8} color={color} />
       </div>
    </div>
  );

  return divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon', // Use this class to strip default leaflet styles if needed
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};
