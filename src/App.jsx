// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import Dashboard from './components/Dashboard/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import initializeExerciseDatabase from './utils/initializeDatabase';

// Protected route component
const ProtectedRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
};

// Public routes (accessible only when not logged in)
const PublicRoute = ({ element }) => {
  const { currentUser } = useAuth();
  return !currentUser ? element : <Navigate to="/" />;
};

const AppRoutes = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize the exercise database
    initializeExerciseDatabase();
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <WorkoutProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<ProtectedRoute element={<Dashboard />} />} 
          />
          <Route 
            path="/login" 
            element={<PublicRoute element={<Login />} />} 
          />
          <Route 
            path="/register" 
            element={<PublicRoute element={<Register />} />} 
          />
        </Routes>
      </Router>
    </WorkoutProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;