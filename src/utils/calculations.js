// src/utils/calculations.js

/**
 * Calculate One Rep Max using the Brzycki formula
 * @param {number} weight - Weight lifted in kg or lbs
 * @param {number} reps - Number of repetitions performed
 * @returns {number} - Estimated 1RM rounded to nearest 0.5
 */
export const calculateOneRepMax = (weight, reps) => {
    if (reps <= 0 || weight <= 0) return 0;
    if (reps === 1) return weight;
    
    // Brzycki formula: weight × (36 / (37 - reps))
    const oneRM = weight * (36 / (37 - reps));
    
    // Round to nearest 0.5
    return Math.round(oneRM * 2) / 2;
  };
  
  /**
   * Calculate the weight needed for a percentage of 1RM
   * @param {number} oneRM - One rep max
   * @param {number} percentage - Percentage of 1RM (e.g., 80 for 80%)
   * @returns {number} - Weight needed for percentage of 1RM
   */
  export const calculateWeightForPercentage = (oneRM, percentage) => {
    if (oneRM <= 0 || percentage <= 0) return 0;
    
    const weight = oneRM * (percentage / 100);
    
    // Round to nearest 0.5
    return Math.round(weight * 2) / 2;
  };
  
  /**
   * Calculate how many reps you should be able to do at a given weight based on 1RM
   * @param {number} oneRM - One rep max
   * @param {number} weight - Weight to calculate reps for
   * @returns {number} - Estimated number of reps
   */
  export const calculateRepsForWeight = (oneRM, weight) => {
    if (oneRM <= 0 || weight <= 0) return 0;
    
    // Inverse of Brzycki formula: 37 - (36 × weight / oneRM)
    const reps = 37 - (36 * weight / oneRM);
    
    // Max out at 36 reps (limitation of the formula)
    return Math.min(Math.max(Math.round(reps), 1), 36);
  };
  
  /**
   * Calculate volume for a workout (sets × reps × weight)
   * @param {Array} sets - Array of objects with reps and weight
   * @returns {number} - Total volume
   */
  export const calculateVolume = (sets) => {
    if (!sets || !sets.length) return 0;
    
    return sets.reduce((total, set) => {
      return total + (set.reps * set.weight);
    }, 0);
  };
  
  /**
   * Return a color code based on percentage of 1RM
   * @param {number} percentage - Percentage of 1RM
   * @returns {string} - Color code
   */
  export const getIntensityColor = (percentage) => {
    if (percentage >= 90) return '#FF4D4D'; // Red - Very Heavy
    if (percentage >= 80) return '#FFA500'; // Orange - Heavy
    if (percentage >= 70) return '#FFFF00'; // Yellow - Moderate to Heavy
    if (percentage >= 60) return '#ADFF2F'; // Green Yellow - Moderate
    if (percentage >= 50) return '#32CD32'; // Green - Light to Moderate
    return '#87CEEB'; // Sky Blue - Light
  };