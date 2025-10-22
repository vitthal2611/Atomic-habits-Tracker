import React, { useState } from 'react';
import './ImprovedTodayView.css';

const ImprovedHabitCard = ({ habit, stats, onToggle, onDelete, onUpdate }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(habit);

  const handleToggle = () => {
    if (!stats.isCompletedToday) {
      setShowConfetti(true);
      setJustCompleted(true);
      setTimeout(() => {
        setShowConfetti(false);
        setJustCompleted(false);
      }, 800);
    }
    onToggle();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${habit.name}"? This action can be undone.`)) {
      onDelete();
    }
  };

  return (
    <div className={`habit-card-improved ${stats.isCompletedToday ? 'completed' : ''} ${justCompleted ? 'just-completed' : ''}`}>
      {showConfetti && <ConfettiEffect />}
      
      <div className="habit-card-actions">
        <button className="edit-button-subtle" onClick={() => setIsEditing(!isEditing)} aria-label="Edit habit">
          {isEditing ? '✕' : '✏️'}
        </button>
        <button className="delete-button-subtle" onClick={handleDelete} aria-label="Delete habit">
          ×
        </button>
      </div>

      {isEditing ? (
        <div className="habit-edit-mode">
          <input
            className="edit-input-large"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            placeholder="Habit name"
          />
          <input
            className="edit-input"
            value={editData.identity}
            onChange={(e) => setEditData({...editData, identity: e.target.value})}
            placeholder="Who does this make you?"
          />
          <input
            className="edit-input"
            value={editData.twoMinuteVersion}
            onChange={(e) => setEditData({...editData, twoMinuteVersion: e.target.value})}
            placeholder="2-minute version"
          />
          <input
            className="edit-input"
            value={editData.cue || ''}
            onChange={(e) => setEditData({...editData, cue: e.target.value})}
            placeholder="When & where?"
          />
          <input
            type="time"
            className="edit-input"
            value={editData.time || ''}
            onChange={(e) => setEditData({...editData, time: e.target.value})}
          />
        </div>
      ) : (
        <>
          <div className="identity-first">
            <div className="identity-badge">I am {habit.identity}</div>
            {stats.streak > 0 && <div className="streak-mini">🔥 {stats.streak} day streak</div>}
          </div>

          <div className="habit-action">
            <div className="action-icon">{habit.icon}</div>
            <div className="action-details">
              <h3 className="action-name">{habit.name}</h3>
              <div className="action-cue">{habit.cue}</div>
            </div>
            {habit.time && (
              <div className="action-time">
                {new Date('2000-01-01 ' + habit.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </div>
            )}
          </div>

          <div className="two-minute-rule">
            <span className="rule-label">Start with:</span>
            <span className="rule-action">{habit.twoMinuteVersion}</span>
          </div>

          {habit.environment && (
            <div className="environment-cues">
              {habit.environment.makeObvious && (
                <div className="env-item">
                  <span className="env-icon">👁️</span>
                  <span className="env-text">{habit.environment.makeObvious}</span>
                </div>
              )}
              {habit.environment.makeEasy && (
                <div className="env-item">
                  <span className="env-icon">⚡</span>
                  <span className="env-text">{habit.environment.makeEasy}</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isEditing ? (
        <button
          className="cast-vote-button uncompleted"
          onClick={() => {
            onUpdate && onUpdate(habit.id, editData);
            setIsEditing(false);
          }}
        >
          <span className="vote-button-icon">💾</span>
          <span className="vote-button-text">Save Changes</span>
        </button>
      ) : (
        <button
          className={`cast-vote-button ${stats.isCompletedToday ? 'completed' : 'uncompleted'}`}
          onClick={handleToggle}
          disabled={stats.isCompletedToday}
          aria-label={stats.isCompletedToday ? 'Vote already cast' : 'Cast your identity vote'}
        >
          <span className="vote-button-icon">
            {stats.isCompletedToday ? '✅' : '🗳️'}
          </span>
          <span className="vote-button-text">
            {stats.isCompletedToday ? 'Vote Cast!' : 'Cast Your Vote'}
          </span>
        </button>
      )}
    </div>
  );
};

const ConfettiEffect = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60,
    delay: Math.random() * 0.2,
    color: ['#10b981', '#4f46e5', '#f59e0b'][i % 3]
  }));

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </>
  );
};

export default ImprovedHabitCard;
