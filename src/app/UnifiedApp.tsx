import React, { useState } from 'react';
import { useFirebaseHabits } from '../hooks/useFirebaseHabits';
import ErrorBoundary from '../components/ErrorBoundary';
import AddHabit from '../components/AddHabit';
import ProgressTracker from '../components/ProgressTracker';
import Auth from '../components/Auth';
import PlateauVisualization from '../components/PlateauVisualization';
import WeeklyReview from '../components/WeeklyReview';
import EnvironmentDesign from '../components/EnvironmentDesign';
import HabitContract from '../components/HabitContract';
import GoldilocksRule from '../components/GoldilocksRule';
import TemptationBundling from '../components/TemptationBundling';
import OnboardingTips from '../components/OnboardingTips';
import '../components/EnhancedComponents.css';

export function UnifiedApp() {
  const [view, setView] = useState(
    localStorage.getItem('scorecardCompleted') ? 'today' : 'scorecard'
  );
  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('habitContracts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddHabit, setShowAddHabit] = useState(false);
  
  const {
    habits,
    loading,
    error,
    user,
    addHabit,
    deleteHabit,
    toggleHabit,
    getHabitStats,
    getOverallStats,
    clearError
  } = useFirebaseHabits();

  if (!user) {
    return <Auth />;
  }

  const handleDeleteHabit = (id) => {
    if (window.confirm('Delete this habit? This action cannot be undone.')) {
      deleteHabit(id);
    }
  };

  const handleSaveContract = (contract) => {
    const updated = [...contracts, contract];
    setContracts(updated);
    localStorage.setItem('habitContracts', JSON.stringify(updated));
  };

  const handleUpdateHabit = (id, updates) => {
    // This would need to be implemented in useFirebaseHabits
    console.log('Update habit:', id, updates);
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

  const avgDaysSinceStart = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => {
        const days = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / habits.length)
    : 0;

  return (
    <ErrorBoundary>
      <div className="app-container">
        <OnboardingTips 
          currentView={view}
          habitCount={habits.length}
          daysSinceStart={avgDaysSinceStart}
        />
        <Header view={view} setView={setView} habits={habits} />
        
        <main>
          {view === 'scorecard' && (
            <HabitScorecard onComplete={() => {
              localStorage.setItem('scorecardCompleted', 'true');
              setView('today');
            }} />
          )}
          
          {view === 'today' && (
            <TodayView 
              habits={habits}
              stats={stats}
              getHabitStats={getHabitStats}
              toggleHabit={toggleHabit}
              handleDeleteHabit={handleDeleteHabit}
              showAddHabit={showAddHabit}
              setShowAddHabit={setShowAddHabit}
              addHabit={addHabit}
              loading={loading}
              allHabits={habits}
            />
          )}
          
          {view === 'progress' && (
            <div className="progress-view-container">
              <div className="progress-periods">
                <ProgressTracker 
                  habits={habits}
                  getHabitStats={getHabitStats}
                  currentDate={new Date()}
                  period="weekly"
                />
                <ProgressTracker 
                  habits={habits}
                  getHabitStats={getHabitStats}
                  currentDate={new Date()}
                  period="monthly"
                />
                <ProgressTracker 
                  habits={habits}
                  getHabitStats={getHabitStats}
                  currentDate={new Date()}
                  period="quarterly"
                />
                <ProgressTracker 
                  habits={habits}
                  getHabitStats={getHabitStats}
                  currentDate={new Date()}
                  period="yearly"
                />
              </div>
            </div>
          )}
          
          {view === 'insights' && (
            <div className="insights-container">
              <PlateauVisualization 
                daysSinceStart={stats.avgDays}
                streak={stats.bestStreak}
              />
              <GoldilocksRule 
                habits={habits}
                getHabitStats={getHabitStats}
                onUpdateDifficulty={handleUpdateHabit}
              />
              <WeeklyReview 
                habits={habits}
                getHabitStats={getHabitStats}
              />
            </div>
          )}
          
          {view === 'tools' && (
            <div className="tools-container">
              <EnvironmentDesign 
                habits={habits}
                onUpdateHabit={handleUpdateHabit}
              />
              <TemptationBundling 
                habits={habits}
              />
              <HabitContract 
                habits={habits}
                onSaveContract={handleSaveContract}
              />
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

function Header({ view, setView, habits }) {
  const showInsightsBadge = habits.length > 0 && habits.some(h => {
    const daysSince = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= 10 && daysSince < 21;
  });

  return (
    <header className="simple-header">
      <h1>🎯 Atomic Habits</h1>
      <p className="tagline">Every action is a vote for who you're becoming</p>
      <nav className="simple-nav">
        <button 
          className={view === 'today' ? 'active' : ''}
          onClick={() => setView('today')}
        >
          Today
        </button>
        <button 
          className={view === 'progress' ? 'active' : ''}
          onClick={() => setView('progress')}
        >
          Progress
        </button>
        <button 
          className={view === 'insights' ? 'active' : ''}
          onClick={() => setView('insights')}
        >
          Insights {showInsightsBadge && '🔥'}
        </button>
        <button 
          className={view === 'tools' ? 'active' : ''}
          onClick={() => setView('tools')}
        >
          Tools
        </button>
      </nav>
    </header>
  );
}

function TodayView({ habits, stats, getHabitStats, toggleHabit, handleDeleteHabit, showAddHabit, setShowAddHabit, addHabit, loading, allHabits }) {
  const today = new Date();
  const todayHabits = habits.filter(h => new Date(h.startDate) <= today);
  
  const groupedHabits = {
    morning: todayHabits.filter(h => h.cue?.toLowerCase().includes('morning') || h.cue?.toLowerCase().includes('wake')),
    afternoon: todayHabits.filter(h => h.cue?.toLowerCase().includes('afternoon') || h.cue?.toLowerCase().includes('lunch')),
    evening: todayHabits.filter(h => h.cue?.toLowerCase().includes('evening') || h.cue?.toLowerCase().includes('night')),
    anytime: todayHabits.filter(h => {
      const cue = h.cue?.toLowerCase() || '';
      return !cue.includes('morning') && !cue.includes('wake') && 
             !cue.includes('afternoon') && !cue.includes('lunch') &&
             !cue.includes('evening') && !cue.includes('night');
    })
  };

  const missedYesterday = todayHabits.filter(h => {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStats = getHabitStats(h, yesterday);
    const todayStats = getHabitStats(h, today);
    return !yesterdayStats.isCompletedToday && todayStats.streak === 0;
  });

  return (
    <div className="today-container">
      <div className="today-header">
        <h2>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        
        <div className="identity-votes">
          <div className="votes-count">
            <span className="votes-num">{stats.completedToday}/{stats.totalHabits}</span>
            <span className="votes-label">Identity Votes Cast</span>
          </div>
          <p className="vote-message">
            {stats.completedToday === 0 && "🎯 Cast your first vote today"}
            {stats.completedToday > 0 && stats.completedToday < stats.totalHabits && `🔥 ${stats.completedToday} votes for who you're becoming. Keep going!`}
            {stats.completedToday === stats.totalHabits && "🏆 Perfect day! Every vote counts."}
          </p>
        </div>
        
        <button className="add-habit-btn" onClick={() => setShowAddHabit(!showAddHabit)}>
          {showAddHabit ? '✕ Close' : '+ Add Habit'}
        </button>
      </div>

      {missedYesterday.length > 0 && (
        <div className="never-miss-twice">
          <h3>⚠️ Never Miss Twice</h3>
          <p>You missed {missedYesterday.length} habit{missedYesterday.length > 1 ? 's' : ''} yesterday. Don't miss today!</p>
        </div>
      )}

      {showAddHabit && (
        <div className="add-habit-inline">
          <AddHabit onAdd={(habit) => { addHabit(habit); setShowAddHabit(false); }} loading={loading} habits={allHabits} />
        </div>
      )}

      {todayHabits.length === 0 ? (
        <div className="empty-today">
          <h3>Build Your System</h3>
          <p>Add your first habit to get started</p>
        </div>
      ) : (
        <>
          {Object.entries(groupedHabits).map(([time, timeHabits]) => {
            if (timeHabits.length === 0) return null;
            return (
              <div key={time} className="time-section">
                <h3 className="time-title">{time.charAt(0).toUpperCase() + time.slice(1)}</h3>
                <div className="habit-checklist">
                  {timeHabits.map(habit => {
                    const habitStats = getHabitStats(habit, today);
                    return (
                      <HabitCheckItem 
                        key={habit.id}
                        habit={habit}
                        stats={habitStats}
                        onToggle={() => toggleHabit(habit.id, today)}
                        onDelete={() => handleDeleteHabit(habit.id)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function HabitCheckItem({ habit, stats, onToggle, onDelete }) {
  return (
    <div className={`habit-check-item ${stats.isCompletedToday ? 'checked' : ''}`}>
      <button className="checkbox" onClick={onToggle}>
        {stats.isCompletedToday ? '✓' : ''}
      </button>
      <div className="habit-check-content">
        <div className="habit-check-name">{habit.icon} {habit.name}</div>
        <div className="two-minute-start">⚡ Start: {habit.twoMinuteVersion}</div>
        <div className="habit-check-identity">I am {habit.identity}</div>
        <div className="habit-check-cue">{habit.cue}</div>
        {habit.visualCue && <div className="visual-cue">👁️ {habit.visualCue}</div>}
        {habit.accountabilityPartner && <div className="accountability">🤝 {habit.accountabilityPartner}</div>}
        {stats.streak > 0 && <div className="habit-check-streak">🔥 {stats.streak} day streak</div>}
      </div>
      <button className="delete-small" onClick={onDelete}>×</button>
    </div>
  );
}

function HabitScorecard({ onComplete }) {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Wake up', rating: null },
    { id: 2, name: 'Check phone first thing', rating: null },
    { id: 3, name: 'Drink coffee/tea', rating: null },
    { id: 4, name: 'Eat breakfast', rating: null },
    { id: 5, name: 'Shower', rating: null },
    { id: 6, name: 'Scroll social media', rating: null },
    { id: 7, name: 'Exercise', rating: null },
    { id: 8, name: 'Read', rating: null },
    { id: 9, name: 'Watch TV', rating: null },
    { id: 10, name: 'Eat snacks', rating: null },
    { id: 11, name: 'Work/Study', rating: null },
    { id: 12, name: 'Go to bed', rating: null },
  ]);
  const [customHabit, setCustomHabit] = useState('');

  const addCustomHabit = () => {
    if (customHabit.trim()) {
      setHabits([...habits, { id: Date.now(), name: customHabit, rating: null }]);
      setCustomHabit('');
    }
  };

  const rateHabit = (id, rating) => {
    setHabits(habits.map(h => h.id === id ? { ...h, rating } : h));
  };

  const allRated = habits.every(h => h.rating !== null);

  return (
    <div className="scorecard-container">
      <div className="scorecard-header">
        <h2>📋 Habit Scorecard</h2>
        <p>Before building new habits, let's identify your current ones.</p>
        <p className="scorecard-subtitle">List ALL your daily habits - from waking up to going to bed. Then rate each one.</p>
        <p className="scorecard-instruction">Rate each habit based on your desired identity:</p>
        <div className="rating-legend">
          <span><strong>++</strong> Good (helps you become who you want to be)</span>
          <span><strong>=</strong> Neutral (neither helps nor hurts)</span>
          <span><strong>--</strong> Bad (goes against who you want to be)</span>
        </div>
      </div>

      <div className="scorecard-list">
        {habits.map(habit => (
          <div key={habit.id} className="scorecard-item">
            <span className="scorecard-habit-name">{habit.name}</span>
            <div className="rating-buttons">
              <button 
                className={`rating-btn good ${habit.rating === 'good' ? 'active' : ''}`}
                onClick={() => rateHabit(habit.id, 'good')}
              >
                ++
              </button>
              <button 
                className={`rating-btn neutral ${habit.rating === 'neutral' ? 'active' : ''}`}
                onClick={() => rateHabit(habit.id, 'neutral')}
              >
                =
              </button>
              <button 
                className={`rating-btn bad ${habit.rating === 'bad' ? 'active' : ''}`}
                onClick={() => rateHabit(habit.id, 'bad')}
              >
                --
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="add-custom-habit">
        <input 
          type="text"
          value={customHabit}
          onChange={(e) => setCustomHabit(e.target.value)}
          placeholder="Add another habit you do..."
          onKeyPress={(e) => e.key === 'Enter' && addCustomHabit()}
        />
        <button onClick={addCustomHabit}>Add</button>
      </div>

      <button 
        className="scorecard-continue"
        onClick={onComplete}
        disabled={!allRated}
      >
        {allRated ? 'Continue to Today →' : 'Rate all habits to continue'}
      </button>

      <div className="scorecard-insights">
        <p className="scorecard-note">
          💡 <strong>Awareness comes before change.</strong> You can't improve a habit you don't notice.
        </p>
        <div className="scorecard-stats">
          <div className="stat-item good">
            <span className="stat-count">{habits.filter(h => h.rating === 'good').length}</span>
            <span className="stat-label">Good Habits</span>
          </div>
          <div className="stat-item neutral">
            <span className="stat-count">{habits.filter(h => h.rating === 'neutral').length}</span>
            <span className="stat-label">Neutral</span>
          </div>
          <div className="stat-item bad">
            <span className="stat-count">{habits.filter(h => h.rating === 'bad').length}</span>
            <span className="stat-label">Bad Habits</span>
          </div>
        </div>
        <p className="scorecard-tip">
          🎯 Focus on building good habits and making bad habits invisible. Start with the 2-minute version!
        </p>
      </div>
    </div>
  );
}
