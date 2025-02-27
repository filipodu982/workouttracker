// src/hooks/useOneRepMax.js
import { useState, useEffect } from 'react';
import { 
  calculateOneRepMax, 
  calculateWeightForPercentage,
  calculateRepsForWeight
} from '../utils/calculations';

const useOneRepMax = (initialWeight = 0, initialReps = 0) => {
  const [weight, setWeight] = useState(initialWeight);
  const [reps, setReps] = useState(initialReps);
  const [oneRM, setOneRM] = useState(0);
  const [percentages, setPercentages] = useState([]);

  // Default percentages to calculate
  const defaultPercentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

  useEffect(() => {
    if (weight > 0 && reps > 0) {
      // Calculate 1RM
      const calculatedOneRM = calculateOneRepMax(parseFloat(weight), parseInt(reps, 10));
      setOneRM(calculatedOneRM);
      
      // Calculate weights for various percentages
      const percentageData = defaultPercentages.map(percentage => {
        const calculatedWeight = calculateWeightForPercentage(calculatedOneRM, percentage);
        const estimatedReps = calculateRepsForWeight(calculatedOneRM, calculatedWeight);
        
        return {
          percentage,
          weight: calculatedWeight,
          reps: estimatedReps
        };
      });
      
      setPercentages(percentageData);
    } else {
      setOneRM(0);
      setPercentages([]);
    }
  }, [weight, reps]);

  // Calculate 1RM for a given weight and reps
  const calculate = (weightValue, repsValue) => {
    setWeight(weightValue);
    setReps(repsValue);
  };

  // Reset calculations
  const reset = () => {
    setWeight(0);
    setReps(0);
    setOneRM(0);
    setPercentages([]);
  };

  // Get weight needed for a specific percentage of 1RM
  const getWeightForPercentage = (percentage) => {
    return calculateWeightForPercentage(oneRM, percentage);
  };

  // Get estimated reps for a given weight based on 1RM
  const getRepsForWeight = (weightValue) => {
    return calculateRepsForWeight(oneRM, weightValue);
  };

  return {
    weight,
    reps,
    oneRM,
    percentages,
    setWeight,
    setReps,
    calculate,
    reset,
    getWeightForPercentage,
    getRepsForWeight
  };
};

export default useOneRepMax;