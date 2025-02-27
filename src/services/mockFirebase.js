// src/services/mockFirebase.js
import sampleExercises from '../utils/sampleExerciseData';

// Mock UUID function for generating unique IDs
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

class MockFirebaseService {
  constructor() {
    // Initialize local storage or use memory storage if not available
    this.storage = window.localStorage || {};
    this.initializeStore();
    
    // Initialize auth state from localStorage
    const storedUser = this.getItem('user');
    if (storedUser) {
      this.auth.currentUser = JSON.parse(storedUser);
    }
  }

  // Initialize data store with default values if empty
  initializeStore() {
    // Initialize users if not exists
    if (!this.getItem('users')) {
      this.setItem('users', JSON.stringify([]));
    }

    // Initialize workouts if not exists
    if (!this.getItem('workouts')) {
      this.setItem('workouts', JSON.stringify([]));
    }

    // Initialize exercises with sample data if not exists
    if (!this.getItem('exercises')) {
      const exercises = sampleExercises.map(exercise => ({
        id: uuidv4(),
        ...exercise,
        createdAt: new Date().toISOString()
      }));
      this.setItem('exercises', JSON.stringify(exercises));
    }
  }

  // Wrapper for localStorage getItem with JSON parsing
  getItem(key) {
    const item = this.storage[key];
    if (!item) return null;
    return item;
  }

  // Wrapper for localStorage setItem with JSON stringifying
  setItem(key, value) {
    this.storage[key] = value;
  }

  // Mock Firebase Auth
  auth = {
    currentUser: null,
    
    // Sign up new user
    createUserWithEmailAndPassword: (email, password) => {
      return new Promise((resolve, reject) => {
        try {
          const users = JSON.parse(this.getItem('users'));
          
          // Check if email already exists
          const existingUser = users.find(user => user.email === email);
          if (existingUser) {
            reject({ code: 'auth/email-already-in-use' });
            return;
          }
          
          // Create new user
          const user = {
            uid: uuidv4(),
            email,
            password, // In a real app, never store plaintext passwords!
            displayName: null,
            createdAt: new Date().toISOString(),
            // Add settings object to match expected structure
            settings: {}
          };
          
          users.push(user);
          this.setItem('users', JSON.stringify(users));
          
          // Set as current user
          this.auth.currentUser = user;
          
          resolve({ user });
        } catch (error) {
          console.error("Error in createUserWithEmailAndPassword:", error);
          reject(error);
        }
      });
    },
    
    // Sign in existing user
    signInWithEmailAndPassword: (email, password) => {
      return new Promise((resolve, reject) => {
        try {
          const users = JSON.parse(this.getItem('users'));
          
          // Find user with matching email and password
          const user = users.find(u => u.email === email && u.password === password);
          
          if (!user) {
            reject({ code: 'auth/invalid-credential' });
            return;
          }
          
          // Set as current user
          this.auth.currentUser = user;
          
          resolve({ user });
        } catch (error) {
          console.error("Error in signInWithEmailAndPassword:", error);
          reject(error);
        }
      });
    },
    
    // Update user profile
    updateProfile: (user, data) => {
      return new Promise((resolve, reject) => {
        try {
          const users = JSON.parse(this.getItem('users'));
          
          // Find and update user
          const updatedUsers = users.map(u => {
            if (u.uid === user.uid) {
              return { ...u, ...data };
            }
            return u;
          });
          
          this.setItem('users', JSON.stringify(updatedUsers));
          this.auth.currentUser = { ...this.auth.currentUser, ...data };
          
          resolve();
        } catch (error) {
          console.error("Error in updateProfile:", error);
          reject(error);
        }
      });
    },
    
    // Sign out
    signOut: () => {
      return new Promise((resolve) => {
        this.auth.currentUser = null;
        resolve();
      });
    },
    
    // Auth state observer
    onAuthStateChanged: (callback) => {
      // Initial call with current auth state
      callback(this.auth.currentUser);
      
      // Return unsubscribe function (mock)
      return () => {};
    }
  };
  
  // Mock Firestore
  firestore = {
    // Add a document to a collection
    addDocument: (collectionName, data) => {
      return new Promise((resolve) => {
        const collection = JSON.parse(this.getItem(collectionName)) || [];
        
        const document = {
          id: uuidv4(),
          ...data,
          createdAt: new Date().toISOString()
        };
        
        collection.push(document);
        this.setItem(collectionName, JSON.stringify(collection));
        
        resolve({ id: document.id, ...document });
      });
    },
    
    // Update a document in a collection
    updateDocument: (collectionName, id, data) => {
      return new Promise((resolve, reject) => {
        const collection = JSON.parse(this.getItem(collectionName)) || [];
        
        // Find document index
        const index = collection.findIndex(doc => doc.id === id);
        
        if (index === -1) {
          reject(new Error('Document not found'));
          return;
        }
        
        // Update document
        collection[index] = {
          ...collection[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        this.setItem(collectionName, JSON.stringify(collection));
        
        resolve({ id, ...collection[index] });
      });
    },
    
    // Delete a document from a collection
    deleteDocument: (collectionName, id) => {
      return new Promise((resolve, reject) => {
        const collection = JSON.parse(this.getItem(collectionName)) || [];
        
        // Filter out document with matching id
        const updatedCollection = collection.filter(doc => doc.id !== id);
        
        if (updatedCollection.length === collection.length) {
          reject(new Error('Document not found'));
          return;
        }
        
        this.setItem(collectionName, JSON.stringify(updatedCollection));
        
        resolve({ id });
      });
    },
    
    // Get all documents in a collection
    getDocuments: (collectionName) => {
      return new Promise((resolve) => {
        const collection = JSON.parse(this.getItem(collectionName)) || [];
        resolve(collection);
      });
    },
    
    // Get a single document from a collection
    getDocument: (collectionName, id) => {
      return new Promise((resolve, reject) => {
        const collection = JSON.parse(this.getItem(collectionName)) || [];
        
        const document = collection.find(doc => doc.id === id);
        
        if (!document) {
          reject(new Error('Document not found'));
          return;
        }
        
        resolve(document);
      });
    },
    
    // Get documents with a filter
    query: (collectionName, filters = {}, sortOptions = {}) => {
      return new Promise((resolve) => {
        let collection = JSON.parse(this.getItem(collectionName)) || [];
        
        // Apply filters
        Object.entries(filters).forEach(([field, value]) => {
          collection = collection.filter(doc => doc[field] === value);
        });
        
        // Apply sorting
        if (sortOptions.field) {
          collection.sort((a, b) => {
            // Handle date strings
            if (a[sortOptions.field]?.includes?.('T') && b[sortOptions.field]?.includes?.('T')) {
              return sortOptions.direction === 'desc' 
                ? new Date(b[sortOptions.field]) - new Date(a[sortOptions.field])
                : new Date(a[sortOptions.field]) - new Date(b[sortOptions.field]);
            }
            
            // Handle regular strings and numbers
            return sortOptions.direction === 'desc'
              ? b[sortOptions.field] > a[sortOptions.field] ? 1 : -1
              : a[sortOptions.field] > b[sortOptions.field] ? 1 : -1;
          });
        }
        
        resolve(collection);
      });
    }
  };

  // Firebase Firestore-specific methods
  addWorkout = (workoutData) => {
    return this.firestore.addDocument('workouts', workoutData);
  };

  getUserWorkouts = (userId) => {
    return this.firestore.query('workouts', { userId }, { field: 'createdAt', direction: 'desc' });
  };
  
  getExercises = () => {
    return this.firestore.getDocuments('exercises');
  };
  
  getExercise = (id) => {
    return this.firestore.getDocument('exercises', id);
  };
  
  updateWorkout = (id, data) => {
    return this.firestore.updateDocument('workouts', id, data);
  };
  
  deleteWorkout = (id) => {
    return this.firestore.deleteDocument('workouts', id);
  };
}

// Create singleton instance
const mockFirebase = new MockFirebaseService();

// Export Firebase-compatible interfaces
export const db = mockFirebase.firestore;
export const auth = mockFirebase.auth;

// Export Firestore-specific methods
export const addWorkout = mockFirebase.addWorkout;
export const getUserWorkouts = mockFirebase.getUserWorkouts;
export const getExercises = mockFirebase.getExercises;
export const getExercise = mockFirebase.getExercise;
export const updateWorkout = mockFirebase.updateWorkout;
export const deleteWorkout = mockFirebase.deleteWorkout;

// Export entire service for more advanced usage
export default mockFirebase;