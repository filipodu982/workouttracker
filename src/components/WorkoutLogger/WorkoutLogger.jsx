// src/components/WorkoutLogger/WorkoutLogger.jsx
import React from 'react';
import WorkoutForm from './WorkoutForm';
import { addWorkout, getUserWorkouts } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const WorkoutLogger = () => {
  const [error, setError] = React.useState(null);
  const { currentUser } = useAuth();

  const handleAddWorkout = async (workoutData) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to add a workout');
      }

      const userId = currentUser.uid;
      
      const newWorkout = {
        ...workoutData,
        userId
      };
      
      await addWorkout(newWorkout);
      
      return { success: true };
    } catch (err) {
      console.error('Error adding workout:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Workout Logger</h2>
      
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