// src/components/ExerciseLibrary/ExerciseLibrary.jsx
import React, { useState, useEffect } from 'react';
import { getExercises } from '../../supabase/firestoreService';
import ExerciseCard from './ExerciseCard';

const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const exerciseData = await getExercises();
        setExercises(exerciseData);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  // Get unique muscle groups and equipment from exercises
  const muscleGroups = ['all', ...new Set(exercises.map(ex => ex.primary_muscle_group))].filter(Boolean);
  const equipmentTypes = ['all', ...new Set(exercises.map(ex => ex.equipment))].filter(Boolean);

  // Filter exercises based on search and filters
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscleGroup === 'all' || exercise.primary_muscle_group === selectedMuscleGroup;
    const matchesEquipment = selectedEquipment === 'all' || exercise.equipment === selectedEquipment;
    
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading exercise library...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Exercise Library</h2>
      
      <div className="mb-6 bg-white shadow-md rounded-lg p-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Search Exercises
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Filter by Muscle Group
            </label>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {muscleGroups.map(group => (
                <option key={group} value={group}>
                  {group === 'all' ? 'All Muscle Groups' : group}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Filter by Equipment
            </label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {equipmentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Equipment' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={{
                ...exercise,
                primaryMuscleGroup: exercise.primary_muscle_group,
                secondaryMuscleGroups: exercise.secondary_muscle_groups
              }} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-600">No exercises found matching your filters.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;