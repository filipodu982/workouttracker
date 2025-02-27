import React, { useState } from 'react';
import { useWorkoutContext } from '../../context/WorkoutContext';

const WorkoutHistory = () => {
  const { workouts, loading, error } = useWorkoutContext();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);

  const toggleWorkoutExpand = (workoutId) => {
    setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId);
  };

  const calculateWorkoutVolume = (workout) => {
    return workout.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight * set.reps);
      }, 0);
      return total + exerciseVolume;
    }, 0);
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
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div 
              key={workout.id} 
              className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
            >
              <div 
                onClick={() => toggleWorkoutExpand(workout.id)}
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold">{workout.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Total Volume</div>
                    <div className="font-semibold text-gray-700">
                      {calculateWorkoutVolume(workout).toLocaleString()} {workout.unit}
                    </div>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedWorkoutId === workout.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedWorkoutId === workout.id && (
                <div className="p-4 border-t border-gray-100">
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
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow-sm">
          No workouts found
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;