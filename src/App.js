import React, { useState } from 'react';
import './App.css';
import './AddHabit.css';
import { useHabits } from './hooks/useHabits';
import ErrorBoundary from './components/ErrorBoundary';

import HabitCard from './components/HabitCard';
import AddHabit from './components/AddHabit';
import TodayFocus from './components/TodayFocus';
import CompoundEffect from './components/CompoundEffect';
import VoteTracker from './components/VoteTracker';
import Dashboard from './components/Dashboard';



function App() {
  const [view, setView] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const {
    habits,
    loading,
    error,
    addHabit,
    deleteHabit,
    toggleHabit,
    updateHabitCount,
    updateStartDate,
    getHabitStats,
    getOverallStats,
    clearError
  } = useHabits();

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (view === 'monthly') {
      newDate.setMonth(currentDate.getMonth() + direction);
      newDate.setDate(1);
    } else {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const handleDeleteHabit = (id) => {
    if (window.confirm('Delete this habit? This action cannot be undone.')) {
      deleteHabit(id);
    }
  };

  const stats = getOverallStats();

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          {error}
          <button onClick={clearError}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <Header currentDate={currentDate} onNavigateDate={navigateDate} view={view} setView={setView} />
        
        <main id="main-content">
          {view === 'dashboard' && (
            <Dashboard 
              habits={habits}
              stats={stats}
              getHabitStats={getHabitStats}
              toggleHabit={toggleHabit}
              currentDate={currentDate}
            />
          )}
          
          {view === 'focus' && (
            <div className="main-layout">
              <aside className="sidebar" aria-label="Add new habit">
                <AddHabit onAdd={addHabit} loading={loading} />
              </aside>
              
              <div className="content">
                <CompoundEffect stats={stats} />
                <TodayFocus 
                  habits={habits} 
                  stats={stats} 
                  getHabitStats={getHabitStats}
                  updateHabitCount={(id, increment) => updateHabitCount(id, increment, currentDate)}
                  updateStartDate={updateStartDate}
                  currentDate={currentDate} 
                />
              </div>
            </div>
          )}
          
          {view === 'habits' && (
            <section className="main-content" aria-label="Daily habits">
              <div className="habits-grid">
                {habits.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon" role="img" aria-label="Target">🎯</div>
                    <h3>Build Your System, Not Just Goals</h3>
                    <p>Create atomic habits that compound into the identity you want to become.</p>
                    <p className="systems-quote">"You do not rise to the level of your goals. You fall to the level of your systems."</p>
                    <p className="compound-note">Small changes. Remarkable results.</p>
                  </div>
                ) : (
                  habits.filter(habit => currentDate >= new Date(habit.startDate)).map(habit => {
                    const habitStats = getHabitStats(habit, currentDate);
                    return (
                      <HabitCard 
                        key={habit.id} 
                        habit={habit}
                        stats={habitStats}
                        onToggle={() => toggleHabit(habit.id)}
                        onDelete={() => handleDeleteHabit(habit.id)}
                        onUpdateStartDate={updateStartDate}
                      />
                    );
                  })
                )}
              </div>
            </section>
          )}
          
          {(view === 'weekly' || view === 'monthly' || view === 'yearly') && (
            <VoteTracker 
              habits={habits}
              view={view}
              currentDate={currentDate}
              getHabitStats={getHabitStats}
              toggleHabit={toggleHabit}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

function Header({ currentDate, onNavigateDate, view, setView }) {
  return (
    <header className="header" role="banner">
      <h1>🎯 Atomic Habits</h1>
      <div className="header-controls">
        <nav className="tab-navigation">
          <button 
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={view === 'focus' ? 'active' : ''}
            onClick={() => setView('focus')}
          >
            Focus
          </button>
          <button 
            className={view === 'habits' ? 'active' : ''}
            onClick={() => setView('habits')}
          >
            All Habits
          </button>
          <button 
            className={view === 'weekly' ? 'active' : ''}
            onClick={() => setView('weekly')}
          >
            Weekly
          </button>
          <button 
            className={view === 'monthly' ? 'active' : ''}
            onClick={() => setView('monthly')}
          >
            Monthly
          </button>
          <button 
            className={view === 'yearly' ? 'active' : ''}
            onClick={() => setView('yearly')}
          >
            Yearly
          </button>
        </nav>
        <nav className="date-navigation" aria-label="Date navigation">
          <button 
            className="nav-btn" 
            onClick={() => onNavigateDate(-1)}
            aria-label={view === 'weekly' ? 'Previous week' : view === 'monthly' ? 'Previous month' : 'Previous day'}
            title={view === 'weekly' ? 'Go to previous week' : view === 'monthly' ? 'Go to previous month' : 'Go to previous day'}
          >
            ‹
          </button>
          <div className="date" role="status" aria-live="polite">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <button 
            className="nav-btn" 
            onClick={() => onNavigateDate(1)}
            aria-label={view === 'weekly' ? 'Next week' : view === 'monthly' ? 'Next month' : 'Next day'}
            title={view === 'weekly' ? 'Go to next week' : view === 'monthly' ? 'Go to next month' : 'Go to next day'}
          >
            ›
          </button>
        </nav>
      </div>
    </header>
  );
}



export default App;