// src/utils/addNewExercises.js
const newExercises = require('./newExercises');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    }
);

/**
 * Add new exercises to the database
 */
const addNewExercises = async () => {
    try {
        // Format exercises for Supabase
        const formattedExercises = newExercises.map(exercise => ({
            name: exercise.name,
            primary_muscle_group: exercise.primaryMuscleGroup,
            secondary_muscle_groups: exercise.secondaryMuscleGroups || [],
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
            description: exercise.description,
            instructions: exercise.instructions || [],
            tips: exercise.tips || []
        }));

        // Check if exercises already exist
        const { data: existingExercises, error: fetchError } = await supabase
            .from('exercises')
            .select('name');
        
        if (fetchError) {
            throw fetchError;
        }

        // Filter out exercises that already exist
        const existingNames = new Set(existingExercises.map(ex => ex.name));
        const newExercisesToAdd = formattedExercises.filter(ex => !existingNames.has(ex.name));

        if (newExercisesToAdd.length > 0) {
            const { error } = await supabase
                .from('exercises')
                .insert(newExercisesToAdd);
            
            if (error) {
                throw error;
            }

            console.log(`Successfully added ${newExercisesToAdd.length} new exercises`);
        } else {
            console.log('No new exercises to add - all exercises already exist in the database');
        }
    } catch (error) {
        console.error('Error adding new exercises:', error);
    }
};

// Run the function
addNewExercises(); 