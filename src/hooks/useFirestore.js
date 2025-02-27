// src/hooks/useFirestore.js
import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  getDocs
} from 'firebase/firestore';
import { db, auth } from '../firebase/firebase';
import { useWorkoutContext } from '../context/WorkoutContext';

const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const workoutContext = useWorkoutContext();

  // Add document to collection
  const addDocument = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Add userId to the document if not provided
      const dataWithUser = {
        ...data,
        userId: data.userId || auth.currentUser?.uid,
        createdAt: new Date()
      };

      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, dataWithUser);
      
      // If we're working with workouts, update the context
      if (collectionName === 'workouts' && workoutContext) {
        workoutContext.addWorkoutToState({ id: docRef.id, ...dataWithUser });
      }
      
      return { id: docRef.id, ...dataWithUser };
    } catch (err) {
      console.error(`Error adding ${collectionName} document:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update document in collection
  const updateDocument = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      
      // If we're working with workouts, update the context
      if (collectionName === 'workouts' && workoutContext) {
        workoutContext.updateWorkoutInState(id, data);
      }
      
      return { id, ...data };
    } catch (err) {
      console.error(`Error updating ${collectionName} document:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete document from collection
  const deleteDocument = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      // If we're working with workouts, update the context
      if (collectionName === 'workouts' && workoutContext) {
        workoutContext.removeWorkoutFromState(id);
      }
      
      return { id };
    } catch (err) {
      console.error(`Error deleting ${collectionName} document:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get all documents for current user
  const getUserDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return documents;
    } catch (err) {
      console.error(`Error fetching ${collectionName} documents:`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    getUserDocuments,
    loading,
    error
  };
};

export default useFirestore;