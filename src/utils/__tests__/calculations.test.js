// src/utils/__tests__/calculations.test.js
const {
    calculateOneRepMax,
    calculateWeightForPercentage,
    calculateRepsForWeight,
    calculateVolume,
    getIntensityColor
  } = require('../calculations');
  
  describe('OneRepMax Calculations', () => {
    // Test calculateOneRepMax function
    describe('calculateOneRepMax', () => {
      test('should calculate 1RM correctly using Brzycki formula', () => {
        // Test with various weight/rep combinations
        expect(calculateOneRepMax(100, 5)).toBeCloseTo(112.5, 1);
        expect(calculateOneRepMax(80, 10)).toBeCloseTo(106.5, 1);
        expect(calculateOneRepMax(200, 3)).toBeCloseTo(212, 1);
      });
  
      test('should return the weight itself when reps is 1', () => {
        expect(calculateOneRepMax(225, 1)).toBe(225);
      });
  
      test('should return 0 when weight or reps are invalid', () => {
        expect(calculateOneRepMax(0, 5)).toBe(0);
        expect(calculateOneRepMax(100, 0)).toBe(0);
        expect(calculateOneRepMax(0, 0)).toBe(0);
        expect(calculateOneRepMax(-100, 5)).toBe(0);
      });
  
      test('should round to nearest 0.5', () => {
        // Example: 116.27 should round to 116.5
        expect(calculateOneRepMax(100, 5)).toBe(112.5);
      });
    });
  
    // Test calculateWeightForPercentage function
    describe('calculateWeightForPercentage', () => {
      test('should calculate weight for percentage correctly', () => {
        expect(calculateWeightForPercentage(200, 80)).toBe(160);
        expect(calculateWeightForPercentage(200, 85)).toBe(170);
        expect(calculateWeightForPercentage(150, 90)).toBe(135);
      });
  
      test('should round to nearest 0.5', () => {
        expect(calculateWeightForPercentage(225, 67)).toBe(151);
      });
  
      test('should return 0 when inputs are invalid', () => {
        expect(calculateWeightForPercentage(0, 80)).toBe(0);
        expect(calculateWeightForPercentage(200, 0)).toBe(0);
        expect(calculateWeightForPercentage(0, 0)).toBe(0);
      });
    });
  
    // Test calculateRepsForWeight function
    describe('calculateRepsForWeight', () => {
      test('should calculate reps for weight correctly based on 1RM', () => {
        expect(calculateRepsForWeight(200, 180)).toBe(5);
        expect(calculateRepsForWeight(200, 160)).toBe(8);
        expect(calculateRepsForWeight(100, 90)).toBe(5);
      });
  
      test('should return 1 for weights equal to or greater than 1RM', () => {
        expect(calculateRepsForWeight(200, 200)).toBe(1);
        expect(calculateRepsForWeight(200, 210)).toBe(1);
      });
  
      test('should cap at 36 reps (limitation of Brzycki formula)', () => {
        expect(calculateRepsForWeight(200, 100)).toBe(36);
      });
  
      test('should return 0 when inputs are invalid', () => {
        expect(calculateRepsForWeight(0, 100)).toBe(0);
        expect(calculateRepsForWeight(200, 0)).toBe(0);
        expect(calculateRepsForWeight(0, 0)).toBe(0);
      });
    });
  
    // Test calculateVolume function
    describe('calculateVolume', () => {
      test('should calculate total volume correctly', () => {
        const sets = [
          { reps: 5, weight: 100 },
          { reps: 5, weight: 90 },
          { reps: 8, weight: 80 }
        ];
        // (5 × 100) + (5 × 90) + (8 × 80) = 500 + 450 + 640 = 1590
        expect(calculateVolume(sets)).toBe(1590);
      });
  
      test('should return 0 for empty or invalid sets', () => {
        expect(calculateVolume([])).toBe(0);
        expect(calculateVolume(null)).toBe(0);
        expect(calculateVolume(undefined)).toBe(0);
      });
  
      test('should handle sets with missing data', () => {
        const sets = [
          { reps: 5, weight: 100 },
          { reps: 5 }, // Missing weight
          { weight: 80 } // Missing reps
        ];
        // Only the first set should contribute: 5 × 100 = 500
        // Others have NaN or undefined values which evaluate to 0 in the calculation
        expect(calculateVolume(sets)).toBe(500);
      });
    });
  
    // Test getIntensityColor function
    describe('getIntensityColor', () => {
      test('should return correct color for different intensity ranges', () => {
        expect(getIntensityColor(95)).toBe('#FF4D4D'); // Very Heavy (≥90%)
        expect(getIntensityColor(90)).toBe('#FF4D4D'); // Very Heavy (=90%)
        expect(getIntensityColor(85)).toBe('#FFA500'); // Heavy (80-89%)
        expect(getIntensityColor(75)).toBe('#FFFF00'); // Moderate to Heavy (70-79%)
        expect(getIntensityColor(65)).toBe('#ADFF2F'); // Moderate (60-69%)
        expect(getIntensityColor(55)).toBe('#32CD32'); // Light to Moderate (50-59%)
        expect(getIntensityColor(45)).toBe('#87CEEB'); // Light (<50%)
      });
    });
  });