import React, { useState } from 'react';

const HabitCard = ({ habit, stats, onToggle, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getPeriodLabel = () => {
    if (habit.frequency === 'weekly') return 'weeks';
    if (habit.frequency === 'monthly') return 'months';
    if (habit.frequency === 'yearly') return 'years';
    return 'days';
  };

  const getStreakMessage = () => {
    if (stats.streak >= 21) return { icon: '🏆', message: 'Identity Master!', color: '#f59e0b' };
    if (stats.streak >= 7) return { icon: '🔥', message: 'Strong Identity!', color: '#ef4444' };
    if (stats.streak >= 3) return { icon: '⭐', message: 'Building Momentum!', color: '#8b5cf6' };
    if (stats.streak >= 1) return { icon: '🌱', message: 'Great Start!', color: '#10b981' };
    return { icon: '✨', message: 'Ready to Begin!', color: '#6b7280' };
  };

  const streakInfo = getStreakMessage();

  return (
    <div className={`modern-habit-card ${stats.isCompletedToday ? 'completed' : ''} ${habit.frequency !== 'daily' ? habit.frequency : ''}`}>
      <div className="card-glow"></div>
      
      <div className="card-header">
        <div className="habit-icon-container">
          <div className="habit-icon" role="img" aria-label={habit.name}>
            {habit.icon || '⭐'}
          </div>
          <div className="streak-indicator" style={{ '--streak-color': streakInfo.color }}>
            <span className="streak-icon">{streakInfo.icon}</span>
            <span className="streak-count">{stats.streak}</span>
          </div>
        </div>
        
        <div className="card-actions">
          <button 
            className="delete-button" 
            onClick={onDelete}
            aria-label={`Delete ${habit.name} habit`}
            title="Delete habit"
          >
            <span className="delete-icon">🗑️</span>
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="habit-title">{habit.name}</h3>
        <p className="habit-identity">I am {habit.identity}</p>
        
        <div className="habit-cue">
          <span className="cue-icon">🔗</span>
          <span className="cue-text">{habit.cue}</span>
        </div>
        
        <div className="two-minute-rule">
          <span className="rule-icon">⚡</span>
          <span className="rule-text">{habit.twoMinuteVersion}</span>
        </div>
        
        <div className="streak-message" style={{ '--message-color': streakInfo.color }}>
          <span className="message-icon">{streakInfo.icon}</span>
          <span className="message-text">{streakInfo.message}</span>
        </div>
        
        <div className="habit-meta">
          <span className="start-date">
            📅 Since {new Date(habit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="frequency-badge">{habit.frequency}</span>
        </div>
      </div>
      
      <div className="card-footer">
        <button 
          className={`vote-action-btn ${stats.isCompletedToday ? 'voted' : ''}`}
          onClick={onToggle}
          aria-label={`${stats.isCompletedToday ? 'Remove vote for' : 'Cast vote for'}: ${habit.name}`}
        >
          <span className="vote-icon">
            {stats.isCompletedToday ? '✅' : '🗳️'}
          </span>
          <span className="vote-text">
            {stats.isCompletedToday ? 'Vote Cast!' : 'Cast Vote'}
          </span>
          <div className="vote-ripple"></div>
        </button>
      </div>
      
      {showDetails && (
        <div className="habit-details-modern">
          <div className="detail-item">
            <span className="detail-label">Started:</span>
            <span className="detail-value">{new Date(habit.startDate).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Reward:</span>
            <span className="detail-value">{habit.reward || 'Track completion'}</span>
          </div>
        </div>
      )}
      
      <button 
        className="details-toggle-modern"
        onClick={() => setShowDetails(!showDetails)}
        aria-expanded={showDetails}
      >
        <span className="toggle-icon">{showDetails ? '▲' : '▼'}</span>
        <span className="toggle-text">{showDetails ? 'Less' : 'More'}</span>
      </button>
    </div>
  );
};

export default HabitCard;