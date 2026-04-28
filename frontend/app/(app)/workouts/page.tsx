'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const fetchWorkouts = async () => {
    try {
      const { data } = await api.get('/workouts');
      setWorkouts(data.workouts);
    } catch (err) {
      console.error('Failed to fetch workouts');
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/workouts', {
        title,
        type,
        duration: Number(duration),
        caloriesBurned: Number(calories),
      });
      setTitle(''); setDuration(''); setCalories('');
      fetchWorkouts();
    } catch (err) {
      console.error('Failed to add workout');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Workouts</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Log new workout</h3>
        <form onSubmit={handleAddWorkout} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Workout Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <select className="border p-2 rounded" value={type} onChange={e => setType(e.target.value)}>
            <option value="running">Running</option>
            <option value="cycling">Cycling</option>
            <option value="strength">Strength</option>
            <option value="yoga">Yoga</option>
            <option value="hiit">HIIT</option>
          </select>
          <input className="border p-2 rounded" type="number" placeholder="Duration (min)" value={duration} onChange={e => setDuration(e.target.value)} required />
          <input className="border p-2 rounded" type="number" placeholder="Calories Burned" value={calories} onChange={e => setCalories(e.target.value)} />
          <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium md:col-span-2">
            Save Workout
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {workouts.map((workout: any) => (
             <li key={workout._id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
               <div>
                 <p className="font-semibold text-gray-800 text-lg">{workout.title || 'Untitled Workout'}</p>
                 <p className="text-sm text-gray-500 capitalize">{workout.type} • {new Date(workout.date).toLocaleDateString()}</p>
               </div>
               <div className="text-right">
                 <p className="text-blue-600 font-bold">{workout.duration} min</p>
                 {workout.caloriesBurned && <p className="text-sm text-orange-500">{workout.caloriesBurned} kcal</p>}
               </div>
             </li>
          ))}
          {workouts.length === 0 && <p className="p-6 text-center text-gray-500">No workouts logged yet.</p>}
        </ul>
      </div>
    </div>
  );
}
