// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is stored in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Important: Also set the user in the auth object
      auth.currentUser = user;
    }
    setLoading(false);
  }, []);

  // Register a new user
  const signup = (email, password, displayName) => {
    return new Promise((resolve, reject) => {
      try {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(user => user.email === email);
        
        if (existingUser) {
          const error = { code: 'auth/email-already-in-use' };
          reject(error);
          return;
        }

        // Create new user
        const newUser = {
          uid: Date.now().toString(),
          email,
          displayName,
          createdAt: new Date().toISOString()
        };
        
        // Add to users list
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as current user in both state and auth
        localStorage.setItem('user', JSON.stringify(newUser));
        setCurrentUser(newUser);
        auth.currentUser = newUser; // Set in auth object
        
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Login existing user
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(user => user.email === email);
        
        if (!user) {
          const error = { code: 'auth/invalid-credential' };
          reject(error);
          return;
        }
        
        // Set as current user in both state and auth
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        auth.currentUser = user; // Set in auth object
        
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    auth.currentUser = null; // Clear in auth object
    return Promise.resolve();
  };

  // Update user profile
  const updateProfile = (user, profileData) => {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(u => {
          if (u.uid === user.uid) {
            const updatedUser = { ...u, ...profileData };
            return updatedUser;
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update current user if it's the same user
        if (currentUser && currentUser.uid === user.uid) {
          const updatedUser = { ...currentUser, ...profileData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          auth.currentUser = updatedUser; // Update in auth object
        }
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;