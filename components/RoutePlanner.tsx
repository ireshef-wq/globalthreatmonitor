
import React, { useState } from 'react';
import { UserLocation, Threat, RouteAnalysis } from '../types';
import { analyzeRouteRisk } from '../services/geminiService';
import { Navigation, AlertTriangle, ArrowRight, Loader2, CheckCircle, Map } from 'lucide-react';

interface RoutePlannerProps {
  locations: UserLocation[];
  threats: Threat[];
}

const RoutePlanner: React.FC<RoutePlannerProps> = ({ locations, threats }) => {
  const [startId, setStartId] = useState('');
  const [endId, setEndId] = useState('');
  const [analysis, setAnalysis] = useState<RouteAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    const start = locations.find(l => l.id === startId);
    const end = locations.find(l => l.id === endId);
    if (!start || !end) return;

    setIsLoading(true);
    setAnalysis(null);
    const result = await analyzeRouteRisk(start, end, threats);
    setAnalysis(result);
    setIsLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 dark:text-red-500 border-red-500 bg-red-100 dark:bg-red-900/20';
      case 'HIGH': return 'text-orange-600 dark:text-orange-500 border-orange-500 bg-orange-100 dark:bg-orange-900/20';
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-500 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-green-600 dark:text-green-500 border-green-500 bg-green-100 dark:bg-green-900/20';
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
       <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Navigation className="text-purple-600 dark:text-purple-500" /> Route Intelligence
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Calculate risk exposure between two secured locations and discover safe alternatives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl mb-8 transition-colors duration-300">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Origin</label>
          <select 
            value={startId} 
            onChange={(e) => setStartId(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
          >
            <option value="">Select Origin...</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>

        <div className="flex justify-center pb-3 text-gray-400 dark:text-gray-500">
          <ArrowRight />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Destination</label>
          <select 
            value={endId} 
            onChange={(e) => setEndId(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
          >
            <option value="">Select Destination...</option>
            {locations.filter(l => l.id !== startId).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!startId || !endId || isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-3 mb-8"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Map />}
        {isLoading ? 'Analyzing Satellite Data...' : 'Calculate Route Risk'}
      </button>

      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-6 rounded-2xl border-2 ${getRiskColor(analysis.riskLevel)} flex items-center justify-between`}>
             <div>
               <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest">Estimated Risk Level</h3>
               <p className="text-4xl font-black mt-1">{analysis.riskLevel}</p>
             </div>
             <AlertTriangle size={48} className="opacity-80" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-600 dark:text-yellow-500" />
                Risk Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {analysis.summary}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-500" />
                Alternative Routes
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {analysis.alternatives}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutePlanner;
