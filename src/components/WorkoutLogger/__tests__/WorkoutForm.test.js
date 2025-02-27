// src/components/WorkoutLogger/__tests__/WorkoutForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutForm from '../WorkoutForm';
import { getExercises } from '../../../firebase/firestore';

// Mock the firestore module
jest.mock('../../../firebase/firestore', () => ({
  getExercises: jest.fn()
}));

describe('WorkoutForm', () => {
  const mockOnSubmit = jest.fn();
  const mockExercises = [
    { id: '1', name: 'Bench Press' },
    { id: '2', name: 'Squat' },
    { id: '3', name: 'Deadlift' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the getExercises to return sample exercises
    getExercises.mockResolvedValue(mockExercises);
    
    // Mock the Date object to return a fixed date
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the form with default values', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Check initial date value (today's date in ISO format)
    const dateInput = screen.getByLabelText(/date/i);
    expect(dateInput.value).toBe('2023-01-01');
    
    // Check initial weight unit selection
    const unitSelect = screen.getByLabelText(/weight unit/i);
    expect(unitSelect.value).toBe('kg');
    
    // Check if there's an initial empty exercise
    expect(screen.getByPlaceholderText(/e\.g\., bench press, squat/i)).toBeInTheDocument();
    
    // Wait for exercises to be fetched
    await waitFor(() => {
      expect(getExercises).toHaveBeenCalled();
    });
  });

  test('adds an exercise when "Add Exercise" button is clicked', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Initially there should be 1 exercise
    let exerciseInputs = screen.getAllByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInputs.length).toBe(1);
    
    // Click the Add Exercise button
    const addExerciseButton = screen.getByText(/add exercise/i);
    userEvent.click(addExerciseButton);
    
    // Now there should be 2 exercises
    exerciseInputs = screen.getAllByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInputs.length).toBe(2);
  });

  test('removes an exercise when "Remove" button is clicked', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Add a second exercise first
    const addExerciseButton = screen.getByText(/add exercise/i);
    userEvent.click(addExerciseButton);
    
    // Get remove buttons
    const removeButtons = screen.getAllByText(/remove/i);
    expect(removeButtons.length).toBe(2);
    
    // Click the first remove button
    userEvent.click(removeButtons[0]);
    
    // Now there should be 1 exercise
    const exerciseInputs = screen.getAllByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInputs.length).toBe(1);
  });

  test('adds a set when "Add Set" button is clicked', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Initially there should be 1 set
    let setLabels = screen.getAllByText(/^set 1$/i);
    expect(setLabels.length).toBe(1);
    
    // Click the Add Set button
    const addSetButton = screen.getByText(/add set/i);
    userEvent.click(addSetButton);
    
    // Now there should be 2 sets
    setLabels = screen.getAllByText(/^set/i);
    expect(setLabels.length).toBe(2);
    expect(screen.getByText(/^set 2$/i)).toBeInTheDocument();
  });

  test('removes a set when remove button is clicked', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Add a second set first
    const addSetButton = screen.getByText(/add set/i);
    userEvent.click(addSetButton);
    
    // Check that we have 2 sets
    let setLabels = screen.getAllByText(/^set/i);
    expect(setLabels.length).toBe(2);
    
    // Get remove set buttons (they have a trash icon)
    const removeSetButtons = screen.getAllByTitle('Remove set');
    expect(removeSetButtons.length).toBe(2);
    
    // Click the first remove button
    userEvent.click(removeSetButtons[0]);
    
    // Now there should be 1 set
    setLabels = screen.getAllByText(/^set/i);
    expect(setLabels.length).toBe(1);
  });

  test('submits the form with valid input', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    // Workout name
    const nameInput = screen.getByPlaceholderText(/e\.g\., upper body, leg day/i);
    userEvent.type(nameInput, 'Test Workout');
    
    // Exercise name
    const exerciseInput = screen.getByPlaceholderText(/e\.g\., bench press, squat/i);
    userEvent.type(exerciseInput, 'Bench Press');
    
    // Weight and reps
    const weightInput = screen.getByPlaceholderText('Weight');
    const repsInput = screen.getByPlaceholderText('Reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '100');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '5');
    
    // Submit the form
    const submitButton = screen.getByText(/log workout/i);
    userEvent.click(submitButton);
    
    await waitFor(() => {
      // Check if onSubmit was called with the right data
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      const submittedData = mockOnSubmit.mock.calls[0][0];
      
      expect(submittedData.name).toBe('Test Workout');
      expect(submittedData.unit).toBe('kg');
      expect(submittedData.exercises.length).toBe(1);
      expect(submittedData.exercises[0].name).toBe('Bench Press');
      expect(submittedData.exercises[0].sets.length).toBe(1);
      expect(submittedData.exercises[0].sets[0].weight).toBe(100);
      expect(submittedData.exercises[0].sets[0].reps).toBe(5);
    });
  });

  test('shows error when submitting without required fields', async () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Submit the form without filling any fields
    const submitButton = screen.getByText(/log workout/i);
    userEvent.click(submitButton);
    
    // Check if error message appears
    await waitFor(() => {
      expect(screen.getByText(/please add at least one exercise/i)).toBeInTheDocument();
    });
    
    // Fill exercise name but not sets data
    const exerciseInput = screen.getByPlaceholderText(/e\.g\., bench press, squat/i);
    userEvent.type(exerciseInput, 'Bench Press');
    
    // Try submitting again
    userEvent.click(submitButton);
    
    // Check if error message about sets appears
    await waitFor(() => {
      expect(screen.getByText(/please add at least one set for bench press/i)).toBeInTheDocument();
    });
  });

  test('shows success message after successful submission', async () => {
    // Mock the onSubmit to return a success result
    mockOnSubmit.mockResolvedValue({ success: true });
    
    render(<WorkoutForm onSubmit={mockOnSubmit} />);
    
    // Fill out the form
    const exerciseInput = screen.getByPlaceholderText(/e\.g\., bench press, squat/i);
    userEvent.type(exerciseInput, 'Bench Press');
    
    const weightInput = screen.getByPlaceholderText('Weight');
    const repsInput = screen.getByPlaceholderText('Reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '100');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '5');
    
    // Submit the form
    const submitButton = screen.getByText(/log workout/i);
    userEvent.click(submitButton);
    
    // Check if success message appears
    await waitFor(() => {
      expect(screen.getByText(/workout logged successfully/i)).toBeInTheDocument();
    });
  });
});