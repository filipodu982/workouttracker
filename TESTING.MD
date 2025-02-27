# Lift Logger Testing Strategy

This document outlines the testing approach for the Lift Logger workout tracking application.

## Testing Approach

The application uses Jest and React Testing Library for unit and integration testing. The testing strategy focuses on:

1. **Unit Testing** - Testing individual functions and components in isolation
2. **Integration Testing** - Testing component interactions within contexts
3. **Mock Testing** - Mocking external services (Firebase/Supabase) and browser APIs

## Test Structure

Tests are organized in `__tests__` directories alongside the code they test:

```
src/
├── components/
│   ├── WorkoutLogger/
│   │   ├── __tests__/
│   │   │   └── WorkoutForm.test.js
│   │   ├── WorkoutForm.jsx
│   │   └── ...
│   └── ...
├── hooks/
│   ├── __tests__/
│   │   └── useOneRepMax.test.js
│   ├── useOneRepMax.js
│   └── ...
└── ...
```

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run the test runner script
node scripts/run-tests.js
```

## Test Coverage

We aim for high test coverage in critical areas:

1. **Core Utilities** (calculations.js) - 100% coverage
2. **Custom Hooks** (useOneRepMax.js, useFirestore.js) - 90%+ coverage
3. **Authentication** - Critical user flows fully tested
4. **Form Components** - All validation logic and user interactions tested

## Mocking Strategy

The application uses several mock approaches:

1. **Service Mocks** - Firebase/Supabase APIs are mocked to avoid external calls
2. **Context Mocks** - Auth and Workout contexts mocked for component testing
3. **Browser API Mocks** - localStorage, ResizeObserver, etc.

## Example Tests

### Utility Function Tests

```javascript
// Example from calculations.test.js
describe('calculateOneRepMax', () => {
  test('should calculate 1RM correctly', () => {
    expect(calculateOneRepMax(100, 5)).toBeCloseTo(116.5, 1);
  });
});
```

### Hook Tests

```javascript
// Example from useOneRepMax.test.js
test('should calculate 1RM when values change', () => {
  const { result } = renderHook(() => useOneRepMax());
  act(() => {
    result.current.setWeight(100);
    result.current.setReps(5);
  });
  expect(result.current.oneRM).toBeGreaterThan(0);
});
```

### Component Tests

```javascript
// Example from WorkoutForm.test.js
test('submits the form with valid input', async () => {
  render(<WorkoutForm onSubmit={mockOnSubmit} />);
  userEvent.type(screen.getByLabelText(/exercise/i), 'Bench Press');
  userEvent.click(screen.getByText(/log workout/i));
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
```

## Continuous Integration

Tests are run automatically on each push to the `main` branch through GitHub Actions workflow defined in `.github/workflows/deploy.yml`.

## Future Testing Improvements

1. **End-to-End Testing** - Add Cypress tests for critical user flows
2. **Performance Testing** - Add React performance testing for optimization
3. **Mobile Testing** - Add specific tests for mobile responsive behavior
4. **Accessibility Testing** - Add tests to ensure the app meets accessibility standards