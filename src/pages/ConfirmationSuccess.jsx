// src/pages/ConfirmationSuccess.jsx
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabase';

const ConfirmationSuccess = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Handle the hash fragment from the confirmation URL
    const handleHashFragment = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        try {
          // Supabase will automatically handle the token
          const { data, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (data?.session) {
            // If we have a session, redirect to dashboard
            navigate('/');
          }
        } catch (error) {
          console.error('Error processing confirmation:', error);
        }
      }
    };
    
    handleHashFragment();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <svg 
          className="mx-auto h-16 w-16 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M5 13l4 4L19 7" 
          />
        </svg>
        
        <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
          Email Confirmed!
        </h2>
        
        <p className="mt-2 text-gray-600">
          Your email has been confirmed successfully. You can now log in.
        </p>
        
        <div className="mt-6">
          <Link
            to="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationSuccess;