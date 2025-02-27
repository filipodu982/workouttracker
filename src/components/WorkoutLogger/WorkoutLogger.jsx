// src/components/WorkoutLogger/WorkoutLogger.jsx
import React, { useState } from 'react';
import WorkoutForm from './WorkoutForm';
import { addWorkout } from '../../supabase/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useWorkoutContext } from '../../context/WorkoutContext';

const WorkoutLogger = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();
  const { addWorkoutToState } = useWorkoutContext();

  const handleAddWorkout = async (workoutData) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add a workout');
      }

      const newWorkout = {
        ...workoutData,
        userId: currentUser.id
      };
      
      // Add workout to database
      const savedWorkout = await addWorkout(newWorkout);
      
      // Update workout context
      addWorkoutToState(savedWorkout);

      // Show success message
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      return { success: true, workout: savedWorkout };
    } catch (err) {
      console.error('Error adding workout:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Workout Logger</h2>
      
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Workout logged successfully!
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <WorkoutForm onSubmit={handleAddWorkout} />
      </div>
    </div>
  );
};

export default WorkoutLogger;