# Adding New Exercises to the Database

This guide explains how to add new exercises to the Exercise Library database.

## Prerequisites

1. Make sure you have the following environment variables set in your `.env` file:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
   Note: The service role key can be found in your Supabase dashboard under Project Settings > API > Project API keys.

## Steps to Add New Exercises

1. Navigate to `src/utils/newExercises.js`

2. Add your new exercise(s) to the `newExercises` array following this template:
   ```javascript
   {
       name: "Exercise Name",
       primaryMuscleGroup: "Primary Muscle",  // e.g., "Quadriceps", "Back", "Chest", "Full Body"
       secondaryMuscleGroups: ["Muscle1", "Muscle2"],  // Array of secondary muscles worked
       equipment: "Required Equipment",  // e.g., "Barbell", "Dumbbells", "Bodyweight"
       difficulty: "Difficulty Level",   // "Beginner", "Intermediate", or "Advanced"
       description: "Brief description of the exercise",
       instructions: [
           "Step 1 of the movement",
           "Step 2 of the movement",
           // Add more steps as needed
       ],
       tips: [
           "Important tip 1",
           "Important tip 2",
           // Add more tips as needed
       ]
   }
   ```

3. Run the script to add the exercises:
   ```bash
   node src/utils/loadExercises.js
   ```

4. Verify the exercises were added successfully by:
   - Checking the console output for success message
   - Opening the Exercise Library in the application
   - Using the search functionality to find your new exercises

## Important Notes

- Exercise names must be unique. The script will automatically skip any exercises that already exist in the database.
- All fields are required except `secondaryMuscleGroups` which can be an empty array.
- Keep instructions and tips clear and concise.
- For complex movements (like Olympic lifts), break down the instructions into smaller, manageable steps.

## Example Exercise

Here's an example of a well-formatted exercise:
```javascript
{
    name: "Barbell Front Squat",
    primaryMuscleGroup: "Quadriceps",
    secondaryMuscleGroups: ["Core", "Glutes", "Upper Back"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    description: "A compound lower body exercise that emphasizes the quadriceps while requiring significant core stability and upper back strength.",
    instructions: [
        "Position the barbell on your front deltoids and clavicle, with elbows high and parallel to the ground",
        "Stand with feet shoulder-width apart, toes slightly pointed out",
        "Keeping your torso upright, descend by breaking at the hips and knees",
        "Continue until thighs are parallel to the ground or slightly below",
        "Drive through your heels to stand back up, maintaining an upright torso"
    ],
    tips: [
        "Keep your elbows high throughout the movement",
        "Maintain an upright torso position",
        "Focus on breathing and bracing your core",
        "If wrist mobility is limited, try using a cross-arm grip"
    ]
}
```

## Troubleshooting

1. If you get a "row-level security policy" error:
   - Check that you're using the correct service role key
   - Verify your environment variables are properly loaded

2. If the script fails to run:
   - Ensure all dependencies are installed (`npm install`)
   - Check that your `.env` file is in the root directory
   - Verify the exercise format matches the template exactly 