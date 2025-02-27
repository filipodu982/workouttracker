// src/context/WorkoutContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getUserWorkouts, deleteWorkout } from '../supabase/firestoreService';

const WorkoutContext = createContext();

export const useWorkoutContext = () => useContext(WorkoutContext);

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!currentUser) {
        setWorkouts([]);
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        console.log('Fetching workouts for user:', currentUser);
        const fetchedWorkouts = await getUserWorkouts(currentUser.id);
        console.log('Fetched workouts:', fetchedWorkouts);
        setWorkouts(fetchedWorkouts);
        setError(null);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchWorkouts();
  }, [currentUser]);

  // Add workout to state
  const addWorkoutToState = (workout) => {
    setWorkouts(prevWorkouts => [workout, ...prevWorkouts]);
  };

  // Update workout in state
  const updateWorkoutInState = (id, updatedData) => {
    setWorkouts(prevWorkouts =>
      prevWorkouts.map(workout =>
        workout.id === id ? { ...workout, ...updatedData } : workout
      )
    );
  };

  // Remove workout from state
  const removeWorkoutFromState = (id) => {
    setWorkouts(prevWorkouts => 
      prevWorkouts.filter(workout => workout.id !== id)
    );
  };

  // Refresh workouts from database
  const refreshWorkouts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const fetchedWorkouts = await getUserWorkouts(currentUser.id);
      setWorkouts(fetchedWorkouts);
      setError(null);
    } catch (err) {
      console.error('Error refreshing workouts:', err);
      setError('Failed to refresh workouts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkoutFromState = async (id) => {
    try {
      await deleteWorkout(id);
      setWorkouts(prevWorkouts => 
        prevWorkouts.filter(workout => workout.id !== id)
      );
    } catch (err) {
      console.error('Error deleting workout:', err);
      throw err;
    }
  };

  const value = {
    workouts,
    loading,
    error,
    addWorkoutToState,
    updateWorkoutInState,
    removeWorkoutFromState,
    deleteWorkoutFromState,
    refreshWorkouts
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;