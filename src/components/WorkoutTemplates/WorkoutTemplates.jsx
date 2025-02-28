import React, { useState, useEffect } from 'react';
import { useWorkoutTemplateContext } from '../../context/WorkoutTemplateContext';
import { addWorkoutTemplate, updateWorkoutTemplate, getExercises } from '../../supabase/firestoreService';
import { useAuth } from '../../context/AuthContext';

const WorkoutTemplates = () => {
  const { templates, loading, error, addTemplateToState, deleteTemplateFromState } = useWorkoutTemplateContext();
  const { currentUser } = useAuth();
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    exercises: [{ name: '', sets: [{ weight: '', reps: '' }] }]
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exerciseData = await getExercises();
        setAvailableExercises(exerciseData);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      }
    };

    fetchExercises();
  }, []);

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    
    try {
      const templateData = {
        ...formData,
        userId: currentUser.id
      };
      
      const savedTemplate = await addWorkoutTemplate(templateData);
      addTemplateToState(savedTemplate);
      
      // Reset form
      setFormData({
        name: '',
        unit: 'kg',
        exercises: [{ name: '', sets: [{ weight: '', reps: '' }] }]
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding template:', err);
    }
  };

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    
    try {
      const updatedTemplate = await updateWorkoutTemplate(editingTemplate.id, formData);
      addTemplateToState(updatedTemplate);
      
      setEditingTemplate(null);
      setFormData({
        name: '',
        unit: 'kg',
        exercises: [{ name: '', sets: [{ weight: '', reps: '' }] }]
      });
    } catch (err) {
      console.error('Error updating template:', err);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteTemplateFromState(templateId);
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      unit: template.unit,
      exercises: template.exercises
    });
    setShowForm(true);
  };

  const handleExerciseChange = (index, field, value) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        [field]: value
      };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        sets: updatedExercises[exerciseIndex].sets.map((set, idx) =>
          idx === setIndex ? { ...set, [field]: value } : set
        )
      };
      return { ...prev, exercises: updatedExercises };
    });
  };

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '', sets: [{ weight: '', reps: '' }] }]
    }));
  };

  const addSet = (exerciseIndex) => {
    setFormData(prev => {
      const updatedExercises = [...prev.exercises];
      const prevSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
      updatedExercises[exerciseIndex].sets.push({
        weight: prevSet?.weight || '',
        reps: prevSet?.reps || ''
      });
      return { ...prev, exercises: updatedExercises };
    });
  };

  const removeExercise = (index) => {
    if (formData.exercises.length > 1) {
      setFormData(prev => ({
        ...prev,
        exercises: prev.exercises.filter((_, idx) => idx !== index)
      }));
    }
  };

  const removeSet = (exerciseIndex, setIndex) => {
    if (formData.exercises[exerciseIndex].sets.length > 1) {
      setFormData(prev => {
        const updatedExercises = [...prev.exercises];
        updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.filter(
          (_, idx) => idx !== setIndex
        );
        return { ...prev, exercises: updatedExercises };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Workout Templates</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Create Template'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={editingTemplate ? handleUpdateTemplate : handleAddTemplate} className="mb-8 bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="template-name" className="form-label">
              Template Name
            </label>
            <input
              id="template-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Upper Body, Leg Day, etc."
              className="form-input"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="weight-unit" className="form-label">
              Weight Unit
            </label>
            <select
              id="weight-unit"
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              className="form-input"
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="form-label mb-0">
                Exercises
              </label>
              <button
                type="button"
                onClick={addExercise}
                className="btn btn-primary flex items-center text-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Exercise
              </button>
            </div>

            <div className="space-y-6">
              {formData.exercises.map((exercise, exerciseIndex) => (
                <div key={exerciseIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <div className="flex-1 mb-2 md:mb-0 md:mr-4">
                      <label className="block text-sm text-gray-600 mb-1">
                        Exercise Name
                      </label>
                      <select
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Select an exercise...</option>
                        {availableExercises.map((ex) => (
                          <option key={ex.id} value={ex.name}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.exercises.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExercise(exerciseIndex)}
                        className="btn btn-danger flex items-center text-sm self-end"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm text-gray-600 font-medium">
                        Sets
                      </label>
                      <button
                        type="button"
                        onClick={() => addSet(exerciseIndex)}
                        className="text-primary hover:text-primary-dark flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Set
                      </button>
                    </div>

                    <div className="bg-white rounded-md p-3 border border-gray-200">
                      <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-600 px-2">
                        <div className="col-span-2">Set</div>
                        <div className="col-span-4">Weight</div>
                        <div className="col-span-4">Reps</div>
                        <div className="col-span-2"></div>
                      </div>
                      
                      <div className="space-y-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-2 text-sm font-medium text-gray-600">
                              Set {setIndex + 1}
                            </div>
                            
                            <div className="col-span-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                  placeholder="Weight"
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  min="0"
                                  step="0.5"
                                  required
                                />
                                <div className="absolute right-2 top-2 text-xs text-gray-500">
                                  {formData.unit}
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-span-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                  placeholder="Reps"
                                  className="w-full p-2 border border-gray-300 rounded-md"
                                  min="1"
                                  step="1"
                                  required
                                />
                                <div className="absolute right-2 top-2 text-xs text-gray-500">
                                  reps
                                </div>
                              </div>
                            </div>
                            
                            <div className="col-span-2">
                              {exercise.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSet(exerciseIndex, setIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-3"
          >
            {editingTemplate ? 'Update Template' : 'Save Template'}
          </button>
        </form>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow-md rounded-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {template.exercises.map((exercise, index) => (
                <div key={index} className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-2">{exercise.name}</h4>
                  <div className="grid grid-cols-3 text-sm text-gray-500 mb-1">
                    <div>Set</div>
                    <div>Weight</div>
                    <div>Reps</div>
                  </div>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-3 text-sm">
                      <div>Set {setIndex + 1}</div>
                      <div>{set.weight} {template.unit}</div>
                      <div>{set.reps} reps</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutTemplates; 