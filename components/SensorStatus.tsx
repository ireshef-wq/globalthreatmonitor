
import React from 'react';
import { AppSettings } from '../types';
import { MOCK_SENSORS } from '../constants';
import { Activity, Wifi, WifiOff, Clock, Server, Ban } from 'lucide-react';

interface SensorStatusProps {
  settings?: AppSettings;
}

const SensorStatus: React.FC<SensorStatusProps> = ({ settings }) => {
  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Server className="text-emerald-600 dark:text-emerald-500" /> Sensor Network Status
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time status of connected OSINT (Open Source Intelligence) data feeds.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xl transition-colors duration-300">
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div>Sensor Name</div>
          <div>Capabilities</div>
          <div>Status</div>
          <div className="text-right">Last Heartbeat</div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {MOCK_SENSORS.map(sensor => {
            const isDisabled = settings?.disabledSensors.includes(sensor.id);
            
            return (
            <div key={sensor.id} className={`grid grid-cols-[2fr_1.5fr_1fr_1.5fr] p-4 items-center transition-colors ${isDisabled ? 'bg-gray-50/50 dark:bg-gray-900/50 opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}>
              <div className="flex flex-col">
                <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                  {sensor.name}
                  {isDisabled && <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 font-bold uppercase">Disabled</span>}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">{sensor.type}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {sensor.provides.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {isDisabled ? (
                   <>
                    <Ban size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400">DISABLED</span>
                   </>
                ) : (
                  <>
                    {sensor.status === 'ONLINE' && <Wifi size={14} className="text-emerald-500" />}
                    {sensor.status === 'DEGRADED' && <Activity size={14} className="text-yellow-500" />}
                    {sensor.status === 'OFFLINE' && <WifiOff size={14} className="text-red-500" />}
                    <span className={`text-xs font-bold ${
                      sensor.status === 'ONLINE' ? 'text-emerald-600 dark:text-emerald-500' : 
                      sensor.status === 'DEGRADED' ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-600 dark:text-red-500'
                    }`}>
                      {sensor.status}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 text-gray-500 dark:text-gray-400 text-xs">
                <Clock size={12} />
                {new Date(sensor.lastUpdate).toLocaleString()}
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};

export default SensorStatus;
