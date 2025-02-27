// src/firebase/firebase.js
// Import mock Firebase services instead of real Firebase
import { auth, db } from '../services/mockFirebase';

// Export the mock services
export { db, auth };