import React, { useState } from 'react';

const HabitProgression = ({ habit, onUpdate }) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState('');
  
  const progression = habit.progression || [
    { level: habit.twoMinuteVersion, date: habit.startDate, current: true }
  ];
  
  const handleLevelUp = () => {
    if (!newLevel.trim()) return;
    
    const updated = progression.map(p => ({ ...p, current: false }));
    updated.push({
      level: newLevel,
      date: new Date().toISOString(),
      current: true
    });
    
    onUpdate(habit.id, { progression: updated });
    setNewLevel('');
    setShowLevelUp(false);
  };
  
  const currentLevel = progression.find(p => p.current) || progression[progression.length - 1];
  const daysSinceStart = Math.floor((Date.now() - new Date(habit.startDate)) / (1000 * 60 * 60 * 24));
  const daysSinceLevel = Math.floor((Date.now() - new Date(currentLevel.date)) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="habit-progression">
      <div className="progression-header">
        <h4>📈 Habit Shaping</h4>
        <p>Track your journey from 2-minute version to mastery</p>
      </div>
      
      <div className="progression-timeline">
        {progression.map((level, idx) => (
          <div key={idx} className={`progression-level ${level.current ? 'current' : 'past'}`}>
            <div className="level-marker">{idx + 1}</div>
            <div className="level-content">
              <div className="level-text">{level.level}</div>
              <div className="level-date">
                {new Date(level.date).toLocaleDateString()}
                {level.current && ` (${daysSinceLevel} days)`}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="progression-stats">
        <div className="stat">
          <span className="stat-label">Current Level:</span>
          <span className="stat-value">{currentLevel.level}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Levels:</span>
          <span className="stat-value">{progression.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Days at Current:</span>
          <span className="stat-value">{daysSinceLevel}</span>
        </div>
      </div>
      
      {!showLevelUp ? (
        <button className="level-up-btn" onClick={() => setShowLevelUp(true)}>
          🎯 Level Up This Habit
        </button>
      ) : (
        <div className="level-up-form">
          <label>What's your next level?</label>
          <input 
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            placeholder="e.g., Read 5 pages, Do 20 pushups..."
            autoFocus
          />
          <div className="form-actions">
            <button onClick={handleLevelUp}>Save Level</button>
            <button onClick={() => setShowLevelUp(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      <div className="progression-tip">
        <strong>💡 Tip:</strong> Level up when current version feels easy for 2+ weeks. Small increases compound!
      </div>
    </div>
  );
};

export default HabitProgression;
