import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutProvider, useWorkouts } from '../WorkoutContext';
import { getWorkouts, addWorkout, updateWorkout, deleteWorkout } from '../../firebase/firestore';

// Mock the firestore module
jest.mock('../../firebase/firestore', () => ({
  getWorkouts: jest.fn(),
  addWorkout: jest.fn(),
  updateWorkout: jest.fn(),
  deleteWorkout: jest.fn()
}));

// Test component that uses the workout context
const TestComponent = () => {
  const { workouts, loading, error, addWorkout: addWorkoutFn } = useWorkouts();
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {workouts.map(workout => (
          <li key={workout.id}>{workout.name}</li>
        ))}
      </ul>
      <button onClick={() => addWorkoutFn({ name: 'New Workout' })}>Add Workout</button>
    </div>
  );
};

describe('WorkoutContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should show loading state initially', () => {
    getWorkouts.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should load and display workouts', async () => {
    const mockWorkouts = [
      { id: '1', name: 'Upper Body' },
      { id: '2', name: 'Lower Body' }
    ];
    
    getWorkouts.mockResolvedValue(mockWorkouts);
    
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
      expect(screen.getByText('Lower Body')).toBeInTheDocument();
    });
  });

  test('should handle errors when loading workouts', async () => {
    getWorkouts.mockRejectedValue(new Error('Failed to load workouts'));
    
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error: failed to load workouts/i)).toBeInTheDocument();
    });
  });

  test('should add a new workout', async () => {
    const mockWorkouts = [{ id: '1', name: 'Upper Body' }];
    getWorkouts.mockResolvedValue(mockWorkouts);
    addWorkout.mockResolvedValue({ id: '2', name: 'New Workout' });
    
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    
    // Wait for initial workouts to load
    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
    });
    
    // Click add workout button
    userEvent.click(screen.getByText('Add Workout'));
    
    // Wait for new workout to appear
    await waitFor(() => {
      expect(screen.getByText('New Workout')).toBeInTheDocument();
    });
    
    expect(addWorkout).toHaveBeenCalledWith({ name: 'New Workout' });
  });

  test('should handle errors when adding workout', async () => {
    const mockWorkouts = [{ id: '1', name: 'Upper Body' }];
    getWorkouts.mockResolvedValue(mockWorkouts);
    addWorkout.mockRejectedValue(new Error('Failed to add workout'));
    
    render(
      <WorkoutProvider>
        <TestComponent />
      </WorkoutProvider>
    );
    
    // Wait for initial workouts to load
    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
    });
    
    // Click add workout button
    userEvent.click(screen.getByText('Add Workout'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/error: failed to add workout/i)).toBeInTheDocument();
    });
  });
});
