// src/components/WorkoutLogger/__tests__/WorkoutForm.test.js
import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutForm from '../WorkoutForm';
import { getExercises } from '../../../firebase/firestore';
import WorkoutTemplateContext from '../../../context/WorkoutTemplateContext';

// Mock the firestore module
jest.mock('../../../firebase/firestore', () => ({
  getExercises: jest.fn().mockResolvedValue([
    { id: '1', name: 'Bench Press' },
    { id: '2', name: 'Squat' },
    { id: '3', name: 'Deadlift' }
  ])
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
    
    // Mock the Date object to return a fixed date
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
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
    
    // Check if there's an initial empty exercise
    expect(screen.getByPlaceholderText(/e\.g\., bench press, squat/i)).toBeInTheDocument();
    
    // Wait for exercises to be fetched
    await waitFor(() => {
      expect(getExercises).toHaveBeenCalled();
    });
  });

  test('adds an exercise when "Add Exercise" button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Initially there should be 1 exercise
    let exerciseInputs = screen.getAllByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInputs.length).toBe(1);
    
    // Click the Add Exercise button
    await act(async () => {
      userEvent.click(screen.getByText(/add exercise/i));
    });
    
    // Now there should be 2 exercises
    exerciseInputs = screen.getAllByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInputs.length).toBe(2);
  });

  test('removes an exercise when "Remove" button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Add a second exercise first
    await act(async () => {
      userEvent.click(screen.getByText(/add exercise/i));
    });
    
    // Get remove buttons
    const removeButtons = screen.getAllByText(/remove/i);
    expect(removeButtons.length).toBe(2);
    
    // Click the first remove button
    await act(async () => {
      userEvent.click(removeButtons[0]);
    });
    
    // Now there should be 1 exercise
    const exerciseInputs = screen.getAllByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInputs.length).toBe(1);
  });

  test('adds a set when "Add Set" button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Initially there should be 1 set
    let setLabels = screen.getAllByText(/^set 1$/i);
    expect(setLabels.length).toBe(1);
    
    // Click the Add Set button
    await act(async () => {
      userEvent.click(screen.getByText(/add set/i));
    });
    
    // Now there should be 2 sets
    // Use a more specific selector to get only the set labels
    const setElements = screen.getAllByRole('cell', { name: /^set \d+$/i });
    expect(setElements.length).toBe(2);
    expect(screen.getByText(/^set 2$/i)).toBeInTheDocument();
  });

  test('removes a set when remove button is clicked', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Add a second set first
    await act(async () => {
      userEvent.click(screen.getByText(/add set/i));
    });
    
    // Check that we have 2 sets
    let setElements = screen.getAllByRole('cell', { name: /^set \d+$/i });
    expect(setElements.length).toBe(2);
    
    // Get remove set buttons (they have a trash icon)
    const removeSetButtons = screen.getAllByTitle('Remove set');
    expect(removeSetButtons.length).toBe(2);
    
    // Click the first remove button
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
    
    // Fill out the form
    // Workout name
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/e\.g\., upper body, leg day/i), 'Test Workout');
    });
    
    // Exercise name
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/e\.g\., bench press, squat/i), 'Bench Press');
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
      expect(submittedData.exercises[0].sets.length).toBe(1);
      expect(submittedData.exercises[0].sets[0].weight).toBe(100);
      expect(submittedData.exercises[0].sets[0].reps).toBe(5);
    });
  });

  test('shows error when submitting without required fields', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Submit the form without filling any fields
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: /log workout/i }));
    });
    
    // Check if error message appears
    await waitFor(() => {
      expect(screen.getByText(/please add at least one exercise/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Fill exercise name but not sets data
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/e\.g\., bench press, squat/i), 'Bench Press');
    });
    
    // Try submitting again
    await act(async () => {
      userEvent.click(screen.getByRole('button', { name: /log workout/i }));
    });
    
    // Check if error message about sets appears
    await waitFor(() => {
      expect(screen.getByText(/please add at least one set for bench press/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('shows success message after successful submission', async () => {
    // Mock the onSubmit to return a success result
    mockOnSubmit.mockResolvedValue({ success: true });
    
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Fill out the form
    await act(async () => {
      userEvent.type(screen.getByPlaceholderText(/e\.g\., bench press, squat/i), 'Bench Press');
    });
    
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
    
    // Check if success message appears
    await waitFor(() => {
      expect(screen.getByText(/workout logged successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // Add test for template selection
  test('loads workout template when selected', async () => {
    await act(async () => {
      renderWithContext(<WorkoutForm onSubmit={mockOnSubmit} />);
    });
    
    // Select the template
    await act(async () => {
      userEvent.selectOptions(screen.getByLabelText(/load from template/i), '1');
    });
    
    // Check if template data is loaded
    expect(screen.getByLabelText(/workout name/i).value).toBe('Upper Body');
    expect(screen.getByLabelText(/weight unit/i).value).toBe('kg');
    
    // Check exercise data
    const exerciseInput = screen.getByPlaceholderText(/e\.g\., bench press, squat/i);
    expect(exerciseInput.value).toBe('Bench Press');
    
    // Check set data
    const weightInput = screen.getByPlaceholderText('Weight');
    const repsInput = screen.getByPlaceholderText('Reps');
    expect(weightInput.value).toBe('60');
    expect(repsInput.value).toBe('10');
  });
});