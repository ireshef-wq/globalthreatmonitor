
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import LocationThreatCard from './components/LocationThreatCard';
import LocationManager from './components/LocationManager';
import RoutePlanner from './components/RoutePlanner';
import SensorStatus from './components/SensorStatus';
import SettingsPage from './components/SettingsPage';
import AuthModal from './components/AuthModal';
import { Threat, UserLocation, User, UserRole, AppSettings } from './types';
import { fetchGlobalThreats } from './services/threatService';
import { DEFAULT_SETTINGS, MOCK_SENSORS } from './constants';
import { LayoutDashboard, Map as MapIcon, Navigation, Activity, Sun, Moon, Settings, LogIn, LogOut, User as UserIcon } from 'lucide-react';

type Page = 'LOCATIONS' | 'MAP' | 'ROUTES' | 'SENSORS' | 'SETTINGS';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('LOCATIONS');
  const [threats, setThreats] = useState<Threat[]>([]);
  const [userLocations, setUserLocations] = useState<UserLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number }>({ lat: 20, lng: 0 });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // User & Settings State
  const [currentUser, setCurrentUser] = useState<User>({ id: 'guest', username: 'Guest', role: UserRole.GUEST });
  const [allUsers, setAllUsers] = useState<User[]>([{ id: 'guest', username: 'Guest', role: UserRole.GUEST }]); // Mock DB
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Theme Management
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Initial Data Fetch
  useEffect(() => {
    const loadThreats = async () => {
      const data = await fetchGlobalThreats();
      setThreats(data);
      setLastUpdated(new Date());
    };

    loadThreats();
    const interval = setInterval(loadThreats, 120000);
    return () => clearInterval(interval);
  }, []);

  // Persist User Locations
  useEffect(() => {
    const saved = localStorage.getItem('gtm_user_locations');
    if (saved) {
      setUserLocations(JSON.parse(saved));
    } else {
      setUserLocations([{
        id: 'default-1',
        name: 'San Francisco HQ',
        latitude: 37.7749,
        longitude: -122.4194,
        radiusKm: 500
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gtm_user_locations', JSON.stringify(userLocations));
  }, [userLocations]);

  const handleAddLocation = (newLocation: UserLocation) => {
    setUserLocations(prev => [...prev, newLocation]);
  };

  const handleDeleteLocation = (id: string) => {
    setUserLocations(prev => prev.filter(l => l.id !== id));
    if (selectedLocationId === id) setSelectedLocationId(null);
  };

  const handleSelectThreat = useCallback((threat: Threat) => {
    console.log("Selected threat:", threat.title);
  }, []);

  // Filter Threats based on Settings
  const filteredThreats = useMemo(() => {
    return threats.filter(t => {
      // 1. Check Threat Type
      if (settings.disabledThreatTypes.includes(t.type)) return false;
      
      // 2. Check Sensors (match source roughly to sensor ID via MOCK_SENSORS)
      // Ideally we would have a sensorId on the Threat object, but we'll try to match for this demo
      const relevantSensor = MOCK_SENSORS.find(s => t.source.includes(s.name) || s.provides.includes(t.type));
      if (relevantSensor && settings.disabledSensors.includes(relevantSensor.id)) {
        return false;
      }
      return true;
    });
  }, [threats, settings]);

  // Navigation Items
  const navItems = [
    { id: 'LOCATIONS', icon: LayoutDashboard, label: 'Locations' },
    { id: 'MAP', icon: MapIcon, label: 'Live Map' },
    { id: 'ROUTES', icon: Navigation, label: 'Route Risk' },
    { id: 'SENSORS', icon: Activity, label: 'Sensors' },
  ];

  // Auth Handlers
  const handleLogin = (role: UserRole, username: string) => {
    const newUser = { id: Math.random().toString(), username, role };
    setCurrentUser(newUser);
    // Add to mock DB if unique
    if (!allUsers.find(u => u.username === username)) {
      setAllUsers([...allUsers, newUser]);
    }
  };

  const handleLogout = () => {
    setCurrentUser({ id: 'guest', username: 'Guest', role: UserRole.GUEST });
    setActivePage('LOCATIONS');
  };

  const selectedLocation = userLocations.find(l => l.id === selectedLocationId);

  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden font-sans transition-colors duration-300">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />

      {/* Top Navigation Bar */}
      <header className="h-16 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 z-50 transition-colors duration-300">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => setActivePage('LOCATIONS')}>
             <Activity className="w-8 h-8 text-blue-600 dark:text-blue-500" />
             <span className="hidden md:block ml-3 font-bold text-lg tracking-wider text-gray-800 dark:text-gray-100">Global Threat <span className="text-blue-600 dark:text-blue-500">Monitor</span></span>
          </div>

          {/* Nav Items */}
          <nav className="flex items-center space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  activePage === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span className="hidden sm:block">{item.label}</span>
              </button>
            ))}
            {/* Settings Link (Admin Only) */}
            {currentUser.role === UserRole.ADMIN && (
               <button
               onClick={() => setActivePage('SETTINGS')}
               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                 activePage === 'SETTINGS' 
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
               }`}
             >
               <Settings size={18} />
               <span className="hidden sm:block">Settings</span>
             </button>
            )}
          </nav>
        </div>
        
        {/* Right Side Status */}
        <div className="flex items-center gap-4">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
             aria-label="Toggle Theme"
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>

           {/* User Profile / Auth */}
           <div className="flex items-center border-l border-gray-200 dark:border-gray-800 pl-4 ml-2">
             {currentUser.role === UserRole.GUEST ? (
               <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
               >
                 <LogIn size={18} /> Login
               </button>
             ) : (
               <div className="flex items-center gap-3">
                 <div className="text-right hidden md:block">
                   <div className="text-sm font-bold text-gray-900 dark:text-white">{currentUser.username}</div>
                   <div className="text-[10px] uppercase font-bold text-gray-500">{currentUser.role}</div>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                 >
                   <LogOut size={18} />
                 </button>
               </div>
             )}
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        
        {/* PAGE 1: LOCATIONS */}
        {activePage === 'LOCATIONS' && (
          <div className="h-full overflow-y-auto">
            <LocationManager 
              locations={userLocations} 
              onAddLocation={handleAddLocation} 
              onDeleteLocation={handleDeleteLocation} 
              onLocationSelect={(loc) => {
                setSelectedLocationId(loc.id);
                setActivePage('MAP');
              }}
              currentUser={currentUser}
            />
          </div>
        )}

        {/* PAGE 2: MAP */}
        {activePage === 'MAP' && (
          <div className="w-full h-full relative">
            <MapView 
              threats={filteredThreats}
              userLocations={userLocations}
              selectedLocationId={selectedLocationId}
              onMapCenterChange={(lat, lng) => setCurrentMapCenter({ lat, lng })}
              onSelectThreat={handleSelectThreat}
              isDarkMode={isDarkMode}
            />
            {/* Map Specific Left Overlay (Location List) */}
            <Sidebar 
              userLocations={userLocations}
              selectedLocationId={selectedLocationId}
              onSelectLocation={setSelectedLocationId}
              onDeleteLocation={handleDeleteLocation}
              threats={filteredThreats}
            />
            
            {/* Map Specific Right Overlay (Threat Intelligence Card) */}
            {selectedLocation && (
              <LocationThreatCard 
                location={selectedLocation}
                allThreats={filteredThreats}
                onClose={() => setSelectedLocationId(null)}
              />
            )}
          </div>
        )}

        {/* PAGE 3: ROUTES */}
        {activePage === 'ROUTES' && (
          <RoutePlanner locations={userLocations} threats={filteredThreats} />
        )}

        {/* PAGE 4: SENSORS */}
        {activePage === 'SENSORS' && (
          <div className="h-full overflow-y-auto">
            <SensorStatus settings={settings} />
          </div>
        )}

        {/* PAGE 5: SETTINGS */}
        {activePage === 'SETTINGS' && (
          <div className="h-full overflow-y-auto">
            <SettingsPage 
              currentUser={currentUser}
              users={allUsers}
              onAddUser={(u) => setAllUsers([...allUsers, u])}
              onDeleteUser={(id) => setAllUsers(allUsers.filter(u => u.id !== id))}
              settings={settings}
              onUpdateSettings={setSettings}
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
