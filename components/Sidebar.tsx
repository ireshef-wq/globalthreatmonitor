
import React from 'react';
import { UserLocation, Threat } from '../types';
import { MapPin, Navigation, ChevronDown } from 'lucide-react';

interface SidebarProps {
  userLocations: UserLocation[];
  selectedLocationId: string | null;
  onSelectLocation: (id: string) => void;
  onDeleteLocation: (id: string) => void;
  threats: Threat[];
}

const Sidebar: React.FC<SidebarProps> = ({
  userLocations,
  selectedLocationId,
  onSelectLocation,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      onSelectLocation(e.target.value);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] w-full max-w-md pointer-events-none flex justify-center">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-full shadow-2xl p-1.5 pointer-events-auto flex items-center gap-3 pr-4 animate-in slide-in-from-top-4 duration-500 transition-colors duration-300">
        
        <div className="flex items-center gap-2 pl-3 border-r border-gray-200 dark:border-gray-700 pr-3">
           <Navigation className="text-blue-600 dark:text-blue-500 w-4 h-4" />
           <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap">Quick Access</span>
        </div>

        <div className="relative group w-64">
          <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none" size={16} />
          <select 
            value={selectedLocationId || ''} 
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white appearance-none outline-none pl-6 cursor-pointer"
          >
            <option value="" disabled>Select a monitored location...</option>
            {userLocations.map(loc => (
              <option key={loc.id} value={loc.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
                {loc.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
