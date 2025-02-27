// src/components/ExerciseLibrary/ExerciseCard.jsx
import React, { useState } from 'react';

const ExerciseCard = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get background color based on difficulty
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{exercise.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
        
        <div className="mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
            {exercise.primaryMuscleGroup}
          </span>
          {exercise.equipment && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-2">
              {exercise.equipment}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
        
        <button
          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center"
          onClick={toggleExpanded}
        >
          {expanded ? 'Hide Details' : 'Show Details'}
          <svg
            className={`ml-1 w-4 h-4 transition-transform duration-200 ${expanded ? 'transform rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          {exercise.secondaryMuscleGroups && exercise.secondaryMuscleGroups.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Secondary Muscles</h4>
              <div>
                {exercise.secondaryMuscleGroups.map((muscle, index) => (
                  <span key={index} className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded mr-2 mb-1">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Instructions</h4>
              <ol className="list-decimal list-outside text-sm text-gray-600 pl-4 space-y-1">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          )}
          
          {exercise.tips && exercise.tips.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Tips</h4>
              <ul className="list-disc list-outside text-sm text-gray-600 pl-4 space-y-1">
                {exercise.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;