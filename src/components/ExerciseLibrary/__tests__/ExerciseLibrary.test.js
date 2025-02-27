// src/components/ExerciseLibrary/__tests__/ExerciseCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseCard from '../ExerciseCard';

describe('ExerciseCard', () => {
  const mockExercise = {
    name: 'Barbell Bench Press',
    primaryMuscleGroup: 'Chest',
    secondaryMuscleGroups: ['Triceps', 'Shoulders'],
    equipment: 'Barbell',
    difficulty: 'Beginner',
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    instructions: [
      'Lie on a flat bench with your feet planted firmly on the ground.',
      'Grip the barbell slightly wider than shoulder-width apart.',
      'Unrack the barbell and lower it to your mid-chest.',
      'Press the barbell back up to the starting position.',
      'Repeat for the desired number of repetitions.'
    ],
    tips: [
      'Keep your wrists straight throughout the movement.',
      'Maintain a slight arch in your lower back.',
      'Keep your feet planted and drive through your legs for stability.'
    ]
  };

  test('renders basic exercise information', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    
    expect(screen.getByText('Barbell Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Barbell')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('A compound exercise that targets the chest, shoulders, and triceps.')).toBeInTheDocument();
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  test('expands to show details when "Show Details" is clicked', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    
    // Details should be hidden initially
    expect(screen.queryByText('Secondary Muscles')).not.toBeInTheDocument();
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
    expect(screen.queryByText('Tips')).not.toBeInTheDocument();
    
    // Click the show details button
    fireEvent.click(screen.getByText('Show Details'));
    
    // Now details should be visible
    expect(screen.getByText('Secondary Muscles')).toBeInTheDocument();
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();
    
    // Check if specific instruction items are rendered
    expect(screen.getByText('Lie on a flat bench with your feet planted firmly on the ground.')).toBeInTheDocument();
    
    // Check if secondary muscles are rendered
    expect(screen.getByText('Triceps')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
    
    // Check if tips are rendered
    expect(screen.getByText('Keep your wrists straight throughout the movement.')).toBeInTheDocument();
  });

  test('collapses details when "Hide Details" is clicked', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    
    // Expand details
    fireEvent.click(screen.getByText('Show Details'));
    expect(screen.getByText('Secondary Muscles')).toBeInTheDocument();
    
    // Now hide details
    fireEvent.click(screen.getByText('Hide Details'));
    
    // Details should be hidden again
    expect(screen.queryByText('Secondary Muscles')).not.toBeInTheDocument();
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
    expect(screen.queryByText('Tips')).not.toBeInTheDocument();
  });

  test('handles exercise with missing optional fields', () => {
    const minimalExercise = {
      name: 'Pull-Up',
      primaryMuscleGroup: 'Back',
      equipment: 'Pull-Up Bar',
      difficulty: 'Intermediate',
      description: 'A bodyweight exercise for back development.'
      // No secondaryMuscleGroups, instructions, or tips
    };
    
    render(<ExerciseCard exercise={minimalExercise} />);
    
    expect(screen.getByText('Pull-Up')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    
    // Expand details
    fireEvent.click(screen.getByText('Show Details'));
    
    // Only sections with content should appear
    expect(screen.queryByText('Secondary Muscles')).not.toBeInTheDocument();
    expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
    expect(screen.queryByText('Tips')).not.toBeInTheDocument();
  });

  test('applies correct color for different difficulty levels', () => {
    // Test beginner difficulty
    render(<ExerciseCard exercise={mockExercise} />);
    
    // Get the span containing the difficulty text
    const beginnerSpan = screen.getByText('Beginner').closest('span');
    expect(beginnerSpan).toHaveClass('bg-green-100');
    expect(beginnerSpan).toHaveClass('text-green-800');
    
    // Test intermediate difficulty
    const intermediateExercise = {
      ...mockExercise,
      difficulty: 'Intermediate'
    };
    
    const { rerender } = render(<ExerciseCard exercise={intermediateExercise} />);
    
    const intermediateSpan = screen.getByText('Intermediate').closest('span');
    expect(intermediateSpan).toHaveClass('bg-yellow-100');
    expect(intermediateSpan).toHaveClass('text-yellow-800');
    
    // Test advanced difficulty
    const advancedExercise = {
      ...mockExercise,
      difficulty: 'Advanced'
    };
    
    rerender(<ExerciseCard exercise={advancedExercise} />);
    
    const advancedSpan = screen.getByText('Advanced').closest('span');
    expect(advancedSpan).toHaveClass('bg-red-100');
    expect(advancedSpan).toHaveClass('text-red-800');
  });
});