import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { AuthProvider, useAuth } from './context/AuthContext';
import initializeDatabaseWithSampleData from './utils/initializeDatabase';

// Mock the auth context
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: jest.fn()
}));

// Mock the database initialization
jest.mock('./utils/initializeDatabase', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('shows loading state initially', async () => {
    // Mock auth context with loading state
    useAuth.mockReturnValue({
      currentUser: null,
      loading: true
    });

    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', async () => {
    // Mock auth context with no user
    useAuth.mockReturnValue({
      currentUser: null,
      loading: false
    });

    render(<App />);
    
    // Should be redirected to login
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('shows dashboard when authenticated', async () => {
    // Mock auth context with authenticated user
    useAuth.mockReturnValue({
      currentUser: { id: 'test-user' },
      loading: false
    });

    render(<App />);
    
    // Should show dashboard
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  test('initializes database on first load', async () => {
    useAuth.mockReturnValue({
      currentUser: { id: 'test-user' },
      loading: false
    });

    render(<App />);
    
    await waitFor(() => {
      expect(initializeDatabaseWithSampleData).toHaveBeenCalled();
    });
  });

  test('handles database initialization error gracefully', async () => {
    // Mock database initialization to throw an error
    initializeDatabaseWithSampleData.mockRejectedValue(new Error('Database error'));
    
    useAuth.mockReturnValue({
      currentUser: { id: 'test-user' },
      loading: false
    });

    // Mock console.error to prevent error output in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Setup error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
}); 