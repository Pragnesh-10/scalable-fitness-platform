'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

type Client = {
  _id: string;
  name: string;
  goal: string;
  level: string;
  lastWorkout?: string;
};

export default function CoachDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [planType, setPlanType] = useState('fat_loss');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [weeks, setWeeks] = useState(4);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  const fetchClients = async () => {
    try {
      setError('');
      const { data } = await api.get('/coach/clients');
      setClients(data.clients || []);
    } catch (err: unknown) {
      const maybeErr = err as { response?: { data?: { error?: string } } };
      const errMsg = maybeErr.response?.data?.error || 'Failed to load clients';
      setError(errMsg);
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClients();
  }, []);

  const handleAssignPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    
    setAssigning(true);
    setAssignError('');
    setAssignSuccess('');
    
    try {
      await api.post('/coach/assign-plan', {
        clientId: selectedClient._id,
        planType,
        difficulty,
        weeks,
      });
      setAssignSuccess(`✅ Plan assigned to ${selectedClient.name}!`);
      setSelectedClient(null);
      setPlanType('fat_loss');
      setDifficulty('intermediate');
      setWeeks(4);
      
      // Refresh client list to show updated status
      await fetchClients();
    } catch (err: unknown) {
      const maybeErr = err as { response?: { data?: { error?: string } } };
      const errMsg = maybeErr.response?.data?.error || 'Failed to assign plan';
      setAssignError(errMsg);
      console.error('Failed to assign plan:', err);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return (
    <div className="p-12 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-gray-500">Loading Your Client Roster...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Error Alert */}
      {error && (
        <div className="col-span-full bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-4">
          ⚠️ {error}
        </div>
      )}

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
            
            {assignError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                ⚠️ {assignError}
              </div>
            )}
            
            {assignSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {assignSuccess}
              </div>
            )}
            
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

              <button 
                type="submit" 
                disabled={assigning}
                className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {assigning ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Assigning...
                  </>
                ) : (
                  'Execute & Push to Client'
                )}
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
