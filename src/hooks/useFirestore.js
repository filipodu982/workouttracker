// src/hooks/useFirestore.js
import { useState } from 'react';
import { supabase } from '../supabase/supabase';
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
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Add userId to the document if not provided
      const dataWithUser = {
        ...data,
        user_id: data.userId || user.id,
        created_at: new Date()
      };

      const { data: newDoc, error: insertError } = await supabase
        .from(collectionName)
        .insert(dataWithUser)
        .select()
        .single();

      if (insertError) throw insertError;
      
      // If we're working with workouts, update the context
      if (collectionName === 'workouts' && workoutContext) {
        workoutContext.addWorkoutToState(newDoc);
      }
      
      return newDoc;
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
      const { data: updatedDoc, error: updateError } = await supabase
        .from(collectionName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      // If we're working with workouts, update the context
      if (collectionName === 'workouts' && workoutContext) {
        workoutContext.updateWorkoutInState(id, updatedDoc);
      }
      
      return updatedDoc;
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
      const { error: deleteError } = await supabase
        .from(collectionName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
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
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: documents, error: fetchError } = await supabase
        .from(collectionName)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      return documents || [];
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