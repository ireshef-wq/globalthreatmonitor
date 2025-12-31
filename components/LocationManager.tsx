
import React, { useState } from 'react';
import { UserLocation, User, UserRole } from '../types';
import { resolveLocationFromInput } from '../services/geminiService';
import { Plus, Search, MapPin, Loader2, Globe, Lock } from 'lucide-react';

interface LocationManagerProps {
  locations: UserLocation[];
  onAddLocation: (loc: UserLocation) => void;
  onDeleteLocation: (id: string) => void;
  onLocationSelect: (loc: UserLocation) => void;
  currentUser: User;
}

const LocationManager: React.FC<LocationManagerProps> = ({ 
  locations, 
  onAddLocation, 
  onDeleteLocation,
  onLocationSelect,
  currentUser
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGuestLimitReached = currentUser.role === UserRole.GUEST && locations.length >= 2;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Double check
    if (isGuestLimitReached) return;

    setIsLoading(true);
    setError(null);

    const result = await resolveLocationFromInput(input);
    
    if (result) {
      const newLoc: UserLocation = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        name: result.name, // The AI translated name
        latitude: result.lat,
        longitude: result.lng,
        radiusKm: 200 // Default
      };
      onAddLocation(newLoc);
      setInput('');
    } else {
      setError("Could not find or translate location. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Globe className="text-blue-600 dark:text-blue-500" /> Location Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Add locations in any language. We'll translate them to English and coordinates automatically.</p>
        {currentUser.role === UserRole.GUEST && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">
            <Lock size={12} /> Guest Limit: {locations.length}/2 Locations
          </div>
        )}
      </div>

      {/* Add Form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 shadow-xl transition-colors duration-300">
        <form onSubmit={handleAdd} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isGuestLimitReached ? "Limit reached. Login to add more." : "Enter city (e.g., 東京, München, Paris)..."}
              disabled={isGuestLimitReached}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !input || isGuestLimitReached}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Plus />}
            Add Location
          </button>
        </form>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-3 ml-1">{error}</p>}
        {isGuestLimitReached && <p className="text-yellow-600 dark:text-yellow-500 text-xs mt-3 ml-1">Guest account limited to 2 locations. Please login to add more.</p>}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {locations.map(loc => (
           <div 
             key={loc.id} 
             onClick={() => onLocationSelect(loc)}
             className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer shadow-sm"
           >
             <div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <MapPin className="text-emerald-500" size={18} />
                 {loc.name}
               </h3>
               <div className="mt-2 space-y-1">
                 <p className="text-sm text-gray-500 dark:text-gray-400">Latitude: <span className="text-gray-700 dark:text-gray-200 font-mono">{loc.latitude.toFixed(4)}</span></p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Longitude: <span className="text-gray-700 dark:text-gray-200 font-mono">{loc.longitude.toFixed(4)}</span></p>
               </div>
             </div>
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 onDeleteLocation(loc.id);
               }}
               className="text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
             >
               Delete
             </button>
           </div>
         ))}
         {locations.length === 0 && (
           <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl">
             No locations added yet. Start by adding one above.
           </div>
         )}
      </div>
    </div>
  );
};

export default LocationManager;
