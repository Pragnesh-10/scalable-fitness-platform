'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

type LeaderboardUser = { _id: string; name: string; workoutCount: number; totalCalories: number };
type Challenge = {
  _id: string;
  challengeName: string;
  description?: string;
  goalValue?: number;
  goalType?: string;
  participant_count?: number;
  endDate: string;
  is_joined?: boolean;
};

export default function Community() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leaderboard') {
        const { data } = await api.get('/community/leaderboard');
        setLeaderboard(data.leaderboard || []);
      } else {
        const { data } = await api.get('/community/challenges');
        setChallenges(data.challenges || []);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [activeTab]);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await api.post(`/community/challenges/${challengeId}/join`);
      fetchData(); // Refresh to show "Joined"
    } catch (error) {
      console.error('Failed to join challenge', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Community Hub</h2>

      <div className="flex space-x-4 border-b border-gray-200 mb-6">
        <button 
          className={`pb-2 px-4 font-medium ${activeTab === 'leaderboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          Global Leaderboard
        </button>
        <button 
          className={`pb-2 px-4 font-medium ${activeTab === 'challenges' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('challenges')}
        >
          Challenges
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : activeTab === 'leaderboard' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
             <h3 className="text-lg font-semibold text-indigo-900">Top Athletes (Last 30 Days)</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {leaderboard.map((user, index: number) => (
              <li key={user._id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-gray-200 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600">{user.workoutCount} <span className="text-sm font-normal text-gray-500">workouts</span></p>
                  <p className="text-sm text-gray-500">{user.totalCalories} kcal</p>
                </div>
              </li>
            ))}
            {leaderboard.length === 0 && <p className="p-6 text-center text-gray-500">No data available for the leaderboard yet.</p>}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div key={challenge._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{challenge.challengeName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{challenge.description || `Goal: ${challenge.goalValue} ${challenge.goalType}`}</p>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {challenge.participant_count || 0} Joined
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-6 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Ends {new Date(challenge.endDate).toLocaleDateString()}
              </div>
              
              {challenge.is_joined ? (
                <button disabled className="w-full bg-gray-100 text-gray-500 font-medium py-2 px-4 rounded-lg border border-gray-200 cursor-not-allowed">
                  Participant Joined
                </button>
              ) : (
                <button 
                  onClick={() => handleJoinChallenge(challenge._id)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors border border-transparent"
                >
                  Join Challenge
                </button>
              )}
            </div>
          ))}
          {challenges.length === 0 && (
             <div className="col-span-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500">
               No active challenges available right now. Check back later!
             </div>
          )}
        </div>
      )}
    </div>
  );
}
