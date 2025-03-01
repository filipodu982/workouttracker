import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutProvider, useWorkoutContext } from '../WorkoutContext';
import { AuthProvider } from '../AuthContext';
import { supabase } from '../../supabase/supabase';

// Mock the Supabase client
jest.mock('../../supabase/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [
          { id: '1', name: 'Upper Body' },
          { id: '2', name: 'Lower Body' }
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

// Mock the firestoreService
jest.mock('../../supabase/firestoreService', () => ({
  getUserWorkouts: jest.fn().mockResolvedValue([
    { id: '1', name: 'Upper Body' },
    { id: '2', name: 'Lower Body' }
  ]),
  deleteWorkout: jest.fn(),
  getExercises: jest.fn().mockResolvedValue([
    { id: '1', name: 'Bench Press' },
    { id: '2', name: 'Squat' },
    { id: '3', name: 'Deadlift' }
  ]),
  addWorkout: jest.fn()
}));

// Test component that uses the workout context
const TestComponent = () => {
  const { workouts, loading, error, addWorkout } = useWorkoutContext();
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <ul>
        {workouts.map(workout => (
          <li key={workout.id}>{workout.name}</li>
        ))}
      </ul>
      <button onClick={() => addWorkout({ name: 'New Workout' }).catch(() => {})}>Add Workout</button>
    </div>
  );
};

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <WorkoutProvider>
        {ui}
      </WorkoutProvider>
    </AuthProvider>
  );
};

describe('WorkoutContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should show loading state initially', () => {
    // Mock getUserWorkouts to never resolve
    const { getUserWorkouts } = require('../../supabase/firestoreService');
    getUserWorkouts.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<TestComponent />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should load and display workouts', async () => {
    const mockWorkouts = [
      { id: '1', name: 'Upper Body' },
      { id: '2', name: 'Lower Body' }
    ];
    
    // Mock getUserWorkouts to return workouts
    const { getUserWorkouts } = require('../../supabase/firestoreService');
    getUserWorkouts.mockResolvedValue(mockWorkouts);
    
    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
      expect(screen.getByText('Lower Body')).toBeInTheDocument();
    });
  });

  test('should handle errors when loading workouts', async () => {
    // Mock getUserWorkouts to throw error
    const { getUserWorkouts } = require('../../supabase/firestoreService');
    getUserWorkouts.mockRejectedValue(new Error('Failed to load workouts'));
    
    renderWithProviders(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByText(/error: failed to load workouts/i)).toBeInTheDocument();
    });
  });

  test('should add a new workout', async () => {
    const mockWorkouts = [{ id: '1', name: 'Upper Body' }];
    const newWorkout = { id: '2', name: 'New Workout' };
    
    // Mock getUserWorkouts and addWorkout
    const { getUserWorkouts, addWorkout } = require('../../supabase/firestoreService');
    getUserWorkouts.mockResolvedValue(mockWorkouts);
    addWorkout.mockResolvedValue(newWorkout);
    
    renderWithProviders(<TestComponent />);
    
    // Wait for initial workouts to load
    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
    });
    
    // Click add workout button
    await act(async () => {
      userEvent.click(screen.getByText('Add Workout'));
    });
    
    // Wait for new workout to appear
    await waitFor(() => {
      expect(screen.getByText('New Workout')).toBeInTheDocument();
    });
  });

  test('should handle errors when adding workout', async () => {
    // Mock console.error
    jest.spyOn(console, 'error');

    // Mock getUserWorkouts and addWorkout
    const { getUserWorkouts, addWorkout } = require('../../supabase/firestoreService');
    getUserWorkouts.mockResolvedValue([{ id: '1', name: 'Upper Body' }]);
    addWorkout.mockRejectedValue(new Error('Failed to add workout'));

    renderWithProviders(<TestComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Upper Body')).toBeInTheDocument();
    });

    // Click add workout button
    const addButton = screen.getByText('Add Workout');
    await act(async () => {
      await userEvent.click(addButton);
    });

    // Verify error is logged to console and error message is displayed
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error adding workout:', expect.any(Error));
      expect(screen.getByText(/failed to add workout/i)).toBeInTheDocument();
    });
  });
});
