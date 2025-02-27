// src/components/Calculators/__tests__/OneRepMaxCalculator.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OneRepMaxCalculator from '../OneRepMaxCalculator';
import {
  calculateOneRepMax,
  calculateWeightForPercentage,
  calculateRepsForWeight,
  getIntensityColor
} from '../../../utils/calculations';

// Mock the calculations module
jest.mock('../../../utils/calculations', () => ({
  calculateOneRepMax: jest.fn(),
  calculateWeightForPercentage: jest.fn(),
  calculateRepsForWeight: jest.fn(),
  getIntensityColor: jest.fn()
}));

describe('OneRepMaxCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    calculateOneRepMax.mockImplementation((weight, reps) => {
      if (weight <= 0 || reps <= 0) return 0;
      return 100; // Mock a simple 1RM calculation
    });
    
    calculateWeightForPercentage.mockImplementation((oneRM, percentage) => {
      return Math.round((oneRM * percentage) / 100);
    });
    
    calculateRepsForWeight.mockImplementation((oneRM, weight) => {
      // Simple mock - just return a fixed number of reps based on percentage
      const percentage = (weight / oneRM) * 100;
      if (percentage >= 90) return 3;
      if (percentage >= 80) return 6;
      if (percentage >= 70) return 8;
      if (percentage >= 60) return 10;
      return 12;
    });
    
    getIntensityColor.mockImplementation((percentage) => {
      if (percentage >= 90) return '#FF4D4D'; // Red
      if (percentage >= 80) return '#FFA500'; // Orange
      if (percentage >= 70) return '#FFFF00'; // Yellow
      if (percentage >= 60) return '#ADFF2F'; // Green-Yellow
      if (percentage >= 50) return '#32CD32'; // Green
      return '#87CEEB'; // Sky Blue
    });
  });

  test('renders initial empty state', () => {
    render(<OneRepMaxCalculator />);
    
    // Check if calculator title is rendered
    expect(screen.getByText('One Rep Max Calculator')).toBeInTheDocument();
    
    // Check if input fields are empty
    const weightInput = screen.getByPlaceholderText('Enter weight');
    const repsInput = screen.getByPlaceholderText('Enter reps');
    
    expect(weightInput.value).toBe('');
    expect(repsInput.value).toBe('');
    
    // Check if percentage chart is not rendered initially
    expect(screen.queryByText('Percentage Chart')).not.toBeInTheDocument();
    
    // Check if empty state message is shown
    expect(screen.getByText('Enter weight and reps')).toBeInTheDocument();
  });

  test('calculates 1RM when weight and reps are entered', async () => {
    render(<OneRepMaxCalculator />);
    
    // Setup mock for 1RM calculation
    calculateOneRepMax.mockReturnValue(225);
    
    // Enter weight and reps
    const weightInput = screen.getByPlaceholderText('Enter weight');
    const repsInput = screen.getByPlaceholderText('Enter reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '200');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '5');
    
    // Check if 1RM is calculated and displayed
    await waitFor(() => {
      expect(calculateOneRepMax).toHaveBeenCalledWith(200, 5);
      expect(screen.getByText('225 kg')).toBeInTheDocument();
    });
    
    // Check if the percentage chart is rendered
    expect(screen.getByText('Percentage Chart')).toBeInTheDocument();
  });

  test('generates percentage chart with correct values', async () => {
    render(<OneRepMaxCalculator />);
    
    // Setup mocks
    calculateOneRepMax.mockReturnValue(200);
    
    // Enter weight and reps
    const weightInput = screen.getByPlaceholderText('Enter weight');
    const repsInput = screen.getByPlaceholderText('Enter reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '180');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '5');
    
    // Wait for percentage calculations
    await waitFor(() => {
      expect(screen.getByText('Percentage Chart')).toBeInTheDocument();
    });
    
    // Check if all percentage rows are rendered (100%, 95%, 90%, etc.)
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    
    // Check if weights are calculated correctly for each percentage
    expect(calculateWeightForPercentage).toHaveBeenCalledWith(200, 100);
    expect(calculateWeightForPercentage).toHaveBeenCalledWith(200, 95);
    expect(calculateWeightForPercentage).toHaveBeenCalledWith(200, 90);
    
    // Check intensity labels
    expect(screen.getAllByText('Very Heavy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Heavy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Moderate to Heavy').length).toBeGreaterThan(0);
  });

  test('resets calculator when Reset button is clicked', async () => {
    render(<OneRepMaxCalculator />);
    
    // Enter weight and reps first
    const weightInput = screen.getByPlaceholderText('Enter weight');
    const repsInput = screen.getByPlaceholderText('Enter reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '100');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '10');
    
    // Wait for calculations to be done
    await waitFor(() => {
      expect(screen.getByText('Percentage Chart')).toBeInTheDocument();
    });
    
    // Click the reset button
    const resetButton = screen.getByText('Reset');
    userEvent.click(resetButton);
    
    // Check if inputs are cleared
    expect(weightInput.value).toBe('');
    expect(repsInput.value).toBe('');
    
    // Check if percentage chart is hidden
    expect(screen.queryByText('Percentage Chart')).not.toBeInTheDocument();
    
    // Check if empty state is shown again
    expect(screen.getByText('Enter weight and reps')).toBeInTheDocument();
  });

  test('changes unit from kg to lbs', async () => {
    render(<OneRepMaxCalculator />);
    
    // Check initial unit is kg
    const unitSelect = screen.getByRole('combobox');
    expect(unitSelect.value).toBe('kg');
    
    // Change unit to lbs
    userEvent.selectOptions(unitSelect, 'lbs');
    expect(unitSelect.value).toBe('lbs');
    
    // Enter weight and reps
    const weightInput = screen.getByPlaceholderText('Enter weight');
    const repsInput = screen.getByPlaceholderText('Enter reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '225');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '5');
    
    // Check if 1RM is displayed with lbs unit
    await waitFor(() => {
      const oneRMDisplay = screen.getByText(/\d+ lbs/);
      expect(oneRMDisplay).toBeInTheDocument();
    });
  });

  test('handles invalid inputs gracefully', async () => {
    render(<OneRepMaxCalculator />);
    
    // Enter invalid values (negative or zero)
    const weightInput = screen.getByPlaceholderText('Enter weight');
    const repsInput = screen.getByPlaceholderText('Enter reps');
    
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '0');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '5');
    
    // Check that no calculations are displayed
    expect(screen.queryByText('Percentage Chart')).not.toBeInTheDocument();
    
    // Enter valid weight but invalid reps
    userEvent.clear(weightInput);
    userEvent.type(weightInput, '100');
    
    userEvent.clear(repsInput);
    userEvent.type(repsInput, '0');
    
    // Still no calculations should be displayed
    expect(screen.queryByText('Percentage Chart')).not.toBeInTheDocument();
  });
});