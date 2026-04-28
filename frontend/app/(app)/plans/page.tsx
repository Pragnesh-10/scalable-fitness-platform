'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Plans() {
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchActivePlan();
  }, []);

  const fetchActivePlan = async () => {
    try {
      const { data } = await api.get('/plans/active');
      setActivePlan(data.plan);
    } catch (err) {
      console.error('Failed to fetch plan');
    }
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/plans/generate', { duration_weeks: 4 });
      setActivePlan(data.plan);
    } catch (err) {
      console.error('Failed to generate plan');
    }
    setGenerating(false);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Plan...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Training Plan</h2>
          <p className="text-gray-500 mt-2">Personalized recommendations based on your fitness goals.</p>
        </div>
        <button 
          onClick={handleGeneratePlan} 
          disabled={generating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          {generating ? 'Generating AI Plan...' : activePlan ? 'Regenerate Plan' : 'Generate My First Plan'}
        </button>
      </div>

      {!activePlan ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-200">
           <span className="text-4xl">🤖</span>
           <h3 className="text-xl font-bold mt-4 text-gray-800">No Active Plan</h3>
           <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">Our recommendation engine uses your profile data (Age, Weight, Goals) to construct a 4-week tailored program.</p>
           <button onClick={handleGeneratePlan} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-2 px-6 rounded-lg transition">Generate Plan Now</button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 justify-between items-center">
             <div>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Goal Focus</p>
               <p className="text-2xl font-bold text-gray-900 capitalize">{activePlan.planType.replace('_', ' ')}</p>
             </div>
             <div>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Difficulty</p>
               <p className="text-2xl font-bold text-indigo-600 capitalize">{activePlan.difficulty}</p>
             </div>
             <div>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-wide">Duration</p>
               <p className="text-2xl font-bold text-gray-900">{activePlan.durationWeeks} Weeks</p>
             </div>
             <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold border border-green-200">
               Status: ACTIVE
             </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-3">Coach's Dietary & Recovery Rules</h3>
            <ul className="list-disc list-inside text-indigo-800 space-y-1 ml-2">
              {activePlan.recommendations?.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Weekly Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {Object.keys(activePlan.schedule || {}).map((weekKey) => (
                <div key={weekKey} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 capitalize">{weekKey.replace('_', ' ')}</h4>
                  <div className="space-y-3">
                    {activePlan.schedule[weekKey].map((day: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-semibold text-gray-700 w-24 inline-block">{day.day}</span>
                          <span className={`text-sm ${day.type === 'Rest' ? 'text-gray-400' : 'text-blue-600 font-medium'}`}>{day.type}</span>
                        </div>
                        {day.duration > 0 && <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">{day.duration} min</span>}
                      </div>
                    ))}
                  </div>
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
