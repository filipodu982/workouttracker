// src/utils/initializeDatabase.js
import sampleExercises from './sampleExerciseData';
import { initializeExerciseDatabase } from '../supabase/firestoreService';

/**
 * Initialize the exercise database with sample data
 */
const initializeDatabaseWithSampleData = async () => {
  try {
    // Format exercises for Supabase
    const formattedExercises = sampleExercises.map(exercise => ({
      name: exercise.name,
      primary_muscle_group: exercise.primaryMuscleGroup,
      secondary_muscle_groups: exercise.secondaryMuscleGroups || [],
      equipment: exercise.equipment,
      difficulty: exercise.difficulty,
      description: exercise.description,
      instructions: exercise.instructions || [],
      tips: exercise.tips || []
    }));

    // Initialize database
    await initializeExerciseDatabase(formattedExercises);
    console.log('Exercise database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabaseWithSampleData;