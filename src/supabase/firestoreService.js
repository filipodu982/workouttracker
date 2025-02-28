// src/supabase/firestoreService.js
import { supabase } from './supabase';

/**
 * Add a new workout to the database
 * @param {Object} workoutData - The workout data to add
 * @returns {Promise<Object>} - The created workout
 */
export const addWorkout = async (workoutData) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        user_id: workoutData.userId,
        name: workoutData.name,
        date: workoutData.date,
        unit: workoutData.unit,
        exercises: workoutData.exercises
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding workout:', error);
    throw error;
  }
};

/**
 * Get workouts for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - An array of workouts
 */
export const getUserWorkouts = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

/**
 * Get all exercises from the exercise library
 * @returns {Promise<Array>} - An array of exercises
 */
export const getExercises = async () => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

/**
 * Get a specific exercise by ID
 * @param {string} id - The exercise ID
 * @returns {Promise<Object>} - The exercise object
 */
export const getExercise = async (id) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
};

/**
 * Update a workout
 * @param {string} id - The workout ID
 * @param {Object} data - The updated workout data
 * @returns {Promise<Object>} - The updated workout
 */
export const updateWorkout = async (id, data) => {
  try {
    // Add updated_at timestamp
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const { data: updatedWorkout, error } = await supabase
      .from('workouts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    return updatedWorkout;
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

/**
 * Delete a workout
 * @param {string} id - The workout ID
 * @returns {Promise<void>}
 */
export const deleteWorkout = async (id) => {
  try {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }

    return { id };
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

/**
 * Initialize the exercise database with sample data
 * @param {Array} exercises - Sample exercise data
 * @returns {Promise<void>}
 */
export const initializeExerciseDatabase = async (exercises) => {
  try {
    // Check if exercises already exist
    const { data: existingExercises, error: fetchError } = await supabase
      .from('exercises')
      .select('name');
    
    if (fetchError) {
      throw fetchError;
    }

    // Filter out exercises that already exist
    const existingNames = new Set(existingExercises.map(ex => ex.name));
    const newExercises = exercises.filter(ex => !existingNames.has(ex.name));

    // Only insert if there are new exercises
    if (newExercises.length > 0) {
      const { error } = await supabase
        .from('exercises')
        .insert(newExercises);
      
      if (error) {
        throw error;
      }

      console.log(`Exercise database initialized with ${newExercises.length} new exercises`);
    }
  } catch (error) {
    console.error('Error initializing exercise database:', error);
    throw error;
  }
};

/**
 * Get user settings
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The user settings
 */
export const getUserSettings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
};

/**
 * Update user settings
 * @param {string} userId - The user ID
 * @param {Object} settings - The updated settings
 * @returns {Promise<Object>} - The updated settings
 */
export const updateUserSettings = async (userId, settings) => {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({
        ...settings,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Add a new workout template to the database
 * @param {Object} templateData - The template data to add
 * @returns {Promise<Object>} - The created template
 */
export const addWorkoutTemplate = async (templateData) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates')
      .insert({
        user_id: templateData.userId,
        name: templateData.name,
        unit: templateData.unit,
        exercises: templateData.exercises
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding workout template:', error);
    throw error;
  }
};

/**
 * Get workout templates for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - An array of templates
 */
export const getUserWorkoutTemplates = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching workout templates:', error);
    throw error;
  }
};

/**
 * Update a workout template
 * @param {string} id - The template ID
 * @param {Object} data - The updated template data
 * @returns {Promise<Object>} - The updated template
 */
export const updateWorkoutTemplate = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const { data: updatedTemplate, error } = await supabase
      .from('workout_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    return updatedTemplate;
  } catch (error) {
    console.error('Error updating workout template:', error);
    throw error;
  }
};

/**
 * Delete a workout template
 * @param {string} id - The template ID
 * @returns {Promise<void>}
 */
export const deleteWorkoutTemplate = async (id) => {
  try {
    const { error } = await supabase
      .from('workout_templates')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }

    return { id };
  } catch (error) {
    console.error('Error deleting workout template:', error);
    throw error;
  }
};