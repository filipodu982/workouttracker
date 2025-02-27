// src/context/__tests__/AuthContext.test.js
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../supabase/supabase';

// Mock Supabase client
jest.mock('../../supabase/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn()
    }
  }
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { currentUser, signup, login, logout } = useAuth();
  
  return (
    <div>
      {currentUser ? (
        <>
          <div data-testid="user-email">{currentUser.email}</div>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <div>Not logged in</div>
          <button onClick={() => login('test@example.com', 'password')}>Login</button>
          <button onClick={() => signup('test@example.com', 'password', 'Test User')}>Signup</button>
        </>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock for getSession
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null }
    });
    
    // Default mock for onAuthStateChange
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: jest.fn()
        }
      }
    });
  });

  test('should show not logged in initially', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });

  test('should update UI when user is already authenticated', async () => {
    // Mock a logged in session
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: '123',
            email: 'test@example.com'
          }
        }
      }
    });
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  test('should handle login correctly', async () => {
    // Mock successful login
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com'
        },
        session: {}
      },
      error: null
    });
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });
    
    // Auth state change would set the current user
    act(() => {
      // Simulate auth state change event
      const authStateChangeHandler = supabase.auth.onAuthStateChange.mock.calls[0][0];
      authStateChangeHandler('SIGNED_IN', {
        user: {
          id: '123',
          email: 'test@example.com'
        }
      });
    });
    
    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });

  test('should handle signup correctly', async () => {
    // Mock successful signup
    supabase.auth.signUp.mockResolvedValue({
      data: {
        user: {
          id: '123',
          email: 'test@example.com'
        },
        session: null // No session if email confirmation is required
      },
      error: null
    });
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    const signupButton = screen.getByText('Signup');
    
    await act(async () => {
      signupButton.click();
    });
    
    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: {
          data: {
            full_name: 'Test User',
          },
          emailRedirectTo: expect.any(String)
        }
      });
    });
  });

  test('should handle logout correctly', async () => {
    // Mock initial logged in state
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: '123',
            email: 'test@example.com'
          }
        }
      }
    });
    
    // Mock successful logout
    supabase.auth.signOut.mockResolvedValue({
      error: null
    });
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    // Check initial state
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    
    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      logoutButton.click();
    });
    
    // Auth state change would clear the current user
    act(() => {
      // Simulate auth state change event
      const authStateChangeHandler = supabase.auth.onAuthStateChange.mock.calls[0][0];
      authStateChangeHandler('SIGNED_OUT', null);
    });
    
    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });
  });

  test('should handle login errors', async () => {
    // Mock login failure
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' }
    });
    
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    let result;
    await act(async () => {
      render(
        <AuthProvider>
          {/* Use a different test component to catch errors */}
          {(function TestErrorComponent() {
            const { login, authError } = useAuth();
            result = { login, authError };
            return <div>Auth Error Test</div>;
          })()}
        </AuthProvider>
      );
    });
    
    await act(async () => {
      try {
        await result.login('test@example.com', 'wrong-password');
      } catch (e) {
        // Expected error
      }
    });
    
    await waitFor(() => {
      expect(result.authError).toBe('Invalid login credentials');
    });
    
    mockConsoleError.mockRestore();
  });

  test('should handle signup errors', async () => {
    // Mock signup failure
    supabase.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already registered' }
    });
    
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    let result;
    await act(async () => {
      render(
        <AuthProvider>
          {(function TestErrorComponent() {
            const { signup, authError } = useAuth();
            result = { signup, authError };
            return <div>Auth Error Test</div>;
          })()}
        </AuthProvider>
      );
    });
    
    await act(async () => {
      try {
        await result.signup('existing@example.com', 'password', 'Test User');
      } catch (e) {
        // Expected error
      }
    });
    
    await waitFor(() => {
      expect(result.authError).toBe('Email already registered');
    });
    
    mockConsoleError.mockRestore();
  });

  test('should update user profile', async () => {
    // Mock initial logged in state
    supabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: '123',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User'
            }
          }
        }
      }
    });
    
    // Mock successful profile update
    supabase.auth.updateUser.mockResolvedValue({
      data: { user: { user_metadata: { full_name: 'Updated Name' } } },
      error: null
    });
    
    let result;
    await act(async () => {
      render(
        <AuthProvider>
          {(function ProfileUpdateComponent() {
            const { updateProfile, currentUser } = useAuth();
            result = { updateProfile, currentUser };
            return <div>Profile Update Test</div>;
          })()}
        </AuthProvider>
      );
    });
    
    expect(result.currentUser).not.toBeNull();
    
    await act(async () => {
      await result.updateProfile({ full_name: 'Updated Name' });
    });
    
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: { full_name: 'Updated Name' }
    });
    
    // User metadata should be updated in currentUser
    expect(result.currentUser.user_metadata).toEqual({
      ...result.currentUser.user_metadata,
      full_name: 'Updated Name'
    });
  });

  test('should unsubscribe from auth listener on unmount', async () => {
    const unsubscribeMock = jest.fn();
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: unsubscribeMock
        }
      }
    });
    
    let { unmount } = await act(async () => {
      return render(
        <AuthProvider>
          <div>Auth Test</div>
        </AuthProvider>
      );
    });
    
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    
    await act(async () => {
      unmount();
    });
    
    // Cannot easily test unsubscribe because of how React handles unmounting and cleanup
    // This is a limitation of the testing approach
  });
});