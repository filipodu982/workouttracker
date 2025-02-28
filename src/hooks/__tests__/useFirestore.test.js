import { renderHook, act, waitFor } from '@testing-library/react';
import useFirestore from '../useFirestore';
import { supabase } from '../../supabase/supabase';

jest.mock('../../supabase/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null
      })
    }
  }
}));

describe('loading and error states', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loading state is updated during operations', async () => {
    const mockData = { id: '1', name: 'Test' };
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    const mockSelect = jest.fn().mockReturnValue({
      single: jest.fn().mockImplementation(() => promise)
    });

    supabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: mockSelect
      })
    });

    const { result } = renderHook(() => useFirestore('workouts'));

    // Initial state
    expect(result.current.loading).toBe(false);

    // Start operation
    let addPromise;
    act(() => {
      addPromise = result.current.addDocument(mockData);
    });

    // Wait for loading state to be true
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    // Resolve the operation
    await act(async () => {
      resolvePromise({ data: mockData, error: null });
      await addPromise;
    });

    // Wait for loading state to be false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('error state is cleared before operations', async () => {
    const mockData = { id: '1', name: 'Test' };
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {
      rejectPromise = reject;
    });

    const mockSelect = jest.fn().mockReturnValue({
      single: jest.fn().mockImplementation(() => promise)
    });

    supabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: mockSelect
      })
    });

    const { result } = renderHook(() => useFirestore('workouts'));

    // Set initial error by failing an operation
    let firstAddPromise;
    await act(async () => {
      firstAddPromise = result.current.addDocument(mockData).catch(() => {});
      rejectPromise(new Error('Previous error'));
      await firstAddPromise;
    });

    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.error).toBe('Previous error');
    });

    // Start new operation
    let resolvePromise;
    const successPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    mockSelect.mockReturnValue({
      single: jest.fn().mockImplementation(() => successPromise)
    });

    let secondAddPromise;
    await act(async () => {
      secondAddPromise = result.current.addDocument(mockData);
    });

    // Wait for error to be cleared
    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });

    // Resolve the operation
    await act(async () => {
      resolvePromise({ data: mockData, error: null });
      await secondAddPromise;
    });

    // Verify error remains null after completion
    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });
  });
});