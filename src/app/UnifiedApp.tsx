import React, { useState, useEffect } from 'react';
import { useFirebaseHabits } from '../hooks/useFirebaseHabits';
import ErrorBoundary from '../components/ErrorBoundary';
import AddHabit from '../components/AddHabit';
import ProgressTracker from '../components/ProgressTracker';
import Auth from '../components/Auth';
import PlateauVisualization from '../components/PlateauVisualization';
import WeeklyReview from '../components/WeeklyReview';
import EnvironmentDesign from '../components/EnvironmentDesign';
import HabitContract from '../components/HabitContract';
import TemptationBundling from '../components/TemptationBundling';
import OnboardingTips from '../components/OnboardingTips';
import CompoundGrowthChart from '../components/CompoundGrowthChart';
import HabitCalendar from '../components/HabitCalendar';
import HabitStackingSuggestions from '../components/HabitStackingSuggestions';
import NeverMissTwice from '../components/NeverMissTwice';
import ImprovedGoldilocksRule from '../components/ImprovedGoldilocksRule';
import HabitLoopWithCraving from '../components/HabitLoopWithCraving';
import MonthlyScorecard from '../components/MonthlyScorecard';
import HabitProgression from '../components/HabitProgression';
import PatternInsights from '../components/PatternInsights';
import ImprovedHabitCard from '../components/ImprovedHabitCard';
import StreakVisualization from '../components/StreakVisualization';
import { SkeletonList, EmptyState, ErrorState } from '../components/LoadingStates';
import MobileCalendar from '../components/MobileCalendar';
import FormWizard from '../components/FormWizard';
import BottomNavigation from '../components/BottomNavigation';
import OnboardingTutorial from '../components/OnboardingTutorial';
import { ToastProvider, useToast } from '../components/Toast';
import '../components/Toast.css';
import '../components/StreakVisualization.css';
import '../components/EnhancedComponents.css';
import '../components/CriticalFixes.css';
import '../components/RemainingFixes.css';
import '../components/ImprovedTodayView.css';

function UnifiedAppContent() {
  const toast = useToast();
  const [view, setView] = useState(
    localStorage.getItem('scorecardCompleted') ? 'today' : 'scorecard'
  );
  const [contracts, setContracts] = useState(() => {
    const saved = localStorage.getItem('habitContracts');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showMonthlyScorecard, setShowMonthlyScorecard] = useState(false);
  const [selectedHabitForDetails, setSelectedHabitForDetails] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const scorecardCompleted = localStorage.getItem('scorecardCompleted');
    if (!onboardingCompleted && !scorecardCompleted && habits && habits.length === 0) {
      setShowOnboarding(true);
    }
  }, [habits]);

  // Check for monthly scorecard
  useEffect(() => {
    if (!user || !habits) return;
    const lastReview = localStorage.getItem('lastScorecardReview');
    if (!lastReview) {
      localStorage.setItem('lastScorecardReview', new Date().toISOString());
      return;
    }
    const daysSince = Math.floor((Date.now() - new Date(lastReview)) / (1000 * 60 * 60 * 24));
    if (daysSince >= 30 && habits.length > 0) {
      setShowMonthlyScorecard(true);
    }
  }, [habits, user]);

  if (!user) {
    return <Auth />;
  }

  const handleDeleteHabit = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    deleteHabit(id);
    toast.success(`"${habit.name}" deleted`, {
      label: 'Undo',
      onClick: () => addHabit(habit)
    });
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
      <div style={{ padding: '2rem' }}>
        <ErrorState message={error} onRetry={clearError} />
      </div>
    );
  }

  const avgDaysSinceStart = habits.length > 0 
    ? Math.round(habits.reduce((sum, h) => {
        const days = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / habits.length)
    : 0;

  const handleQuickComplete = (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    toggleHabit(habitId, new Date());
    if (habit && toast) {
      toast.success(`Vote cast for "${habit.name}"!`);
    }
  };

  return (
    <>
      {showOnboarding && (
        <OnboardingTutorial onComplete={() => setShowOnboarding(false)} />
      )}
      {showMonthlyScorecard && (
        <MonthlyScorecard onClose={() => setShowMonthlyScorecard(false)} />
      )}
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
            <>
              <NeverMissTwice 
                habits={habits}
                getHabitStats={getHabitStats}
                onQuickComplete={handleQuickComplete}
              />
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
            </>
          )}
          
          {view === 'progress' && (
            loading ? (
              <div className="progress-view-container">
                <SkeletonList count={2} />
              </div>
            ) : habits.length === 0 ? (
              <div className="progress-view-container">
                <EmptyState 
                  icon="📊"
                  title="No Progress Yet"
                  description="Create your first habit to start tracking your progress and building your identity."
                  action="+ Create Habit"
                  onAction={() => setView('today')}
                />
              </div>
            ) : (
            <div className="progress-view-container">
              <CompoundGrowthChart daysSinceStart={avgDaysSinceStart} />
              
              {habits.map(habit => (
                isMobile ? (
                  <MobileCalendar 
                    key={habit.id}
                    habit={habit}
                    getHabitStats={getHabitStats}
                  />
                ) : (
                  <HabitCalendar 
                    key={habit.id}
                    habit={habit}
                    getHabitStats={getHabitStats}
                  />
                )
              ))}
              
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
            )
          )}
          
          {view === 'insights' && (
            loading ? (
              <div className="insights-container">
                <SkeletonList count={2} />
              </div>
            ) : habits.length === 0 ? (
              <div className="insights-container">
                <EmptyState 
                  icon="💡"
                  title="No Insights Available"
                  description="Build habits for at least a week to unlock powerful insights about your patterns and progress."
                  action="+ Create Habit"
                  onAction={() => setView('today')}
                />
              </div>
            ) : (
            <div className="insights-container">
              <PatternInsights 
                habits={habits}
                getHabitStats={getHabitStats}
              />
              <PlateauVisualization 
                daysSinceStart={stats.avgDays}
                streak={stats.bestStreak}
              />
              {selectedHabitForDetails && (
                <>
                  <HabitLoopWithCraving 
                    habit={selectedHabitForDetails}
                    onUpdate={handleUpdateHabit}
                  />
                  <HabitProgression 
                    habit={selectedHabitForDetails}
                    onUpdate={handleUpdateHabit}
                  />
                </>
              )}
              <div className="habit-selector">
                <label>Select habit for detailed insights:</label>
                <select 
                  value={selectedHabitForDetails?.id || ''}
                  onChange={(e) => setSelectedHabitForDetails(habits.find(h => h.id === e.target.value))}
                >
                  <option value="">Choose a habit...</option>
                  {habits.map(h => (
                    <option key={h.id} value={h.id}>{h.icon} {h.name}</option>
                  ))}
                </select>
              </div>
              <ImprovedGoldilocksRule 
                habits={habits}
                getHabitStats={getHabitStats}
                onUpdateHabit={handleUpdateHabit}
              />
              <WeeklyReview 
                habits={habits}
                getHabitStats={getHabitStats}
              />
            </div>
            )
          )}
          
          {view === 'tools' && (
            loading ? (
              <div className="tools-container">
                <SkeletonList count={2} />
              </div>
            ) : (
            <div className="tools-container">
              <HabitStackingSuggestions 
                habits={habits}
                onAdd={addHabit}
                loading={loading}
              />
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
            )
          )}
        </main>
        
        {isMobile && (
          <BottomNavigation 
            currentView={view}
            onViewChange={setView}
          />
        )}
      </div>
    </>
  );
}

export function UnifiedApp() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <UnifiedAppContent />
      </ToastProvider>
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
  const completionPercentage = stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0;
  
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

  if (loading) {
    return (
      <div className="today-view-improved">
        <div className="today-progress-bar">
          <div className="skeleton" style={{ height: '8px', marginBottom: '1rem' }} />
        </div>
        <SkeletonList count={3} />
      </div>
    );
  }

  return (
    <div className="today-view-improved">
      <div className="today-progress-bar">
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="progress-stats">
          <span className="progress-label">Today's Progress</span>
          <span className="progress-count">{stats.completedToday}/{stats.totalHabits}</span>
        </div>
      </div>

      <div className="today-header">
        <h2>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        
        {stats.bestStreak >= 7 && (
          <StreakVisualization streak={stats.currentStreak || 0} bestStreak={stats.bestStreak} />
        )}
        
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
        
        <button className="btn btn-primary" onClick={() => setShowAddHabit(!showAddHabit)}>
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
          <FormWizard 
            onComplete={(habit) => { 
              addHabit(habit); 
              setShowAddHabit(false); 
            }} 
            habits={allHabits}
            loading={loading}
          />
        </div>
      )}

      {todayHabits.length === 0 ? (
        <EmptyState 
          icon="🎯"
          title="Build Your First Habit"
          description="Every action you take is a vote for the type of person you wish to become. Start with one small habit today."
          action="+ Create Your First Habit"
          onAction={() => setShowAddHabit(true)}
        />
      ) : (
        <>
          {Object.entries(groupedHabits).map(([time, timeHabits]) => {
            if (timeHabits.length === 0) return null;
            const timeIcons = {
              morning: '🌅',
              afternoon: '☀️',
              evening: '🌙',
              anytime: '⏰'
            };
            
            return (
              <div key={time} className="time-section-improved">
                <div className="time-section-header">
                  <span className="time-icon">{timeIcons[time]}</span>
                  <h3 className="time-title">{time}</h3>
                </div>
                <div className="habit-checklist">
                  {timeHabits.map(habit => {
                    const habitStats = getHabitStats(habit, today);
                    return (
                      <ImprovedHabitCard 
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
        className="btn btn-success btn-lg"
        style={{ width: '100%' }}
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
