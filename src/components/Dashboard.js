import React, { useState, useMemo } from 'react';
import AddHabit from './AddHabit';
import './Dashboard.css';

const Dashboard = ({ habits, stats, getHabitStats, toggleHabit, currentDate, addHabit, loading }) => {
  const [focusMode, setFocusMode] = useState('today');
  const [showAddHabit, setShowAddHabit] = useState(false);
  
  const todayHabits = useMemo(() => 
    habits.filter(h => new Date(h.startDate) <= currentDate)
  , [habits, currentDate]);

  const identityScore = useMemo(() => {
    const completed = todayHabits.filter(h => {
      const stats = getHabitStats(h, currentDate);
      return stats && stats.isCompletedToday;
    }).length;
    return Math.round((completed / Math.max(todayHabits.length, 1)) * 100);
  }, [todayHabits, getHabitStats, currentDate]);

  return (
    <div className="dashboard-container">
      {/* Hero Section - Make It Obvious */}
      <section className="hero-section">
        <div className="identity-compass">
          <div className="compass-ring">
            <div className="identity-score" style={{'--score': identityScore}}>
              <span className="score-value">{identityScore}%</span>
              <span className="score-label">Identity Strength</span>
            </div>
          </div>
          <div className="identity-message">
            {identityScore >= 90 ? '🏆 Identity Master' :
             identityScore >= 70 ? '🔥 Strong Identity' :
             identityScore >= 50 ? '🌱 Growing Identity' :
             '✨ Building Identity'}
          </div>
        </div>
        
        <div className="daily-mantra">
          <h1>Every action is a vote for who you're becoming</h1>
          <p>Cast your identity votes today</p>
        </div>
      </section>

      {/* Quick Actions - Make It Easy */}
      <section className="quick-actions">
        <div className="action-cards">
          {/* Add New Habit Card - Always First */}
          <div className="quick-card add-habit-card">
            <div className="quick-icon">➕</div>
            <div className="quick-content">
              <h3>Create New Habit</h3>
              <p>Build your atomic system</p>
            </div>
            <button 
              className="quick-vote add-btn"
              onClick={() => setShowAddHabit(!showAddHabit)}
              aria-label="Add new habit"
            >
              {showAddHabit ? '✕' : '+'}
            </button>
          </div>
          
          {todayHabits.slice(0, 2).map(habit => {
            const habitStats = getHabitStats(habit, currentDate);
            return (
              <QuickActionCard 
                key={habit.id}
                habit={habit}
                stats={habitStats}
                onVote={() => toggleHabit(habit.id, currentDate)}
              />
            );
          })}
        </div>
      </section>

      {/* Add Habit Form */}
      {showAddHabit && (
        <section className="add-habit-section">
          <AddHabit onAdd={addHabit} loading={loading} />
        </section>
      )}

      {/* Habit Grid - Make It Attractive */}
      <section className="habits-section">
        <div className="section-header">
          <h2>Today's Identity Votes</h2>
          <div className="progress-ring">
            <svg viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray={`${identityScore}, 100`}
                className="progress-path"
              />
            </svg>
            <span className="progress-text">{stats.completedToday}/{stats.totalHabits}</span>
          </div>
        </div>
        
        <div className="habits-grid">
          {todayHabits.map(habit => {
            const habitStats = getHabitStats(habit, currentDate);
            return (
              <HabitCard 
                key={habit.id}
                habit={habit}
                stats={habitStats}
                onVote={() => toggleHabit(habit.id, currentDate)}
              />
            );
          })}
        </div>
      </section>

      {/* Compound Growth - Make It Satisfying */}
      <section className="compound-section">
        <CompoundVisualization stats={stats} />
      </section>
    </div>
  );
};

const QuickActionCard = ({ habit, stats, onVote }) => {
  const safeStats = stats || { isCompletedToday: false, streak: 0, todayCount: 0 };
  return (
    <div className={`quick-card ${safeStats.isCompletedToday ? 'completed' : ''}`}>
      <div className="quick-icon">{habit.icon}</div>
      <div className="quick-content">
        <h3>{habit.name}</h3>
        <p>{habit.identity}</p>
      </div>
      <button 
        className={`quick-vote ${safeStats.isCompletedToday ? 'voted' : ''}`}
        onClick={onVote}
        aria-label={`Vote for ${habit.name}`}
      >
        {safeStats.isCompletedToday ? '✓' : '○'}
      </button>
    </div>
  );
};

const HabitCard = ({ habit, stats, onVote }) => {
  const safeStats = stats || { isCompletedToday: false, streak: 0, todayCount: 0 };
  return (
    <div className={`habit-card ${safeStats.isCompletedToday ? 'completed' : ''}`}>
      <div className="card-header">
        <span className="habit-icon">{habit.icon}</span>
        <div className="streak-badge">
          {safeStats.streak > 0 && (
            <>
              <span className="streak-fire">🔥</span>
              <span className="streak-count">{safeStats.streak}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="card-body">
        <h3 className="habit-name">{habit.name}</h3>
        <p className="habit-identity">{habit.identity}</p>
        
        <div className="habit-cue">
          <span className="cue-icon">🔗</span>
          <span>{habit.cue}</span>
        </div>
      </div>
      
      <div className="card-footer">
        <button 
          className={`vote-button ${safeStats.isCompletedToday ? 'voted' : ''}`}
          onClick={onVote}
          aria-pressed={safeStats.isCompletedToday}
        >
          <span className="vote-icon">
            {safeStats.isCompletedToday ? '✓' : '🗳️'}
          </span>
          <span className="vote-text">
            {safeStats.isCompletedToday ? 'Vote Cast' : 'Cast Vote'}
          </span>
        </button>
      </div>
    </div>
  );
};

const CompoundVisualization = ({ stats }) => {
  const compoundValue = Math.pow(1.01, stats.avgDays);
  
  return (
    <div className="compound-viz">
      <div className="compound-header">
        <h2>🚀 Your Compound Growth</h2>
        <p>Small changes, remarkable results</p>
      </div>
      
      <div className="growth-metrics">
        <div className="metric">
          <div className="metric-value">{stats.totalVotes}</div>
          <div className="metric-label">Identity Votes</div>
        </div>
        <div className="metric highlight">
          <div className="metric-value">{compoundValue.toFixed(1)}x</div>
          <div className="metric-label">Growth Multiplier</div>
        </div>
        <div className="metric">
          <div className="metric-value">{stats.avgDays}</div>
          <div className="metric-label">Days Building</div>
        </div>
      </div>
      
      <div className="compound-quote">
        "You do not rise to the level of your goals. You fall to the level of your systems."
      </div>
    </div>
  );
};

export default Dashboard;