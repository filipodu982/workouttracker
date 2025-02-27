import React, { useState } from 'react';
import { useWorkoutContext } from '../../context/WorkoutContext';

const WorkoutHistory = () => {
  const { workouts, loading, error, deleteWorkoutFromState } = useWorkoutContext();
  const [expandedWorkoutId, setExpandedWorkoutId] = useState(null);
  const [deletingWorkoutId, setDeletingWorkoutId] = useState(null);

  const toggleWorkoutExpand = (workoutId) => {
    setExpandedWorkoutId(expandedWorkoutId === workoutId ? null : workoutId);
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      setDeletingWorkoutId(workoutId);
      await deleteWorkoutFromState(workoutId);
    } catch (err) {
      console.error('Failed to delete workout', err);
      // Optional: Add error handling UI
    } finally {
      setDeletingWorkoutId(null);
    }
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
                className="p-4 flex justify-between items-center"
              >
                <div onClick={() => toggleWorkoutExpand(workout.id)} className="flex-1 cursor-pointer">
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
                  <button
                    onClick={() => handleDeleteWorkout(workout.id)}
                    disabled={deletingWorkoutId === workout.id}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="Delete Workout"
                  >
                    {deletingWorkoutId === workout.id ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                  <svg 
                    onClick={() => toggleWorkoutExpand(workout.id)}
                    className={`w-5 h-5 text-gray-500 transition-transform cursor-pointer ${
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