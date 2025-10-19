import React, { useState } from 'react';
import './ImprovedTodayView.css';

const ImprovedHabitCard = ({ habit, stats, onToggle, onDelete }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

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
      
      <button className="delete-button-subtle" onClick={handleDelete} aria-label="Delete habit">
        ×
      </button>

      <div className="habit-card-header">
        <div className="habit-main-info">
          <h3 className="habit-name-large">
            {habit.icon} {habit.name}
          </h3>
          <p className="habit-identity-prominent">
            I am {habit.identity}
          </p>
        </div>
        
        {stats.streak > 0 && (
          <div className="habit-streak-badge">
            🔥 {stats.streak}
          </div>
        )}
      </div>

      <div className="two-minute-prominent">
        <div className="two-minute-icon">⚡</div>
        <div className="two-minute-text">
          <div className="two-minute-label">Start Here</div>
          <div className="two-minute-action">{habit.twoMinuteVersion}</div>
        </div>
      </div>

      <div className="habit-metadata">
        {habit.cue && (
          <div className="metadata-item">
            <span>🔗</span>
            <span>{habit.cue}</span>
          </div>
        )}
        {habit.visualCue && (
          <div className="metadata-item">
            <span>👁️</span>
            <span>{habit.visualCue}</span>
          </div>
        )}
        {habit.accountabilityPartner && (
          <div className="metadata-item">
            <span>🤝</span>
            <span>{habit.accountabilityPartner}</span>
          </div>
        )}
      </div>

      <button
        className={`cast-vote-button ${stats.isCompletedToday ? 'completed' : 'uncompleted'}`}
        onClick={handleToggle}
        aria-label={stats.isCompletedToday ? 'Mark as incomplete' : 'Cast your identity vote'}
      >
        <span className="vote-button-icon">
          {stats.isCompletedToday ? '✅' : '🗳️'}
        </span>
        <span className="vote-button-text">
          {stats.isCompletedToday ? 'Vote Cast!' : 'Cast Your Vote'}
        </span>
      </button>
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
