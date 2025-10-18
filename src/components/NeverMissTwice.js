import React, { useState, useEffect } from 'react';

const NeverMissTwice = ({ habits, getHabitStats, onQuickComplete }) => {
  const [atRiskHabits, setAtRiskHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const atRisk = habits.filter(habit => {
      const yesterdayStats = getHabitStats(habit, yesterday);
      const todayStats = getHabitStats(habit, today);
      
      // Missed yesterday and haven't completed today yet
      return !yesterdayStats.isCompletedToday && !todayStats.isCompletedToday;
    });
    
    setAtRiskHabits(atRisk);
    
    // Show modal if there are at-risk habits and it's not too late in the day
    const hour = today.getHours();
    if (atRisk.length > 0 && hour >= 6 && hour <= 22) {
      const lastShown = localStorage.getItem('neverMissTwiceShown');
      const lastShownDate = lastShown ? new Date(lastShown) : null;
      
      if (!lastShownDate || lastShownDate.toDateString() !== today.toDateString()) {
        setTimeout(() => setShowModal(true), 2000);
        localStorage.setItem('neverMissTwiceShown', today.toISOString());
      }
    }
  }, [habits, getHabitStats]);
  
  if (atRiskHabits.length === 0) return null;
  
  return (
    <>
      {showModal && (
        <div className="never-miss-twice-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            <div className="modal-header">
              <div className="warning-icon">⚠️</div>
              <h3>Never Miss Twice!</h3>
              <p>You missed {atRiskHabits.length} habit{atRiskHabits.length > 1 ? 's' : ''} yesterday.</p>
            </div>
            
            <div className="modal-body">
              <p className="modal-message">
                Missing once is an accident. Missing twice is the start of a new habit.
                <strong> Don't let it happen.</strong>
              </p>
              
              <div className="at-risk-habits">
                {atRiskHabits.map(habit => {
                  const stats = getHabitStats(habit);
                  return (
                    <div key={habit.id} className="at-risk-habit">
                      <div className="habit-info">
                        <span className="habit-icon">{habit.icon}</span>
                        <div>
                          <div className="habit-name">{habit.name}</div>
                          <div className="habit-streak">Was on a {stats.streak} day streak</div>
                        </div>
                      </div>
                      <div className="quick-actions">
                        <button 
                          className="two-minute-btn"
                          onClick={() => {
                            onQuickComplete(habit.id);
                            setAtRiskHabits(prev => prev.filter(h => h.id !== habit.id));
                          }}
                        >
                          ⚡ Do 2-min version now
                        </button>
                        <div className="two-minute-text">{habit.twoMinuteVersion}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="modal-footer">
                <button className="commit-btn" onClick={() => setShowModal(false)}>
                  I'll do them today
                </button>
              </div>
            </div>
          </div>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
        </div>
      )}
      
      {!showModal && atRiskHabits.length > 0 && (
        <div className="never-miss-twice-banner" onClick={() => setShowModal(true)}>
          <span className="banner-icon">⚠️</span>
          <span className="banner-text">
            {atRiskHabits.length} habit{atRiskHabits.length > 1 ? 's' : ''} at risk - Never Miss Twice!
          </span>
          <span className="banner-action">Click to recover →</span>
        </div>
      )}
    </>
  );
};

export default NeverMissTwice;
