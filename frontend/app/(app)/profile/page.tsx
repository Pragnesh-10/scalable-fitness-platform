'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

type UserProfile = {
  _id?: string;
  name?: string;
  role?: string;
};

type DeviceConnection = {
  deviceType: string;
  accessToken?: string;
  connectedAt?: Date;
  isActive?: boolean;
  status?: string;
};

type ProfileData = {
  age?: number | string;
  weight?: number | string;
  height?: number | string;
  fitnessGoals?: string;
  experienceLevel?: string;
  deviceConnections?: DeviceConnection[];
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<ProfileData>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const WEARABLES = [
    { id: 'apple_health', name: 'Apple Health', icon: '🍎' },
    { id: 'google_fit', name: 'Google Fit', icon: '🏃' },
    { id: 'fitbit', name: 'Fitbit', icon: '⌚' },
    { id: 'garmin', name: 'Garmin', icon: '🗺️' }
  ];

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      setUser(data.user);
      setProfile(data.profile || { deviceConnections: [] });
    } catch (err) {
      console.error('Failed to load profile');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await api.put('/user/profile', {
        name: user.name,
        age: Number(profile.age) || undefined,
        weight: Number(profile.weight) || undefined,
        height: Number(profile.height) || undefined,
        fitnessGoals: profile.fitnessGoals,
        experienceLevel: profile.experienceLevel,
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Error updating profile');
    }
    setSaving(false);
  };

  const handleDeviceToggle = async (deviceId: string) => {
    const existingConnections = profile.deviceConnections || [];
    const isConnected = existingConnections.some((d: DeviceConnection) => d.deviceType === deviceId && d.isActive);
    
    let newConnections;
    if (isConnected) {
      newConnections = existingConnections.map((d: DeviceConnection) => 
        d.deviceType === deviceId ? { ...d, isActive: false } : d
      );
    } else {
      const exists = existingConnections.some((d: DeviceConnection) => d.deviceType === deviceId);
      if (exists) {
        newConnections = existingConnections.map((d: DeviceConnection) => 
          d.deviceType === deviceId ? { ...d, isActive: true } : d
        );
      } else {
        // BUG FIX: Don't use mock_token in production - require actual OAuth flow
        newConnections = [
           ...existingConnections, 
           { 
             deviceType: deviceId, 
             accessToken: `pending_auth_${deviceId}`, // Placeholder - requires OAuth
             connectedAt: new Date(), 
             isActive: true,
             status: 'awaiting_auth' // Track auth status
           }
        ];
      }
    }

    try {
      await api.put('/user/profile', { deviceConnections: newConnections });
      setProfile({ ...profile, deviceConnections: newConnections });
    } catch (err) {
      console.error('Failed to toggle device sync');
    }
  };

  if (!user) return <div className="p-12 text-center text-gray-500">Loading Profile...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Your Profile & Settings</h2>
        <p className="text-gray-500 mt-2">Manage your personal information and wearable devices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Personal Data</h3>
          {message && <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message}</div>}
          
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2" value={user.name || ''} onChange={(e) => setUser({...user, name: e.target.value})} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700">Age</label>
                 <input type="number" className="mt-1 w-full border border-gray-300 rounded-md p-2" value={profile.age || ''} onChange={(e) => setProfile({...profile, age: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                 <input type="number" className="mt-1 w-full border border-gray-300 rounded-md p-2" value={profile.weight || ''} onChange={(e) => setProfile({...profile, weight: e.target.value})} />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white" value={profile.fitnessGoals || 'general_fitness'} onChange={(e) => setProfile({...profile, fitnessGoals: e.target.value})}>
                <option value="general_fitness">General Fitness</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience Level</label>
              <select className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white" value={profile.experienceLevel || 'beginner'} onChange={(e) => setProfile({...profile, experienceLevel: e.target.value})}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button type="submit" disabled={saving} className="w-full bg-indigo-600 text-white font-medium py-2 rounded-md hover:bg-indigo-700 transition">
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Wearable Sync Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-xl font-bold mb-2 text-gray-800">Wearable Sync</h3>
           <p className="text-sm text-gray-500 mb-6">Connect your favorite devices to automatically log your metrics securely to your dashboard.</p>
           
           <div className="space-y-4">
             {WEARABLES.map(wearable => {
                const isActive = profile.deviceConnections?.some((d: DeviceConnection) => d.deviceType === wearable.id && d.isActive);
                
                return (
                  <div key={wearable.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${isActive ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{wearable.icon}</span>
                      <span className="font-semibold text-gray-700">{wearable.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeviceToggle(wearable.id)}
                      className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${isActive ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      {isActive ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                )
             })}
           </div>
        </div>
      </div>
    </div>
  );
}
