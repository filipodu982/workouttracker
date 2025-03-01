// src/components/WorkoutLogger/__tests__/WorkoutForm.test.js
import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutForm from '../WorkoutForm';
import { getExercises } from '../../../supabase/firestoreService';
import WorkoutTemplateContext from '../../../context/WorkoutTemplateContext';

// Mock the Supabase client
jest.mock('../../../supabase/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Bench Press' },
          { id: '2', name: 'Squat' },
          { id: '3', name: 'Deadlift' }
        ],
        error: null
      })
    })),
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user-id' } } } }),
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
      onAuthStateChange: jest.fn((callback) => {
        callback('SIGNED_IN', { user: { id: 'test-user-id' } });
        return { data: { unsubscribe: jest.fn() } };
      }),
    },
  },
}));

// Mock the firestoreService module
jest.mock('../../../supabase/firestoreService', () => ({
  getExercises: jest.fn().mockResolvedValue([
    { id: '1', name: 'Bench Press' },
    { id: '2', name: 'Squat' },
    { id: '3', name: 'Deadlift' }
  ]),
  addWorkout: jest.fn().mockResolvedValue({ id: '1', name: 'Test Workout' })
}));

// Mock workout templates data
const mockTemplates = [
  {
    id: '1',
    name: 'Upper Body',
    unit: 'kg',
    exercises: [
      {
        name: 'Bench Press',
        sets: [{ weight: 60, reps: 10 }]
      }
    ]
  }
];

// Mock WorkoutTemplateContext wrapper
const MockWorkoutTemplateProvider = ({ children }) => (
  <WorkoutTemplateContext.Provider value={{ templates: mockTemplates }}>
    {children}
  </WorkoutTemplateContext.Provider>
);

describe('WorkoutForm', () => {
  const mockOnSubmit = jest.fn();

  const renderWithContext = (ui) => {
    return render(
      <MockWorkoutTemplateProvider>
        {ui}
      </MockWorkoutTemplateProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders the form with default values', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Check initial date value (today's date in ISO format)
    const dateInput = screen.getByLabelText(/date/i);
    expect(dateInput.value).toBe('2023-01-01');
    
    // Check initial weight unit selection
    const unitSelect = screen.getByLabelText(/weight unit/i);
    expect(unitSelect.value).toBe('kg');
    
    // Check if there's an initial empty exercise select
    const exerciseSelect = screen.getByLabelText(/exercise name/i);
    expect(exerciseSelect).toBeInTheDocument();
    expect(exerciseSelect.value).toBe('');
    
    // Wait for exercises to be fetched
    await waitFor(() => {
      expect(getExercises).toHaveBeenCalled();
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Exercise select should no longer be disabled
    await waitFor(() => {
      expect(exerciseSelect).not.toBeDisabled();
    });
  });

  test('adds an exercise when "Add Exercise" button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Initially there should be 1 exercise
    let exerciseSelects = screen.getAllByLabelText(/exercise name/i);
    expect(exerciseSelects.length).toBe(1);
    
    // Click the Add Exercise button
    await act(async () => {
      userEvent.click(screen.getByText(/add exercise/i));
    });
    
    // Now there should be 2 exercises
    exerciseSelects = screen.getAllByLabelText(/exercise name/i);
    expect(exerciseSelects.length).toBe(2);
  });

  test('removes an exercise when "Remove" button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Add another exercise first
    await act(async () => {
      userEvent.click(screen.getByText(/add exercise/i));
    });
    
    // Now there should be 2 exercises
    let exerciseSelects = screen.getAllByLabelText(/exercise name/i);
    expect(exerciseSelects.length).toBe(2);
    
    // Click the Remove button on the second exercise
    const removeButtons = screen.getAllByText(/remove/i);
    await act(async () => {
      userEvent.click(removeButtons[0]); // There might be multiple remove buttons in the form
    });
    
    // Now there should be 1 exercise again
    exerciseSelects = screen.getAllByLabelText(/exercise name/i);
    expect(exerciseSelects.length).toBe(1);
  });

  test('adds a set when "Add Set" button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Initially there should be 1 set
    let setElements = screen.getAllByRole('cell', { name: /^set \d+$/i });
    expect(setElements.length).toBe(1);
    
    // Click the Add Set button
    await act(async () => {
      userEvent.click(screen.getByText(/add set/i));
    });
    
    // Now there should be 2 sets
    setElements = screen.getAllByRole('cell', { name: /^set \d+$/i });
    expect(setElements.length).toBe(2);
  });

  test('removes a set when remove button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Add another set first
    await act(async () => {
      userEvent.click(screen.getByText(/add set/i));
    });
    
    // Now there should be 2 sets
    let setElements = screen.getAllByRole('cell', { name: /^set \d+$/i });
    expect(setElements.length).toBe(2);
    
    // Click the Remove button on the second set
    const removeSetButtons = screen.getAllByRole('button', { name: /remove set/i });
    await act(async () => {
      userEvent.click(removeSetButtons[0]);
    });
    
    // Now there should be 1 set
    setElements = screen.getAllByRole('cell', { name: /^set \d+$/i });
    expect(setElements.length).toBe(1);
  });

  test('submits the form with valid input', async () => {
    mockOnSubmit.mockResolvedValue({ success: true });
    
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Fill out the form
    // Workout name
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/e\.g\., upper body, leg day/i), 'Test Workout');
    });
    
    // Exercise name
    await act(async () => {
      const exerciseSelect = screen.getByLabelText(/exercise name/i);
      userEvent.selectOptions(exerciseSelect, 'Bench Press');
    });
    
    // Weight and reps
    const weightInput = screen.getByPlaceholderText('Weight');
    const repsInput = screen.getByPlaceholderText('Reps');
    
    await act(async () => {
      userEvent.clear(weightInput);
      userEvent.type(weightInput, '100');
    });
    
    await act(async () => {
      userEvent.clear(repsInput);
      userEvent.type(repsInput, '5');
    });
    
    // Submit the form
    await act(async () => {
      userEvent.click(screen.getByText(/log workout/i));
    });
    
    await waitFor(() => {
      // Check if onSubmit was called with the right data
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      const submittedData = mockOnSubmit.mock.calls[0][0];
      
      expect(submittedData.name).toBe('Test Workout');
      expect(submittedData.unit).toBe('kg');
      expect(submittedData.exercises.length).toBe(1);
      expect(submittedData.exercises[0].name).toBe('Bench Press');
      expect(submittedData.exercises[0].sets[0].weight).toBe(100);
      expect(submittedData.exercises[0].sets[0].reps).toBe(5);
    });
  });

  test('shows error when submitting without required fields', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Submit without filling out required fields
    await act(async () => {
      userEvent.click(screen.getByText(/log workout/i));
    });
    
    // There should be an error message
    expect(screen.getByText(/please add at least one exercise/i)).toBeInTheDocument();
  });

  test('shows success message after successful submission', async () => {
    mockOnSubmit.mockResolvedValue({ success: true });
    
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Fill out the form
    // Exercise name
    await act(async () => {
      const exerciseSelect = screen.getByLabelText(/exercise name/i);
      userEvent.selectOptions(exerciseSelect, 'Bench Press');
    });
    
    // Weight and reps
    const weightInput = screen.getByPlaceholderText('Weight');
    const repsInput = screen.getByPlaceholderText('Reps');
    
    await act(async () => {
      userEvent.clear(weightInput);
      userEvent.type(weightInput, '100');
    });
    
    await act(async () => {
      userEvent.clear(repsInput);
      userEvent.type(repsInput, '5');
    });
    
    // Submit the form
    await act(async () => {
      userEvent.click(screen.getByText(/log workout/i));
    });
    
    // There should be a success message
    expect(screen.getByText(/workout logged successfully/i)).toBeInTheDocument();
  });

  test('loads workout template when selected', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fast-forward past the loading delay
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    // Select a template
    await act(async () => {
      userEvent.selectOptions(
        screen.getByLabelText(/load from template/i),
        '1'
      );
    });
    
    // Check that the form is populated with the template data
    expect(screen.getByLabelText(/workout name/i).value).toBe('Upper Body');
    expect(screen.getByLabelText(/weight unit/i).value).toBe('kg');
    
    // Check that the exercises are populated
    const exerciseSelects = screen.getAllByLabelText(/exercise name/i);
    expect(exerciseSelects.length).toBe(1);
    expect(exerciseSelects[0].value).toBe('Bench Press');
    
    // Check set data
    const weightInput = screen.getByPlaceholderText('Weight');
    const repsInput = screen.getByPlaceholderText('Reps');
    expect(weightInput.value).toBe('60');
    expect(repsInput.value).toBe('10');
  });
});