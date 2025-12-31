
import React, { useState } from 'react';
import { User, UserRole, AppSettings, ThreatType } from '../types';
import { MOCK_SENSORS, THREAT_GROUPS } from '../constants';
import { Users, Shield, Server, Trash2, Plus, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingsPageProps {
  currentUser: User;
  users: User[];
  onAddUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  settings: AppSettings;
  onUpdateSettings: (s: AppSettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  currentUser, users, onAddUser, onDeleteUser, settings, onUpdateSettings 
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'THREATS' | 'SENSORS'>('USERS');
  
  // New user form state
  const [newUser, setNewUser] = useState({ username: '', role: UserRole.VIEWER });

  if (currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-center">
        <Shield size={64} className="text-gray-300 dark:text-gray-700 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-500">You do not have permission to view system settings.</p>
      </div>
    );
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username.trim()) return;
    onAddUser({
      id: Math.random().toString(36).substr(2, 9),
      username: newUser.username,
      role: newUser.role
    });
    setNewUser({ username: '', role: UserRole.VIEWER });
  };

  const toggleThreat = (type: ThreatType) => {
    const current = settings.disabledThreatTypes;
    const next = current.includes(type) 
      ? current.filter(t => t !== type)
      : [...current, type];
    onUpdateSettings({ ...settings, disabledThreatTypes: next });
  };

  const toggleSensor = (id: string) => {
    const current = settings.disabledSensors;
    const next = current.includes(id)
      ? current.filter(s => s !== id)
      : [...current, id];
    onUpdateSettings({ ...settings, disabledSensors: next });
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto h-full overflow-hidden flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">System Configuration</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage access controls and global monitoring parameters.</p>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'USERS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Users size={18} /> User Management
          </button>
          <button 
            onClick={() => setActiveTab('THREATS')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'THREATS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Shield size={18} /> Threat Types
          </button>
          <button 
            onClick={() => setActiveTab('SENSORS')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'SENSORS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Server size={18} /> Sensors & Feeds
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          
          {/* USERS TAB */}
          {activeTab === 'USERS' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Add New User</h3>
                <form onSubmit={handleCreateUser} className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    value={newUser.username}
                    onChange={e => setNewUser({...newUser, username: e.target.value})}
                    className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  />
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                    className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value={UserRole.VIEWER}>Viewer</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Add
                  </button>
                </form>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Existing Users</h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3">Username</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map(u => (
                        <tr key={u.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{u.username} {currentUser.id === u.id && '(You)'}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === UserRole.ADMIN ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 
                              u.role === UserRole.VIEWER ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            {u.role !== UserRole.GUEST && u.id !== currentUser.id && (
                              <button onClick={() => onDeleteUser(u.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* THREATS TAB */}
          {activeTab === 'THREATS' && (
            <div className="space-y-8">
              {Object.entries(THREAT_GROUPS).map(([groupName, groupTypes]) => (
                <div key={groupName} className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-2">{groupName}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {groupTypes.map(type => {
                      const isDisabled = settings.disabledThreatTypes.includes(type);
                      return (
                        <div key={type} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isDisabled 
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400' 
                          : 'border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 text-gray-900 dark:text-white'
                        }`}>
                          <div className="flex items-center gap-3">
                            <AlertCircle size={18} className={isDisabled ? 'text-gray-400' : 'text-blue-500'} />
                            <span className="font-medium text-sm">{type.replace(/_/g, ' ')}</span>
                          </div>
                          <button onClick={() => toggleThreat(type)} className={`transition-colors ${isDisabled ? 'text-gray-400' : 'text-blue-600'}`}>
                            {isDisabled ? <ToggleLeft size={28} /> : <ToggleRight size={28} />}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SENSORS TAB */}
          {activeTab === 'SENSORS' && (
            <div className="space-y-4">
              {MOCK_SENSORS.map(sensor => {
                const isDisabled = settings.disabledSensors.includes(sensor.id);
                return (
                  <div key={sensor.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isDisabled 
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400' 
                    : 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/10 text-gray-900 dark:text-white'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 font-medium">
                        <Server size={16} className={isDisabled ? 'text-gray-400' : 'text-emerald-500'} />
                        {sensor.name}
                      </div>
                      <div className="text-xs mt-1 opacity-70">Provides: {sensor.provides.join(', ')}</div>
                    </div>
                    <button onClick={() => toggleSensor(sensor.id)} className={`transition-colors ${isDisabled ? 'text-gray-400' : 'text-emerald-600'}`}>
                      {isDisabled ? <ToggleLeft size={32} /> : <ToggleRight size={32} />}
                    </button>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
