'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Analytics {
  summary: { avgHR: number; totalSteps: number };
  dailyMetrics: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }

    api.get('/analytics/weekly')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Athlete'}</h1>
        <p className="text-gray-600 mt-2">Here is your performance snapshot for the week.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg Heart Rate</h3>
          <p className="text-3xl font-bold text-red-500">{Math.round(data?.summary?.avgHR || 0)} <span className="text-lg font-normal text-gray-400">bpm</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Steps</h3>
          <p className="text-3xl font-bold text-green-500">{(data?.summary?.totalSteps || 0).toLocaleString()} <span className="text-lg font-normal text-gray-400">steps</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Workouts Logged</h3>
          <p className="text-3xl font-bold text-blue-500">{data?.dailyMetrics?.length || 0} <span className="text-lg font-normal text-gray-400">sessions</span></p>
        </div>
      </div>

      {user?.role === 'coach' && (
        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md">
          <h3 className="text-lg font-medium text-indigo-800">Coach Dashboard Alert</h3>
          <p className="text-sm text-indigo-600 mt-1">You have 3 clients missing their workouts this week. <a href="/community" className="underline font-bold">Review their logs.</a></p>
        </div>
      )}
    </div>
  );
}
