// src/hooks/__tests__/useOneRepMax.test.js
import { renderHook, act } from '@testing-library/react';
import useOneRepMax from '../useOneRepMax';
import { calculateOneRepMax, calculateWeightForPercentage, calculateRepsForWeight } from '../../utils/calculations';

// Mock the calculations module
jest.mock('../../utils/calculations', () => ({
  calculateOneRepMax: jest.fn(),
  calculateWeightForPercentage: jest.fn(),
  calculateRepsForWeight: jest.fn()
}));

describe('useOneRepMax hook', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set default mock implementations
    calculateOneRepMax.mockImplementation((weight, reps) => {
      if (weight <= 0 || reps <= 0) return 0;
      return 100; // Mock a simple 1RM value for testing
    });
    
    calculateWeightForPercentage.mockImplementation((oneRM, percentage) => {
      return (oneRM * percentage) / 100;
    });
    
    calculateRepsForWeight.mockImplementation((oneRM, weight) => {
      return 5; // Mock a simple value for testing
    });
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useOneRepMax());
    
    expect(result.current.weight).toBe(0);
    expect(result.current.reps).toBe(0);
    expect(result.current.oneRM).toBe(0);
    expect(result.current.percentages).toEqual([]);
  });

  test('should initialize with provided values', () => {
    const { result } = renderHook(() => useOneRepMax(100, 5));
    
    expect(result.current.weight).toBe(100);
    expect(result.current.reps).toBe(5);
    expect(calculateOneRepMax).toHaveBeenCalledWith(100, 5);
  });

  test('should calculate 1RM when weight and reps change', () => {
    const { result } = renderHook(() => useOneRepMax());
    
    // Initially, no calculation should happen with default values
    expect(calculateOneRepMax).not.toHaveBeenCalled();
    
    // Update weight and reps
    act(() => {
      result.current.setWeight(100);
      result.current.setReps(5);
    });
    
    // Now calculations should be called
    expect(calculateOneRepMax).toHaveBeenCalledWith(100, 5);
    expect(result.current.oneRM).toBe(100); // Our mocked value
  });

  test('should generate percentage data correctly', () => {
    const { result } = renderHook(() => useOneRepMax());
    
    // Set our mock to return 200 as 1RM
    calculateOneRepMax.mockReturnValue(200);
    
    // Update weight and reps
    act(() => {
      result.current.setWeight(150);
      result.current.setReps(5);
    });
    
    // Check if the percentages array was generated correctly
    expect(result.current.percentages.length).toBe(11); // Default percentages are: 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50
    
    // Check if calculations were called for each percentage
    expect(calculateWeightForPercentage).toHaveBeenCalledTimes(11);
    expect(calculateRepsForWeight).toHaveBeenCalledTimes(11);
  });

  test('should reset all values correctly', () => {
    const { result } = renderHook(() => useOneRepMax(100, 5));
    
    expect(result.current.weight).toBe(100);
    expect(result.current.reps).toBe(5);
    
    // Reset values
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.weight).toBe(0);
    expect(result.current.reps).toBe(0);
    expect(result.current.oneRM).toBe(0);
    expect(result.current.percentages).toEqual([]);
  });

  test('should calculate with manual inputs', () => {
    const { result } = renderHook(() => useOneRepMax());
    
    act(() => {
      result.current.calculate(200, 3);
    });
    
    expect(result.current.weight).toBe(200);
    expect(result.current.reps).toBe(3);
    expect(calculateOneRepMax).toHaveBeenCalledWith(200, 3);
  });

  test('getWeightForPercentage should return correct value', () => {
    const { result } = renderHook(() => useOneRepMax());
    
    // First set oneRM to a known value
    calculateOneRepMax.mockReturnValue(200);
    calculateWeightForPercentage.mockReturnValue(170);
    
    act(() => {
      result.current.setWeight(180);
      result.current.setReps(3);
    });
    
    // Test the helper function
    expect(result.current.getWeightForPercentage(85)).toBe(170);
    expect(calculateWeightForPercentage).toHaveBeenCalledWith(200, 85);
  });

  test('getRepsForWeight should return correct value', () => {
    const { result } = renderHook(() => useOneRepMax());
    
    // First set oneRM to a known value
    calculateOneRepMax.mockReturnValue(200);
    calculateRepsForWeight.mockReturnValue(8);
    
    act(() => {
      result.current.setWeight(180);
      result.current.setReps(3);
    });
    
    // Test the helper function
    expect(result.current.getRepsForWeight(160)).toBe(8);
    expect(calculateRepsForWeight).toHaveBeenCalledWith(200, 160);
  });
});