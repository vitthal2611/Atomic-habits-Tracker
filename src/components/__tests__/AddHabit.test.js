import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddHabit from '../AddHabit';

describe('AddHabit Component', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  test('renders form with all required fields', () => {
    render(<AddHabit onAdd={mockOnAdd} loading={false} />);
    
    expect(screen.getByLabelText(/what habit do you want to build/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/who will you become/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/how often/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create my atomic habit/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    render(<AddHabit onAdd={mockOnAdd} loading={false} />);
    
    const submitButton = screen.getByRole('button', { name: /create my atomic habit/i });
    
    await act(async () => {
      await user.click(submitButton);
    });
    
    expect(screen.getByText(/habit name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/identity statement is required/i)).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('submits valid form data', async () => {
    const user = userEvent.setup();
    mockOnAdd.mockResolvedValue(true);
    
    render(<AddHabit onAdd={mockOnAdd} loading={false} />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/what habit do you want to build/i), 'Read daily');
      await user.type(screen.getByLabelText(/who will you become/i), 'I am a reader');
      await user.type(screen.getByPlaceholderText(/after i wake up/i), 'After breakfast');
      await user.type(screen.getByPlaceholderText(/easiest way to start/i), 'Read 1 page');
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /create my atomic habit/i }));
    });
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({
        name: 'Read daily',
        icon: '⭐',
        identity: 'I am a reader',
        cue: 'After breakfast',
        reward: '',
        twoMinuteVersion: 'Read 1 page',
        frequency: 'daily'
      });
    });
  });

  test('handles form submission errors', async () => {
    const user = userEvent.setup();
    mockOnAdd.mockRejectedValue(new Error('Network error'));
    
    render(<AddHabit onAdd={mockOnAdd} loading={false} />);
    
    await act(async () => {
      await user.type(screen.getByLabelText(/what habit do you want to build/i), 'Test');
      await user.type(screen.getByLabelText(/who will you become/i), 'Tester');
      await user.type(screen.getByPlaceholderText(/after i wake up/i), 'Test cue');
      await user.type(screen.getByPlaceholderText(/easiest way to start/i), 'Test easy');
    });
    
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /create my atomic habit/i }));
    });
    
    await waitFor(() => {
      expect(screen.getByText(/failed to create habit/i)).toBeInTheDocument();
    });
  });

  test('shows loading state', () => {
    render(<AddHabit onAdd={mockOnAdd} loading={true} />);
    
    expect(screen.getByRole('button', { name: /creating/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});