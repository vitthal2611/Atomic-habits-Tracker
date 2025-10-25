import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFirebaseHabits } from '../hooks/useFirebaseHabits';
import ErrorBoundary from '../components/ErrorBoundary';
import Auth from '../components/Auth';
import PlateauVisualization from '../components/PlateauVisualization';
import WeeklyReview from '../components/WeeklyReview';
import EnvironmentDesign from '../components/EnvironmentDesign';
import HabitContract from '../components/HabitContract';
import TemptationBundling from '../components/TemptationBundling';
import OnboardingTips from '../components/OnboardingTips';
import HabitStackingSuggestions from '../components/HabitStackingSuggestions';
import ImprovedGoldilocksRule from '../components/ImprovedGoldilocksRule';
import HabitLoopWithCraving from '../components/HabitLoopWithCraving';
import MonthlyScorecard from '../components/MonthlyScorecard';
import HabitProgression from '../components/HabitProgression';
import PatternInsights from '../components/PatternInsights';
import ImprovedHabitCard from '../components/ImprovedHabitCard';
import EisenhowerMatrix from '../components/EisenhowerMatrix';
import { SkeletonList, EmptyState, ErrorState } from '../components/LoadingStates';
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
  const [view, setView] = useState('today');
  
  useEffect(() => {
    if (window.history.length > 1) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);
  const [contracts, setContracts] = useState([]);
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
    updateHabit,
    toggleHabit,
    getHabitStats,
    getOverallStats,
    logout,
    clearError
  } = useFirebaseHabits();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const onboardingCompleted = false;
    const scorecardCompleted = false;
    if (!onboardingCompleted && !scorecardCompleted && habits && habits.length === 0) {
      setShowOnboarding(true);
    }
  }, [habits]);

  // Check for monthly scorecard
  useEffect(() => {
    if (!user || !habits) return;
    // Monthly scorecard disabled for now
  }, [habits, user]);

  const handleDeleteHabit = useCallback((id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    
    deleteHabit(id);
    toast.success(`"${habit.name}" deleted`, {
      label: 'Undo',
      onClick: () => addHabit(habit)
    });
  }, [habits, deleteHabit, toast, addHabit]);

  const handleSaveContract = useCallback((contract) => {
    const updated = [...contracts, contract];
    setContracts(updated);
  }, [contracts]);



  const stats = useMemo(() => getOverallStats(), [getOverallStats]);

  const avgDaysSinceStart = useMemo(() => 
    habits.length > 0 
      ? Math.round(habits.reduce((sum, h) => {
          const days = Math.floor((Date.now() - new Date(h.startDate).getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / habits.length)
      : 0,
    [habits]
  );

  if (!user) {
    return <Auth />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorState message={error} onRetry={clearError} />
      </div>
    );
  }

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
        <Header view={view} setView={setView} habits={habits} onLogout={logout} />
        
        <main>
          <div style={{ display: view === 'scorecard' ? 'block' : 'none' }}>
            <HabitScorecard onComplete={() => setView('today')} />
          </div>
          
          <div style={{ display: view === 'today' ? 'block' : 'none' }}>
            <TodayView 
              habits={habits}
              stats={stats}
              getHabitStats={getHabitStats}
              toggleHabit={toggleHabit}
              handleDeleteHabit={handleDeleteHabit}
              updateHabit={updateHabit}
              showAddHabit={showAddHabit}
              setShowAddHabit={setShowAddHabit}
              addHabit={addHabit}
              loading={loading}
              allHabits={habits}
            />
          </div>
          
          <div style={{ display: view === 'progress' ? 'block' : 'none' }}>
            {loading ? (
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
            <div className="progress-view-atomic">
              <div className="progress-hero">
                <h2 className="progress-title">Your Identity is Changing</h2>
                <p className="progress-subtitle">Every action is a vote for who you're becoming</p>
              </div>

              <div className="compound-effect-card">
                <div className="compound-header">
                  <span className="compound-icon">📈</span>
                  <div>
                    <h3>The Compound Effect</h3>
                    <p>1% better every day = 37x better in a year</p>
                  </div>
                </div>
                <div className="compound-stats">
                  <div className="stat-box">
                    <div className="stat-number">{stats.totalVotes}</div>
                    <div className="stat-label">Total Votes Cast</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">{stats.bestStreak}</div>
                    <div className="stat-label">Best Streak</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-number">{habits.length}</div>
                    <div className="stat-label">Active Habits</div>
                  </div>
                </div>
              </div>

              <div className="habits-progress-grid">
                {habits.map(habit => {
                  const daysSince = Math.floor((Date.now() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  const uniqueCompletedDays = new Set(habit.daily?.filter(d => d.completed).map(d => d.key)).size || 0;
                  const totalCompleted = Math.min(uniqueCompletedDays, daysSince);
                  const completionRate = daysSince > 0 ? Math.round((totalCompleted / daysSince) * 100) : 0;
                  
                  return (
                    <div key={habit.id} className="habit-progress-card">
                      <div className="habit-progress-header">
                        <div className="habit-icon-large">{habit.icon}</div>
                        <div className="habit-progress-info">
                          <h4>{habit.name}</h4>
                          <p className="identity-text">I am {habit.identity}</p>
                        </div>
                      </div>
                      
                      <div className="progress-metrics">
                        <div className="metric">
                          <span className="metric-value">{totalCompleted}</span>
                          <span className="metric-label">Completed</span>
                        </div>
                        <div className="metric">
                          <span className="metric-value">{daysSince - totalCompleted}</span>
                          <span className="metric-label">Missed</span>
                        </div>
                        <div className="metric">
                          <span className="metric-value">{completionRate}%</span>
                          <span className="metric-label">Success Rate</span>
                        </div>
                      </div>

                      <div className="pie-chart-container">
                        <svg viewBox="0 0 100 100" className="pie-chart">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#fee2e2"
                            strokeWidth="20"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="20"
                            strokeDasharray={`${completionRate * 2.51} ${251 - completionRate * 2.51}`}
                            strokeDashoffset="62.75"
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#667eea" />
                              <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="pie-chart-label">
                          <div className="pie-percentage">{completionRate}%</div>
                          <div className="pie-text">Complete</div>
                        </div>
                      </div>
                      
                      <div className="completion-stats">
                        <div className="stat-item-small completed">
                          <span className="stat-dot"></span>
                          <span>Completed: {totalCompleted} days</span>
                        </div>
                        <div className="stat-item-small missed">
                          <span className="stat-dot"></span>
                          <span>Missed: {daysSince - totalCompleted} days</span>
                        </div>
                      </div>
                      
                      <div className="calculation-formula">
                        <span className="formula-text">{totalCompleted} ÷ {daysSince} × 100 = {completionRate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="atomic-quote">
                <p>"You do not rise to the level of your goals. You fall to the level of your systems."</p>
                <span>— James Clear</span>
              </div>
            </div>
            )}
          </div>
          
          <div style={{ display: view === 'insights' ? 'block' : 'none' }}>
            {loading ? (
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
                    onUpdate={updateHabit}
                  />
                  <HabitProgression 
                    habit={selectedHabitForDetails}
                    onUpdate={updateHabit}
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
                onUpdateHabit={updateHabit}
              />
              <WeeklyReview 
                habits={habits}
                getHabitStats={getHabitStats}
              />
            </div>
            )}
          </div>
          
          <div style={{ display: view === 'tasks' ? 'block' : 'none' }}>
            <EisenhowerMatrix />
          </div>
          
          <div style={{ display: view === 'tools' ? 'block' : 'none' }}>
            {loading ? (
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
                onUpdateHabit={updateHabit}
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
          </div>
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

function Header({ view, setView, habits, onLogout }) {
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
          className={view === 'scorecard' ? 'active' : ''}
          onClick={() => setView('scorecard')}
        >
          Scorecard
        </button>
        <button 
          className={view === 'tasks' ? 'active' : ''}
          onClick={() => setView('tasks')}
        >
          Tasks
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
        <button 
          className="logout-btn"
          onClick={onLogout}
          title="Logout"
        >
          🚪
        </button>
      </nav>
    </header>
  );
}

const TodayView = React.memo(function TodayView({ habits, stats, getHabitStats, toggleHabit, handleDeleteHabit, updateHabit, showAddHabit, setShowAddHabit, addHabit, loading, allHabits }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = selectedDate;
  
  const todayHabits = useMemo(() => {
    const selectedDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return habits.filter(h => {
      const habitStartDate = new Date(h.startDate);
      const habitStartDateOnly = new Date(habitStartDate.getFullYear(), habitStartDate.getMonth(), habitStartDate.getDate());
      return habitStartDateOnly <= selectedDateOnly;
    });
  }, [habits, today]);
  
  const dateStats = useMemo(() => {
    const completed = todayHabits.filter(h => getHabitStats(h, today).isCompletedToday).length;
    return {
      totalHabits: todayHabits.length,
      completedToday: completed
    };
  }, [todayHabits, getHabitStats, today]);
  
  const completionPercentage = useMemo(() => 
    dateStats.totalHabits > 0 ? (dateStats.completedToday / dateStats.totalHabits) * 100 : 0,
    [dateStats]
  );
  
  const sortedHabits = useMemo(() => 
    [...todayHabits].sort((a, b) => {
      const timeA = a.time || '23:59';
      const timeB = b.time || '23:59';
      return timeA.localeCompare(timeB);
    }),
    [todayHabits]
  );

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
        <div className="date-navigation">
          <button 
            className="date-nav-btn"
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 86400000))}
            aria-label="Previous day"
          >
            ←
          </button>
          <h2>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
          <button 
            className="date-nav-btn"
            onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 86400000))}
            aria-label="Next day"
          >
            →
          </button>
        </div>
        
        <div className="progress-stats">
          <span className="progress-label">{selectedDate.toDateString() === new Date().toDateString() ? "Today's Progress" : "Progress"}</span>
          <span className="progress-count">{dateStats.completedToday}/{dateStats.totalHabits}</span>
          {dateStats.completedToday === dateStats.totalHabits && dateStats.totalHabits > 0 && (
            <div className="perfect-day-badge">
              🎆 Perfect Day!
            </div>
          )}
        </div>
      </div>
      
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

      <div className="today-actions">
        <button className="btn-add-habit" onClick={() => setShowAddHabit(!showAddHabit)}>
          {showAddHabit ? '✕' : '+'}
        </button>
      </div>

      {todayHabits.length === 0 ? (
        <EmptyState 
          icon="🎯"
          title="Build Your First Habit"
          description="Every action you take is a vote for the type of person you wish to become. Start with one small habit today."
          action="+ Create Your First Habit"
          onAction={() => setShowAddHabit(true)}
        />
      ) : sortedHabits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>📅 No habits started yet on this date</p>
          <p style={{ fontSize: '0.875rem' }}>Habits will appear here once their start date arrives</p>
        </div>
      ) : (
        <>
          {/* Uncompleted Habits */}
          <div className="habit-checklist">
            {sortedHabits.filter(habit => !getHabitStats(habit, today).isCompletedToday).map(habit => {
              const habitStats = getHabitStats(habit, today);
              return (
                <ImprovedHabitCard 
                  key={habit.id}
                  habit={habit}
                  stats={habitStats}
                  onToggle={() => toggleHabit(habit.id, today)}
                  onDelete={() => handleDeleteHabit(habit.id)}
                  onUpdate={updateHabit}
                  allHabits={allHabits}
                />
              );
            })}
          </div>

          {/* Completed Habits Section */}
          {sortedHabits.filter(habit => getHabitStats(habit, today).isCompletedToday).length > 0 && (
            <div className="completed-habits-section">
              <div className="completed-section-header">
                <h3 className="completed-title">
                  ✅ Completed ({sortedHabits.filter(habit => getHabitStats(habit, today).isCompletedToday).length})
                </h3>
                <div className="celebration-text">Great work! 🎉</div>
              </div>
              <div className="completed-habits-list">
                {sortedHabits.filter(habit => getHabitStats(habit, today).isCompletedToday).map(habit => {
                  const habitStats = getHabitStats(habit, today);
                  return (
                    <ImprovedHabitCard 
                      key={habit.id}
                      habit={habit}
                      stats={habitStats}
                      onToggle={() => toggleHabit(habit.id, today)}
                      onDelete={() => handleDeleteHabit(habit.id)}
                      onUpdate={updateHabit}
                      allHabits={allHabits}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
});

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
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');



  const addCustomHabit = () => {
    if (customHabit.trim()) {
      setHabits([...habits, { id: Date.now(), name: customHabit, rating: null }]);
      setCustomHabit('');
    }
  };

  const rateHabit = (id, rating) => {
    setHabits(habits.map(h => h.id === id ? { ...h, rating } : h));
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const saveEdit = (id) => {
    if (editValue.trim()) {
      setHabits(habits.map(h => h.id === id ? { ...h, name: editValue.trim() } : h));
    }
    setEditingId(null);
    setEditValue('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
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
            {editingId === habit.id ? (
              <input
                className="scorecard-edit-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(habit.id)}
                onKeyPress={(e) => e.key === 'Enter' && saveEdit(habit.id)}
                autoFocus
              />
            ) : (
              <span 
                className="scorecard-habit-name" 
                onDoubleClick={() => startEdit(habit.id, habit.name)}
                title="Double-click to edit"
              >
                {habit.name}
              </span>
            )}
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
              <button 
                className="delete-scorecard-btn"
                onClick={() => deleteHabit(habit.id)}
                title="Delete habit"
              >
                ×
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
