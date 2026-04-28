'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function CoachDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [planType, setPlanType] = useState('fat_loss');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [weeks, setWeeks] = useState(4);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await api.get('/coach/clients');
      setClients(data.clients);
    } catch (err) {
      console.error('Failed to load clients');
    }
    setLoading(false);
  };

  const handleAssignPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await api.post('/coach/assign-plan', {
        clientId: selectedClient._id,
        planType,
        difficulty,
        weeks,
      });
      alert('Plan Assigned Successfully to ' + selectedClient.name);
      setSelectedClient(null);
    } catch (err) {
      alert('Failed to assign plan');
    }
  };

  if (loading) return <div className="p-12 text-center">Loading Roster...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Client List */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Client Roster</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {clients.map(client => (
              <li key={client._id} className="p-4 hover:bg-gray-50 flex justify-between items-center cursor-pointer transition-colors" onClick={() => setSelectedClient(client)}>
                <div>
                  <p className="font-bold text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500 capitalize">Goal: {client.goal.replace('_', ' ')} • Level: {client.level}</p>
                </div>
                <div className="text-right">
                  {client.lastWorkout ? (
                    <p className="text-sm text-green-600 font-medium">Last active: {new Date(client.lastWorkout).toLocaleDateString()}</p>
                  ) : (
                    <p className="text-sm text-red-500 font-medium">Inactive</p>
                  )}
                  <button className="text-xs mt-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold hover:bg-indigo-200">
                    Assign Plan
                  </button>
                </div>
              </li>
            ))}
            {clients.length === 0 && <p className="p-6 text-gray-500 text-center">No clients assigned to you yet.</p>}
          </ul>
        </div>
      </div>

      {/* Plan Assigner */}
      <div className="md:w-1/2">
        {selectedClient ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 sticky top-6">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold text-indigo-900">Assign Program</h3>
                  <p className="text-sm text-indigo-600 font-semibold">{selectedClient.name}</p>
               </div>
               <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleAssignPlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Program Focus</label>
                <select className="mt-1 w-full border p-2 rounded-md" value={planType} onChange={(e) => setPlanType(e.target.value)}>
                  <option value="fat_loss">Fat Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="general_fitness">General Health</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Intensity / Level</label>
                <select className="mt-1 w-full border p-2 rounded-md" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite Athlete</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Weeks)</label>
                <input type="number" min="1" max="12" className="mt-1 w-full border p-2 rounded-md" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition mt-4">
                Execute & Push to Client
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center h-64">
            <p className="text-gray-500 font-medium">Select an athlete from your roster to assign a plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
