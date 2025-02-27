// src/components/Calculators/OneRepMaxCalculator.jsx
import React, { useState, useEffect } from 'react';
import { 
  calculateOneRepMax, 
  calculateWeightForPercentage,
  calculateRepsForWeight,
  getIntensityColor
} from '../../utils/calculations';

const OneRepMaxCalculator = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRM, setOneRM] = useState(0);
  const [unit, setUnit] = useState('kg');
  const [percentages, setPercentages] = useState([]);

  // Default percentages to show
  const defaultPercentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

  useEffect(() => {
    if (weight > 0 && reps > 0) {
      const calculatedOneRM = calculateOneRepMax(parseFloat(weight), parseInt(reps, 10));
      setOneRM(calculatedOneRM);
      
      // Calculate weights for various percentages
      const percentageData = defaultPercentages.map(percentage => {
        const calculatedWeight = calculateWeightForPercentage(calculatedOneRM, percentage);
        const estimatedReps = calculateRepsForWeight(calculatedOneRM, calculatedWeight);
        
        return {
          percentage,
          weight: calculatedWeight,
          reps: estimatedReps,
          color: getIntensityColor(percentage)
        };
      });
      
      setPercentages(percentageData);
    } else {
      setOneRM(0);
      setPercentages([]);
    }
  }, [weight, reps]);

  const handleReset = () => {
    setWeight('');
    setReps('');
    setOneRM(0);
    setPercentages([]);
  };

  // Get intensity label based on percentage
  const getIntensityLabel = (percentage) => {
    if (percentage >= 90) return 'Very Heavy';
    if (percentage >= 80) return 'Heavy';
    if (percentage >= 70) return 'Moderate to Heavy';
    if (percentage >= 60) return 'Moderate';
    if (percentage >= 50) return 'Light to Moderate';
    return 'Light';
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">One Rep Max Calculator</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-5">
              <label className="form-label">
                Weight Lifted
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Enter weight"
                  className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-primary focus:border-primary-light"
                  min="0"
                  step="0.5"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="p-2 border-t border-r border-b rounded-r bg-gray-50"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="form-label">
                Repetitions Performed
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Enter reps"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary-light"
                min="1"
                max="36"
                step="1"
              />
              <div className="text-xs text-gray-500 mt-1">
                For accurate results, enter reps between 1-36
              </div>
            </div>
            
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
              >
                Reset
              </button>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Estimated 1RM</h3>
                <div className="text-4xl font-bold text-primary">
                  {oneRM > 0 ? `${oneRM} ${unit}` : '-'}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Based on {weight} {unit} × {reps} reps
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {percentages.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Percentage Chart</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left border-b font-semibold text-gray-700">% of 1RM</th>
                      <th className="py-2 px-3 text-left border-b font-semibold text-gray-700">Weight ({unit})</th>
                      <th className="py-2 px-3 text-left border-b font-semibold text-gray-700">Est. Reps</th>
                      <th className="py-2 px-3 text-left border-b font-semibold text-gray-700">Intensity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {percentages.map((item) => (
                      <tr key={item.percentage} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border-b text-gray-800">
                          {item.percentage}%
                        </td>
                        <td className="py-2 px-3 border-b font-medium text-gray-800">
                          {item.weight}
                        </td>
                        <td className="py-2 px-3 border-b text-gray-800">
                          {item.reps}
                        </td>
                        <td className="py-2 px-3 border-b">
                          <span 
                            className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: item.color + '33', color: item.color }}
                          >
                            {getIntensityLabel(item.percentage)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>This chart shows recommended weights based on your estimated 1RM. Use it for planning your working sets at different intensities.</p>
              </div>
            </div>
          )}
          
          {!percentages.length && (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Enter weight and reps</h3>
              <p className="text-gray-500">Enter the weight lifted and number of repetitions performed to calculate your estimated one-rep max (1RM).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OneRepMaxCalculator;