import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserWorkoutTemplates,
  deleteWorkoutTemplate
} from '../supabase/firestoreService';

const WorkoutTemplateContext = createContext();

export const useWorkoutTemplateContext = () => useContext(WorkoutTemplateContext);

export const WorkoutTemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!currentUser) {
        setTemplates([]);
        setLoading(false);
        return;
      }
  
      try {
        setLoading(true);
        const fetchedTemplates = await getUserWorkoutTemplates(currentUser.id);
        setTemplates(fetchedTemplates);
        setError(null);
      } catch (err) {
        console.error('Error fetching workout templates:', err);
        setError('Failed to load workout templates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTemplates();
  }, [currentUser]);

  // Add template to state
  const addTemplateToState = (template) => {
    setTemplates(prevTemplates => [template, ...prevTemplates]);
  };

  // Update template in state
  const updateTemplateInState = (id, updatedData) => {
    setTemplates(prevTemplates =>
      prevTemplates.map(template =>
        template.id === id ? { ...template, ...updatedData } : template
      )
    );
  };

  // Remove template from state
  const removeTemplateFromState = (id) => {
    setTemplates(prevTemplates => 
      prevTemplates.filter(template => template.id !== id)
    );
  };

  // Delete template from database and state
  const deleteTemplateFromState = async (id) => {
    try {
      await deleteWorkoutTemplate(id);
      removeTemplateFromState(id);
    } catch (err) {
      console.error('Error deleting workout template:', err);
      throw err;
    }
  };

  // Refresh templates from database
  const refreshTemplates = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const fetchedTemplates = await getUserWorkoutTemplates(currentUser.id);
      setTemplates(fetchedTemplates);
      setError(null);
    } catch (err) {
      console.error('Error refreshing workout templates:', err);
      setError('Failed to refresh workout templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    templates,
    loading,
    error,
    addTemplateToState,
    updateTemplateInState,
    removeTemplateFromState,
    deleteTemplateFromState,
    refreshTemplates
  };

  return (
    <WorkoutTemplateContext.Provider value={value}>
      {children}
    </WorkoutTemplateContext.Provider>
  );
};

export default WorkoutTemplateContext; 