import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  const mockProps = {
    habits: [
      {
        id: '1',
        name: 'Read Daily',
        icon: '📚',
        identity: 'I am a reader',
        cue: 'After breakfast',
        startDate: new Date().toISOString(),
        daily: []
      }
    ],
    stats: {
      totalHabits: 1,
      completedToday: 0,
      bestStreak: 0,
      identityScore: 0,
      totalVotes: 0,
      avgDays: 1
    },
    getHabitStats: jest.fn(() => ({
      streak: 0,
      isCompletedToday: false,
      todayCount: 0,
      daysSinceStart: 1
    })),
    toggleHabit: jest.fn(),
    currentDate: new Date(),
    addHabit: jest.fn(),
    loading: false
  };

  test('renders identity compass with score', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText(/identity strength/i)).toBeInTheDocument();
  });

  test('displays daily mantra', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText(/every action is a vote/i)).toBeInTheDocument();
    expect(screen.getByText(/cast your identity votes today/i)).toBeInTheDocument();
  });

  test('shows add habit card', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText(/create new habit/i)).toBeInTheDocument();
    expect(screen.getByText(/build your atomic system/i)).toBeInTheDocument();
  });

  test('renders habit cards for today', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getAllByText('Read Daily')).toHaveLength(2); // Quick action + habit card
    expect(screen.getAllByText('I am a reader')).toHaveLength(2); // Quick action + habit card
  });

  test('displays compound growth section', () => {
    render(<Dashboard {...mockProps} />);
    
    expect(screen.getByText(/your compound growth/i)).toBeInTheDocument();
    expect(screen.getByText(/small changes, remarkable results/i)).toBeInTheDocument();
  });

  test('shows correct identity message based on score', () => {
    const testDate = new Date('2024-01-15');
    const pastDate = new Date('2024-01-01'); // Start date in the past
    
    const highScoreProps = {
      ...mockProps,
      currentDate: testDate,
      habits: [
        {
          id: '1',
          name: 'Read Daily',
          icon: '📚',
          identity: 'I am a reader',
          cue: 'After breakfast',
          startDate: pastDate.toISOString(),
          daily: [{ key: testDate.toDateString(), completed: true, count: 1 }]
        }
      ],
      getHabitStats: jest.fn(() => ({
        streak: 5,
        isCompletedToday: true,
        todayCount: 1,
        daysSinceStart: 10
      })),
      stats: { ...mockProps.stats, completedToday: 1, identityScore: 95 }
    };
    
    render(<Dashboard {...highScoreProps} />);
    expect(screen.getByText(/identity master/i)).toBeInTheDocument();
  });
});