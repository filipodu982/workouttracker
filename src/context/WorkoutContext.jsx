// src/context/WorkoutContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

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
        // Get workouts from localStorage
        const allWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const userWorkouts = allWorkouts.filter(
          workout => workout.userId === currentUser.uid
        );
        setWorkouts(userWorkouts);
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

  // Add workout to context and localStorage
  const addWorkoutToState = (workout) => {
    // Add to state
    setWorkouts(prevWorkouts => [workout, ...prevWorkouts]);
    
    // Add to localStorage
    const allWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    allWorkouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(allWorkouts));
  };

  // Update workout in context and localStorage
  const updateWorkoutInState = (id, updatedData) => {
    // Update in state
    setWorkouts(prevWorkouts =>
      prevWorkouts.map(workout =>
        workout.id === id ? { ...workout, ...updatedData } : workout
      )
    );
    
    // Update in localStorage
    const allWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const updatedWorkouts = allWorkouts.map(workout =>
      workout.id === id ? { ...workout, ...updatedData } : workout
    );
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  // Remove workout from context and localStorage
  const removeWorkoutFromState = (id) => {
    // Remove from state
    setWorkouts(prevWorkouts => 
      prevWorkouts.filter(workout => workout.id !== id)
    );
    
    // Remove from localStorage
    const allWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const updatedWorkouts = allWorkouts.filter(workout => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  // Refresh workouts from localStorage
  const refreshWorkouts = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const allWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      const userWorkouts = allWorkouts.filter(
        workout => workout.userId === currentUser.uid
      );
      setWorkouts(userWorkouts);
      setError(null);
    } catch (err) {
      console.error('Error refreshing workouts:', err);
      setError('Failed to refresh workouts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    workouts,
    loading,
    error,
    addWorkoutToState,
    updateWorkoutInState,
    removeWorkoutFromState,
    refreshWorkouts
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutContext;