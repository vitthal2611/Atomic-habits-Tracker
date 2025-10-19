import React from 'react';
import './StreakVisualization.css';

const StreakVisualization = ({ streak, bestStreak }) => {
  const milestones = [7, 21, 30, 66, 100, 365];
  const nextMilestone = milestones.find(m => m > streak) || 365;
  const progress = (streak / nextMilestone) * 100;
  
  const getMilestoneEmoji = (days) => {
    if (days >= 365) return '🏆';
    if (days >= 100) return '💎';
    if (days >= 66) return '🌟';
    if (days >= 30) return '🔥';
    if (days >= 21) return '⚡';
    if (days >= 7) return '✨';
    return '🌱';
  };

  return (
    <div className="streak-visualization">
      <div className="streak-circle">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="var(--warning)" 
            strokeWidth="8"
            strokeDasharray={`${progress * 2.827} 282.7`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="streak-content">
          <div className="streak-emoji">{getMilestoneEmoji(streak)}</div>
          <div className="streak-number">{streak}</div>
          <div className="streak-label">day streak</div>
        </div>
      </div>
      <div className="streak-info">
        <div className="next-milestone">
          Next milestone: <strong>{nextMilestone} days</strong>
        </div>
        {bestStreak > streak && (
          <div className="best-streak">
            Personal best: {bestStreak} days
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakVisualization;
