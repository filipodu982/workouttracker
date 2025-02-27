// src/components/WorkoutHistory/WorkoutHistory.jsx
import React, { useState, useEffect } from 'react';
import { getUserWorkouts } from '../../supabase/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useWorkoutContext } from '../../context/WorkoutContext';

const WorkoutHistory = () => {
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const { currentUser } = useAuth();
  const { workouts, loading, error, refreshWorkouts } = useWorkoutContext();

  // Refresh workouts when component mounts
  useEffect(() => {
    refreshWorkouts();
  }, [refreshWorkouts]);

  const toggleWorkoutExpand = (workoutId) => {
    if (expandedWorkout === workoutId) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workoutId);
    }
  };

  // Calculate total volume for a workout
  const getWorkoutVolume = (workout) => {
    return workout.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
      return total + exerciseVolume;
    }, 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Workout History</h2>
      
      {workouts.length > 0 ? (
        <div>
          <div className="space-y-4">
            {workouts.map((workout) => {
              const workoutDate = workout.date ? 
                new Date(workout.date) : 
                new Date(workout.created_at);
              
              const isExpanded = expandedWorkout === workout.id;
              const totalVolume = getWorkoutVolume(workout);
              
              return (
                <div 
                  key={workout.id} 
                  className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={() => toggleWorkoutExpand(workout.id)}
                  >
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800">{workout.name}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(workoutDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Total Volume</div>
                        <div className="font-semibold text-gray-700">
                          {totalVolume.toLocaleString()} {workout.unit}
                        </div>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                      {workout.exercises.map((exercise, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          <div className="font-medium text-gray-700 mb-2">{exercise.name}</div>
                          <div className="grid grid-cols-3 text-sm font-medium text-gray-500 mb-1 px-2">
                            <div>Set</div>
                            <div>Weight</div>
                            <div>Reps</div>
                          </div>
                          <div className="space-y-1">
                            {exercise.sets.map((set, setIdx) => (
                              <div 
                                key={setIdx} 
                                className="grid grid-cols-3 text-sm bg-gray-50 p-2 rounded"
                              >
                                <div>Set {setIdx + 1}</div>
                                <div>{set.weight} {workout.unit}</div>
                                <div>{set.reps} reps</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="text-gray-500 mb-2">You haven't logged any workouts yet.</div>
          <p className="text-sm text-gray-400 mb-4">Go to the Workout Logger tab to log your first workout!</p>
          <svg 
            className="w-16 h-16 mx-auto text-gray-300 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;