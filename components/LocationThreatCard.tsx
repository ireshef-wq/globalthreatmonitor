
import React, { useState, useMemo } from 'react';
import { UserLocation, Threat, ThreatType, ThreatSeverity } from '../types';
import { generateThreatSummary } from '../services/geminiService';
import { ShieldAlert, Activity, CloudLightning, Waves, Flame, Biohazard, AlertTriangle, Globe, BrainCircuit, X, Radiation, Rocket, Anchor } from 'lucide-react';

interface LocationThreatCardProps {
  location: UserLocation;
  allThreats: Threat[];
  onClose: () => void;
}

const LocationThreatCard: React.FC<LocationThreatCardProps> = ({ location, allThreats, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  // Filter nearby threats
  const nearbyThreats = useMemo(() => {
    return allThreats.filter(t => {
      const R = 6371;
      const dLat = (t.latitude - location.latitude) * Math.PI / 180;
      const dLon = (t.longitude - location.longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(location.latitude * Math.PI / 180) * Math.cos(t.latitude * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return (R * c) <= location.radiusKm;
    });
  }, [location, allThreats]);

  // CATEGORY LOGIC
  const CATEGORIES = [
    { id: 'CONFLICT', label: 'Security & Conflict', icon: ShieldAlert }, 
    { id: 'UNREST', label: 'Civil & Social', icon: AlertTriangle }, 
    { id: 'WEATHER', label: 'Weather & Climate', icon: CloudLightning }, 
    { id: 'SEISMIC', label: 'Seismic & Geology', icon: Activity }, 
    { id: 'HEALTH', label: 'Health & Bio', icon: Biohazard }, 
    { id: 'INDUSTRIAL', label: 'Ind. & Infra', icon: Radiation }, 
    { id: 'WILDFIRE', label: 'Wildfire', icon: Flame }, 
    { id: 'SPACE', label: 'Space', icon: Rocket }, 
  ];

  const getThreatCategory = (t: Threat): string => {
    // Map the extensive list to the visual categories
    switch (t.type) {
      case ThreatType.CONFLICT:
      case ThreatType.ARMED_CONFLICT:
      case ThreatType.TERROR:
      case ThreatType.MILITARY_ACTIVITY:
      case ThreatType.DRONE_ATTACK:
      case ThreatType.CYBER_ATTACK:
      case ThreatType.PIRACY:
      case ThreatType.SABOTAGE:
        return 'CONFLICT';
      
      case ThreatType.CIVIL_UNREST:
      case ThreatType.PROTEST:
      case ThreatType.RIOT:
      case ThreatType.STRIKE:
      case ThreatType.POLITICAL_INSTABILITY:
      case ThreatType.ELECTION_UNREST:
      case ThreatType.MASS_GATHERING_RISK:
      case ThreatType.REFUGEE_MOVEMENT:
      case ThreatType.TRAVEL_ALERT:
      case ThreatType.TRAVEL_RESTRICTION:
      case ThreatType.BORDER_CLOSURE:
      case ThreatType.EVACUATION_ORDER:
      case ThreatType.DISINFORMATION:
      case ThreatType.MISINFORMATION:
      case ThreatType.PROPAGANDA:
      case ThreatType.STATE_OF_EMERGENCY:
      case ThreatType.CURFEW:
      case ThreatType.SANCTIONS:
        return 'UNREST';

      case ThreatType.EARTHQUAKE:
      case ThreatType.SEISMIC:
      case ThreatType.VOLCANIC:
      case ThreatType.TSUNAMI:
      case ThreatType.LANDSLIDE:
      case ThreatType.AVALANCHE:
        return 'SEISMIC';

      case ThreatType.WILDFIRE:
      case ThreatType.DROUGHT:
      case ThreatType.HEATWAVE:
      case ThreatType.DESERTIFICATION:
        return 'WILDFIRE';

      case ThreatType.FLOOD:
      case ThreatType.FLASH_FLOOD:
      case ThreatType.STORM:
      case ThreatType.EXTREME_WEATHER:
      case ThreatType.MARINE:
      case ThreatType.CLIMATE_ANOMALY:
      case ThreatType.AIR_POLLUTION:
      case ThreatType.WATER_CONTAMINATION:
      case ThreatType.TOXIC_RELEASE:
      case ThreatType.SEA_LEVEL_RISE:
      case ThreatType.PORT_CLOSURE:
      case ThreatType.AIRSPACE_RESTRICTION: // Often weather related
        return 'WEATHER';

      case ThreatType.INDUSTRIAL_ACCIDENT:
      case ThreatType.NUCLEAR_INCIDENT:
      case ThreatType.CHEMICAL_SPILL:
      case ThreatType.EXPLOSION:
      case ThreatType.GAS_LEAK:
      case ThreatType.DAM_FAILURE:
      case ThreatType.TRANSPORT_ACCIDENT:
      case ThreatType.AVIATION_INCIDENT:
      case ThreatType.MARITIME_ACCIDENT:
      case ThreatType.POWER_OUTAGE:
      case ThreatType.GRID_FAILURE:
      case ThreatType.WATER_SUPPLY_FAILURE:
      case ThreatType.TELECOM_OUTAGE:
      case ThreatType.INTERNET_DISRUPTION:
      case ThreatType.FUEL_SHORTAGE:
      case ThreatType.SUPPLY_CHAIN_DISRUPTION:
        return 'INDUSTRIAL';

      case ThreatType.HEALTH:
      case ThreatType.PANDEMIC:
      case ThreatType.EPIDEMIC:
      case ThreatType.DISEASE_OUTBREAK:
      case ThreatType.BIOLOGICAL_HAZARD:
      case ThreatType.FOODBORNE_ILLNESS:
        return 'HEALTH';
      
      case ThreatType.SOLAR_RADIATION:
      case ThreatType.SOLAR_FLARE:
      case ThreatType.GEOMAGNETIC_STORM:
      case ThreatType.SPACE_WEATHER:
        return 'SPACE';
        
      default:
        return 'OTHER';
    }
  };

  const categoryStatuses = useMemo(() => {
    const statusMap: Record<string, ThreatSeverity | 'SAFE'> = {};
    CATEGORIES.forEach(c => statusMap[c.id] = 'SAFE');
    nearbyThreats.forEach(t => {
      const catId = getThreatCategory(t);
      if (statusMap[catId]) {
        const currentStatus = statusMap[catId];
        const newStatus = t.severity;
        const severityWeight = { 'SAFE': 0, 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
        if (severityWeight[newStatus] > severityWeight[currentStatus]) {
          statusMap[catId] = newStatus;
        }
      }
    });
    return statusMap;
  }, [nearbyThreats]);

  // Calculate Consolidated Threat Score (0-100)
  const threatScore = useMemo(() => {
    if (nearbyThreats.length === 0) return 0;
    const severityBaseScores: Record<string, number> = {
      [ThreatSeverity.CRITICAL]: 75,
      [ThreatSeverity.HIGH]: 50,
      [ThreatSeverity.MEDIUM]: 25,
      [ThreatSeverity.LOW]: 10
    };
    let maxBaseScore = 0;
    nearbyThreats.forEach(t => {
      const s = severityBaseScores[t.severity] || 0;
      if (s > maxBaseScore) maxBaseScore = s;
    });
    const densityScore = Math.min(nearbyThreats.length * 5, 25);
    return Math.min(maxBaseScore + densityScore, 100);
  }, [nearbyThreats]);

  const getScoreStyle = (score: number) => {
    if (score >= 80) return { text: 'text-red-600 dark:text-red-500', border: 'border-red-500', bg: 'bg-red-100 dark:bg-red-500/10', label: 'CRITICAL' };
    if (score >= 50) return { text: 'text-orange-600 dark:text-orange-500', border: 'border-orange-500', bg: 'bg-orange-100 dark:bg-orange-500/10', label: 'HIGH' };
    if (score >= 25) return { text: 'text-yellow-600 dark:text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-500/10', label: 'ELEVATED' };
    return { text: 'text-emerald-600 dark:text-emerald-500', border: 'border-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10', label: 'NORMAL' };
  };

  const scoreStyle = getScoreStyle(threatScore);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const result = await generateThreatSummary(location, nearbyThreats);
    setSummary(result);
    setIsGenerating(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'CRITICAL': return { label: 'CRITICAL', color: 'text-red-600 dark:text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' };
      case 'HIGH': return { label: 'HIGH RISK', color: 'text-orange-600 dark:text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' };
      case 'MEDIUM': return { label: 'ELEVATED', color: 'text-yellow-600 dark:text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
      case 'LOW': return { label: 'LOW RISK', color: 'text-blue-600 dark:text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' };
      default: return { label: 'SAFE', color: 'text-gray-500 dark:text-gray-500', bg: 'bg-transparent' };
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[400] w-[26rem] max-h-[calc(100vh-6rem)] flex flex-col pointer-events-none">
      <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto h-full transition-colors duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shrink-0">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">{location.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <Globe size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 ${scoreStyle.border} ${scoreStyle.bg} shadow-lg dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
               <span className={`text-2xl font-black ${scoreStyle.text}`}>{threatScore}</span>
             </div>
             <div className="flex flex-col">
               <span className={`text-sm font-bold ${scoreStyle.text} uppercase tracking-wider`}>{scoreStyle.label} RISK</span>
               <span className="text-[10px] text-gray-500">
                 Combined Score (0-100)<br/>
                 Radius: {location.radiusKm}km
               </span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* AI Section */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-purple-600 dark:text-purple-500" size={16} />
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Intelligence</span>
              </div>
              {!summary && (
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="text-[10px] bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Analyzing...' : 'Generate Report'}
                </button>
              )}
            </div>
            
            {summary && (
              <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800/80 p-3 rounded-lg border border-gray-200 dark:border-gray-700/50 animate-in fade-in duration-500 shadow-sm dark:shadow-inner">
                {summary}
              </div>
            )}
          </div>

          {/* Category Status List */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900/50">
            {CATEGORIES.map(cat => {
              const status = categoryStatuses[cat.id];
              const display = getStatusDisplay(status);
              const isActive = status !== 'SAFE';
              
              return (
                <div key={cat.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${isActive ? 'bg-white dark:bg-gray-800' : 'bg-transparent'}`}>
                       <cat.icon size={16} className={isActive ? display.color : 'text-gray-400 dark:text-gray-600'} />
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>{cat.label}</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${display.bg} ${display.color} tracking-wider`}>
                    {display.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Feed */}
          <div className="p-0">
             <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/30 text-[10px] uppercase font-bold text-gray-500 dark:text-gray-500 tracking-wider backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
               Active Threat Feed
             </div>
             
             {nearbyThreats.length === 0 ? (
               <div className="p-6 text-center">
                 <p className="text-gray-500 dark:text-gray-600 text-xs italic">No active threats reported in this sector.</p>
               </div>
             ) : (
               <div className="divide-y divide-gray-200 dark:divide-gray-800/50">
                 {nearbyThreats.map(threat => (
                   <div key={threat.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          threat.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-900/50' : 
                          threat.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-900/50' :
                          threat.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-900/50' : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-900/50'
                        }`}>
                          {threat.severity}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-600">{new Date(threat.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {threat.title}
                      </h3>
                      <p className="text-[10px] text-gray-600 dark:text-gray-500 line-clamp-2">
                        {threat.description}
                      </p>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationThreatCard;
