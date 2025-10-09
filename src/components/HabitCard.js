import React, { useState } from 'react';

const HabitCard = ({ habit, stats, onToggle, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getDaysBuilding = () => {
    const start = new Date(habit.startDate);
    const now = new Date();
    return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
  };
  
  const getPeriodBuilding = () => {
    const start = new Date(habit.startDate);
    const now = new Date();
    
    if (habit.frequency === 'weekly') {
      return Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 7));
    } else if (habit.frequency === 'monthly') {
      return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
    } else if (habit.frequency === 'yearly') {
      return now.getFullYear() - start.getFullYear() + 1;
    }
    return getDaysBuilding();
  };
  
  const getPeriodLabel = () => {
    if (habit.frequency === 'weekly') return 'weeks';
    if (habit.frequency === 'monthly') return 'months';
    if (habit.frequency === 'yearly') return 'years';
    return 'days';
  };

  return (
    <div className={`habit-card ${stats.isCompletedToday ? 'completed' : ''} ${habit.frequency !== 'daily' ? habit.frequency : ''}`}>
      <div className="habit-header">
        <div className="habit-icon" role="img" aria-label={habit.name}>
          {habit.icon}
        </div>
        <div className="habit-actions">
          <button 
            className="delete-btn" 
            onClick={onDelete}
            aria-label={`Delete ${habit.name} habit`}
            title="Delete habit"
          >
            ×
          </button>
          <button 
            className={`big-toggle-btn ${stats.isCompletedToday ? 'completed' : ''}`}
            onClick={onToggle}
            aria-label={`${stats.isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}: ${habit.name}`}
          >
            {stats.isCompletedToday ? '✓ DONE' : 'DO IT'}
          </button>
        </div>
      </div>
      
      <div className="habit-body">
        <h4 className="habit-name">{habit.name}</h4>
        
        <div className="four-laws">
          <div className="law obvious" title="Implementation Intention">
            👁️ {habit.cue}
          </div>
          <div className="law attractive" title="Temptation Bundling">
            🎁 {habit.reward || 'Track completion'}
          </div>
          <div className="law easy" title="2-Minute Rule">
            ⏱️ {habit.twoMinuteVersion}
          </div>
          <div className="law satisfying" title="Habit Tracking">
            🔥 {stats.streak} {getPeriodLabel().slice(0, -1)} streak
            {stats.streak === 0 && (
              <div className="plateau-msg">Every expert was once a beginner</div>
            )}
          </div>
        </div>
        
        <div className="identity-statement">🎯 {habit.identity}</div>
        
        <div className="building">
          <div className="progress-momentum">
            <span className="building-text">
              📅 Starting from {new Date(habit.startDate).toLocaleDateString()} (streak: {stats.streak})
            </span>
            <div className="momentum-msg">
              {habit.frequency !== 'daily' ? `${habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} Progress > Daily Perfection` : 'Consistency > Perfection'}
            </div>
          </div>
        </div>
        
        {showDetails && (
          <div className="habit-details">
            <p><strong>Started:</strong> {new Date(habit.startDate).toLocaleDateString()}</p>
            <p><strong>Total completions:</strong> {habit.daily.filter(d => d.completed).length}</p>
          </div>
        )}
        
        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;