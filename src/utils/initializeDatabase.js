// src/utils/initializeDatabase.js
// This is now handled automatically by the mock Firebase service
// We keep this file but make it a no-op since initialization 
// happens in the mockFirebase.js constructor

const initializeExerciseDatabase = async () => {
    // Database is already initialized in mockFirebase.js
    console.log('Exercise database already initialized by mock service.');
    return true;
  };
  
  export default initializeExerciseDatabase;