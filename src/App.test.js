import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Atomic Habits Tracker', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /atomic habits/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays sample habits on first load', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/drink 1 glass of water/i)).toBeInTheDocument();
      expect(screen.getByText(/do 5 push-ups/i)).toBeInTheDocument();
      expect(screen.getByText(/read 1 page/i)).toBeInTheDocument();
    });
  });

  test('can create a new habit', async () => {
    render(<App />);
    
    // Fill out the form
    const nameInput = screen.getByLabelText(/what habit do you want to build/i);
    const identityInput = screen.getByLabelText(/who will you become/i);
    const cueInput = screen.getByPlaceholderText(/after i wake up/i);
    const twoMinuteInput = screen.getByPlaceholderText(/easiest way to start/i);
    
    fireEvent.change(nameInput, { target: { value: 'Test Habit' } });
    fireEvent.change(identityInput, { target: { value: 'I am someone who tests' } });
    fireEvent.change(cueInput, { target: { value: 'After I open my computer' } });
    fireEvent.change(twoMinuteInput, { target: { value: 'Open the test file' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create my atomic habit/i });
    fireEvent.click(submitButton);
    
    // Check if habit was added
    await waitFor(() => {
      expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });
  });

  test('can toggle habit completion', async () => {
    render(<App />);
    
    await waitFor(() => {
      const toggleButton = screen.getAllByText(/do it/i)[0];
      fireEvent.click(toggleButton);
      
      expect(screen.getByText(/done/i)).toBeInTheDocument();
    });
  });

  test('displays compound effect stats', () => {
    render(<App />);
    
    expect(screen.getByText(/your compound growth/i)).toBeInTheDocument();
    expect(screen.getByText(/total identity votes cast/i)).toBeInTheDocument();
  });

  test('can navigate between views', async () => {
    render(<App />);
    
    await waitFor(() => {
      const backlogButton = screen.getByRole('tab', { name: /catch up on missed habits/i });
      fireEvent.click(backlogButton);
      
      expect(screen.getByText(/catch up on missed habits/i)).toBeInTheDocument();
    });
  });

  test('has proper accessibility attributes', () => {
    render(<App />);
    
    // Check for skip link
    expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    
    // Check for proper headings
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for proper form labels
    expect(screen.getByLabelText(/what habit do you want to build/i)).toBeInTheDocument();
  });

  test('handles errors gracefully', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock localStorage to throw an error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    
    render(<App />);
    
    // The app should still render without crashing
    expect(screen.getByRole('heading', { name: /atomic habits/i })).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});