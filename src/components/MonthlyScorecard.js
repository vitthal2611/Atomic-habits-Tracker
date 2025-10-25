import React, { useState, useEffect } from 'react';

const MonthlyScorecard = ({ onClose }) => {
  const [currentHabits, setCurrentHabits] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  

  
  const loadCurrentHabits = () => {
    const habits = [
      'Wake up', 'Check phone', 'Coffee', 'Exercise', 'Shower',
      'Breakfast', 'Work', 'Social media', 'Lunch', 'Snacks',
      'Dinner', 'TV', 'Read', 'Go to bed'
    ];
    setCurrentHabits(habits.map((h, i) => ({ id: i, name: h, rating: null, changed: false })));
  };
  
  const handleStartReview = () => {
    loadCurrentHabits();
    setShowPrompt(false);
  };
  
  const rateHabit = (id, rating) => {
    setCurrentHabits(prev => prev.map(h => 
      h.id === id ? { ...h, rating } : h
    ));
  };
  
  const markChanged = (id) => {
    setCurrentHabits(prev => prev.map(h => 
      h.id === id ? { ...h, changed: !h.changed } : h
    ));
  };
  
  const handleComplete = () => {
    onClose();
  };
  
  if (!showPrompt && currentHabits.length === 0) return null;
  
  if (showPrompt) {
    return (
      <div className="monthly-scorecard-prompt">
        <div className="prompt-content">
          <h3>📋 Monthly Habit Audit</h3>
          <p>It's been 30 days since your last review.</p>
          <p>Let's check: Are your habits still serving you?</p>
          <button className="start-review-btn" onClick={handleStartReview}>
            Start Monthly Review
          </button>
          <button className="skip-btn" onClick={onClose}>Skip for now</button>
        </div>
      </div>
    );
  }
  
  const allRated = currentHabits.every(h => h.rating !== null);
  
  return (
    <div className="monthly-scorecard-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="scorecard-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>📋 Monthly Habit Scorecard</h2>
        <p>Rate your current habits. Mark any that have changed since last month.</p>
        
        <div className="scorecard-list">
          {currentHabits.map(habit => (
            <div key={habit.id} className="scorecard-item">
              <div className="habit-name-section">
                <span className="habit-name">{habit.name}</span>
                <label className="changed-checkbox">
                  <input 
                    type="checkbox"
                    checked={habit.changed}
                    onChange={() => markChanged(habit.id)}
                  />
                  Changed
                </label>
              </div>
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
        
        <div className="scorecard-summary">
          <div className="summary-stat good">
            <span className="stat-num">{currentHabits.filter(h => h.rating === 'good').length}</span>
            <span className="stat-label">Good</span>
          </div>
          <div className="summary-stat neutral">
            <span className="stat-num">{currentHabits.filter(h => h.rating === 'neutral').length}</span>
            <span className="stat-label">Neutral</span>
          </div>
          <div className="summary-stat bad">
            <span className="stat-num">{currentHabits.filter(h => h.rating === 'bad').length}</span>
            <span className="stat-label">Bad</span>
          </div>
        </div>
        
        <button 
          className="complete-review-btn"
          onClick={handleComplete}
          disabled={!allRated}
        >
          {allRated ? 'Complete Review' : 'Rate all habits to continue'}
        </button>
      </div>
    </div>
  );
};

export default MonthlyScorecard;
