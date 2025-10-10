import { renderHook, act } from '@testing-library/react';
import { useHabits } from '../useHabits';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock crypto.randomUUID
global.crypto = {
  randomUUID: jest.fn(() => 'test-uuid-123')
};

describe('useHabits Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.clear.mockClear();
    // Reset localStorage to empty state for each test
    localStorageMock.getItem.mockReturnValue('[]');
  });
  
  afterEach(() => {
    // Clean up after each test
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
  });

  test('initializes with empty habits array', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useHabits());
    
    expect(result.current.habits).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('adds new habit successfully', async () => {
    const { result } = renderHook(() => useHabits());
    
    const habitData = {
      name: 'Read Daily',
      identity: 'I am a reader',
      cue: 'After breakfast',
      frequency: 'daily'
    };

    let addResult;
    await act(async () => {
      addResult = result.current.addHabit(habitData);
    });

    expect(addResult).toBe(true);
    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe('Read Daily');
  });

  test('rejects invalid habit data', async () => {
    const { result } = renderHook(() => useHabits());
    
    // Clear any existing habits first
    await act(async () => {
      result.current.habits.forEach(habit => {
        result.current.deleteHabit(habit.id);
      });
    });
    
    // Test with empty name
    let addResult1;
    await act(async () => {
      addResult1 = result.current.addHabit({ name: '', identity: 'test', cue: 'test' });
    });
    expect(addResult1).toBe(false);
    
    // Test with missing identity
    let addResult2;
    await act(async () => {
      addResult2 = result.current.addHabit({ name: 'test', cue: 'test' });
    });
    expect(addResult2).toBe(false);
    
    // Test with missing cue
    let addResult3;
    await act(async () => {
      addResult3 = result.current.addHabit({ name: 'test', identity: 'test' });
    });
    expect(addResult3).toBe(false);

    expect(result.current.habits).toHaveLength(0);
  });

  test('toggles habit completion', async () => {
    const { result } = renderHook(() => useHabits());
    
    await act(async () => {
      result.current.addHabit({
        name: 'Test Habit',
        identity: 'Tester',
        cue: 'Test cue',
        frequency: 'daily'
      });
    });

    const habitId = result.current.habits[0].id;
    const testDate = new Date('2024-01-01');

    await act(async () => {
      result.current.toggleHabit(habitId, testDate);
    });

    const stats = result.current.getHabitStats(result.current.habits[0], testDate);
    expect(stats.isCompletedToday).toBe(true);
  });
});