import React, { useState } from 'react';
import EditHabitWizard from './EditHabitWizard';
import './ImprovedTodayView.css';

const ImprovedHabitCard = ({ habit, stats, onToggle, onDelete, onUpdate, allHabits }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showEditWizard, setShowEditWizard] = useState(false);

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
        <button className="edit-button-subtle" onClick={() => setShowEditWizard(true)} aria-label="Edit habit">
          ✏️
        </button>
        <button className="delete-button-subtle" onClick={handleDelete} aria-label="Delete habit">
          ×
        </button>
      </div>

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

      <button
        className={`cast-vote-button ${stats.isCompletedToday ? 'completed' : 'uncompleted'}`}
        onClick={handleToggle}
        aria-label={stats.isCompletedToday ? 'Remove vote' : 'Cast your identity vote'}
      >
        <span className="vote-button-icon">
          {stats.isCompletedToday ? '✅' : '🗳️'}
        </span>
        <span className="vote-button-text">
          {stats.isCompletedToday ? 'Vote Cast!' : 'Cast Your Vote'}
        </span>
      </button>
      
      {showEditWizard && (
        <EditHabitWizard
          habit={habit}
          habits={allHabits}
          onComplete={(updatedHabit) => {
            onUpdate && onUpdate(habit.id, updatedHabit);
            setShowEditWizard(false);
          }}
          onCancel={() => setShowEditWizard(false)}
        />
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
