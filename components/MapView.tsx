
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Threat, UserLocation } from '../types';
import { MAP_TILE_LAYER_URL_DARK, MAP_TILE_LAYER_URL_LIGHT, MAP_ATTRIBUTION, DEFAULT_CENTER, DEFAULT_ZOOM, SEVERITY_COLORS } from '../constants';
import { createCustomIcon } from './MapThreatIcon';

interface MapViewProps {
  threats: Threat[];
  userLocations: UserLocation[];
  selectedLocationId: string | null;
  onMapCenterChange: (lat: number, lng: number) => void;
  onSelectThreat: (threat: Threat) => void;
  isDarkMode: boolean;
}

// Component to handle map movements and expose center
const MapController: React.FC<{ onCenterChange: (lat: number, lng: number) => void }> = ({ onCenterChange }) => {
  const map = useMap();
  
  useEffect(() => {
    // Initial center
    const center = map.getCenter();
    onCenterChange(center.lat, center.lng);

    const onMove = () => {
      const c = map.getCenter();
      onCenterChange(c.lat, c.lng);
    };
    
    map.on('moveend', onMove);
    return () => {
      map.off('moveend', onMove);
    };
  }, [map, onCenterChange]);

  return null;
};

// Component to fly to selected location
const LocationFlyTo: React.FC<{ location?: UserLocation }> = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 6, { duration: 1.5 });
    }
  }, [location, map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  threats, 
  userLocations, 
  selectedLocationId, 
  onMapCenterChange,
  onSelectThreat,
  isDarkMode
}) => {
  const selectedLocation = userLocations.find(l => l.id === selectedLocationId);

  return (
    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
      <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={DEFAULT_ZOOM} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution={MAP_ATTRIBUTION}
          url={isDarkMode ? MAP_TILE_LAYER_URL_DARK : MAP_TILE_LAYER_URL_LIGHT}
        />
        
        <MapController onCenterChange={onMapCenterChange} />
        {selectedLocation && <LocationFlyTo location={selectedLocation} />}

        {/* Threat Markers */}
        {threats.map(threat => (
          <Marker
            key={threat.id}
            position={[threat.latitude, threat.longitude]}
            icon={createCustomIcon(threat.type, threat.severity)}
            eventHandlers={{
              click: () => onSelectThreat(threat)
            }}
          >
            <Popup className="custom-popup">
              <div className="text-gray-900 p-1">
                <strong className="block text-sm mb-1">{threat.title}</strong>
                <span className="text-xs text-gray-600 block">{new Date(threat.timestamp).toLocaleString()}</span>
                <p className="text-xs mt-2">{threat.description}</p>
                <div className="mt-2 text-xs font-bold px-2 py-1 bg-gray-200 rounded inline-block">
                  Source: {threat.source}
                </div>
              </div>
            </Popup>
            {/* Show radius circle for High/Critical threats */}
            {(threat.severity === 'HIGH' || threat.severity === 'CRITICAL') && threat.radiusKm && (
               <Circle 
                 center={[threat.latitude, threat.longitude]}
                 radius={threat.radiusKm * 1000}
                 pathOptions={{ 
                   color: SEVERITY_COLORS[threat.severity], 
                   fillColor: SEVERITY_COLORS[threat.severity], 
                   fillOpacity: 0.1,
                   weight: 1
                 }}
               />
            )}
          </Marker>
        ))}

        {/* User Location Markers */}
        {userLocations.map(loc => (
          <React.Fragment key={loc.id}>
            <Marker
              position={[loc.latitude, loc.longitude]}
              icon={createCustomIcon('USER_LOCATION')}
            >
              <Popup>
                <div className="text-center font-bold">{loc.name}</div>
              </Popup>
            </Marker>
            {/* Monitoring Radius */}
            <Circle 
              center={[loc.latitude, loc.longitude]}
              radius={loc.radiusKm * 1000}
              pathOptions={{ 
                color: '#3b82f6', 
                fillColor: '#3b82f6', 
                fillOpacity: 0.05, 
                dashArray: '5, 10',
                weight: 2
              }}
            />
          </React.Fragment>
        ))}

      </MapContainer>
    </div>
  );
};

export default MapView;
