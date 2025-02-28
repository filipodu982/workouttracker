// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import WorkoutLogger from '../WorkoutLogger/WorkoutLogger';
import WorkoutHistory from '../WorkoutHistory/WorkoutHistory';
import ExerciseLibrary from '../ExerciseLibrary/ExerciseLibrary';
import OneRepMaxCalculator from '../Calculators/OneRepMaxCalculator';
import WorkoutTemplates from '../WorkoutTemplates/WorkoutTemplates';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('workout');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { 
      id: 'workout', 
      label: 'Workout Logger', 
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' 
    },
    { 
      id: 'history', 
      label: 'Workout History', 
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      id: 'templates', 
      label: 'Templates', 
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' 
    },
    { 
      id: 'exercises', 
      label: 'Exercise Library', 
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' 
    },
    { 
      id: 'calculator', 
      label: '1RM Calculator', 
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' 
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-primary">Lift Logger</h1>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center py-3 px-4 font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {activeTab === 'workout' && <WorkoutLogger />}
          {activeTab === 'history' && <WorkoutHistory />}
          {activeTab === 'templates' && <WorkoutTemplates />}
          {activeTab === 'exercises' && <ExerciseLibrary />}
          {activeTab === 'calculator' && <OneRepMaxCalculator />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;