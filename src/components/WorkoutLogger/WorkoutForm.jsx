// src/components/WorkoutLogger/WorkoutForm.jsx
import React, { useState, useEffect } from 'react';
import { getExercises } from '../../firebase/firestore';
import SetInput from './SetInput';

const WorkoutForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [unit, setUnit] = useState('kg');
  const [exercises, setExercises] = useState([{ 
    name: '', 
    sets: [{ weight: '', reps: '' }]
  }]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exerciseData = await getExercises();
        setAvailableExercises(exerciseData);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercises. Please try again later.');
      }
    };

    fetchExercises();
  }, []);

  const handleExerciseChange = (index, field, value) => {
    setExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[index][field] = value;
      return updatedExercises;
    });
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      updatedExercises[exerciseIndex].sets[setIndex][field] = value;
      return updatedExercises;
    });
  };

  const addExercise = () => {
    setExercises(prevExercises => [...prevExercises, { name: '', sets: [{ weight: '', reps: '' }] }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(prevExercises => {
        const updatedExercises = [...prevExercises];
        updatedExercises.splice(index, 1);
        return updatedExercises;
      });
    }
  };

  const addSet = (exerciseIndex) => {
    setExercises(prevExercises => {
      const updatedExercises = [...prevExercises];
      const prevSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
      
      // Copy values from previous set for convenience
      updatedExercises[exerciseIndex].sets.push({ 
        weight: prevSet?.weight || '',
        reps: prevSet?.reps || ''
      });
      
      return updatedExercises;
    });
  };

  const removeSet = (exerciseIndex, setIndex) => {
    if (exercises[exerciseIndex].sets.length > 1) {
      setExercises(prevExercises => {
        const updatedExercises = [...prevExercises];
        updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
        return updatedExercises;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate exercises
      const validExercises = exercises.filter(ex => ex.name.trim() !== '');

      if (validExercises.length === 0) {
        throw new Error('Please add at least one exercise');
      }

      // Validate sets
      validExercises.forEach(exercise => {
        const validSets = exercise.sets.filter(
          set => set.weight.trim() !== '' && set.reps.trim() !== ''
        );

        if (validSets.length === 0) {
          throw new Error(`Please add at least one set for ${exercise.name}`);
        }

        // Convert string values to numbers
        exercise.sets = validSets.map(set => ({
          weight: parseFloat(set.weight),
          reps: parseInt(set.reps, 10)
        }));
      });

      const workoutData = {
        name: name.trim() || `Workout on ${new Date(date).toLocaleDateString()}`,
        date: new Date(date),
        unit,
        exercises: validExercises
      };

      const result = await onSubmit(workoutData);
      
      if (result?.success) {
        // Reset form
        setName('');
        setDate(new Date().toISOString().split('T')[0]);
        setExercises([{ name: '', sets: [{ weight: '', reps: '' }] }]);
        setSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error submitting workout:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Workout logged successfully!
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="workout-name" className="form-label">
          Workout Name
        </label>
        <input
          id="workout-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Upper Body, Leg Day, etc."
          className="form-input"
        />
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:space-x-4">
        <div className="flex-1 mb-4 md:mb-0">
          <label htmlFor="workout-date" className="form-label">
            Date
          </label>
          <input
            id="workout-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="w-full md:w-1/4">
          <label htmlFor="weight-unit" className="form-label">
            Weight Unit
          </label>
          <select
            id="weight-unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="form-input"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
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
          {exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex flex-col md:flex-row md:items-center mb-4">
                <div className="flex-1 mb-2 md:mb-0 md:mr-4">
                  <label className="block text-sm text-gray-600 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    list={`exercises-${exerciseIndex}`}
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(exerciseIndex, 'name', e.target.value)}
                    placeholder="e.g., Bench Press, Squat"
                    className="form-input"
                    required
                  />
                  <datalist id={`exercises-${exerciseIndex}`}>
                    {availableExercises.map((ex) => (
                      <option key={ex.id} value={ex.name} />
                    ))}
                  </datalist>
                </div>
                {exercises.length > 1 && (
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
                      <SetInput
                        key={setIndex}
                        set={set}
                        setIndex={setIndex}
                        onChange={(field, value) => handleSetChange(exerciseIndex, setIndex, field, value)}
                        onRemove={() => removeSet(exerciseIndex, setIndex)}
                        canRemove={exercise.sets.length > 1}
                        unit={unit}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full btn btn-primary py-3 flex justify-center items-center ${
          submitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {submitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Log Workout
          </>
        )}
      </button>
    </form>
  );
};

export default WorkoutForm;