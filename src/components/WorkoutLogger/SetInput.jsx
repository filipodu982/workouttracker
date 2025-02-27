// src/components/WorkoutLogger/SetInput.jsx
import React from 'react';

const SetInput = ({ set, setIndex, onChange, onRemove, canRemove, unit }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-2 text-sm font-medium text-gray-600" role="cell">
        Set {setIndex + 1}
      </div>
      
      <div className="col-span-4">
        <div className="relative">
          <input
            type="number"
            value={set.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            placeholder="Weight"
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
            step="0.5"
            required
            aria-label={`Weight for set ${setIndex + 1}`}
          />
          <div className="absolute right-2 top-2 text-xs text-gray-500">
            {unit}
          </div>
        </div>
      </div>
      
      <div className="col-span-4">
        <div className="relative">
          <input
            type="number"
            value={set.reps}
            onChange={(e) => onChange('reps', e.target.value)}
            placeholder="Reps"
            className="w-full p-2 border border-gray-300 rounded-md"
            min="1"
            step="1"
            required
            aria-label={`Reps for set ${setIndex + 1}`}
          />
          <div className="absolute right-2 top-2 text-xs text-gray-500">
            reps
          </div>
        </div>
      </div>
      
      <div className="col-span-2 flex justify-center">
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 p-1"
            title="Remove set"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SetInput;