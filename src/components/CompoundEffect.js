import React from 'react';

const CompoundEffect = ({ stats }) => {
  const compoundValue = Math.pow(1.01, stats.avgDays).toFixed(1);
  const weeklyStrength = Math.min(100, Math.round((stats.totalVotes / Math.max(stats.totalHabits * 7, 1)) * 100));
  
  return (
    <div className="compound-effect">
      <div className="compound-header">
        <h3>🚀 Your Compound Growth</h3>
        <div className="one-percent">
          1% better today = {compoundValue}x better in {stats.avgDays} days
        </div>
      </div>
      <div className="compound-stats">
        <div className="compound-card">
          <div className="compound-value">{stats.totalVotes}</div>
          <div className="compound-label">Total Identity Votes Cast</div>
        </div>
        <div className="compound-card identity-strength">
          <div className="compound-value">{weeklyStrength}%</div>
          <div className="compound-label">Weekly Identity Strength</div>
        </div>
        <div className="compound-card">
          <div className="compound-value">{stats.avgDays}</div>
          <div className="compound-label">Avg Days Building</div>
        </div>
      </div>
      <div className="becoming-statement">
        {weeklyStrength >= 90 ? '🏆 You are a Habit Master!' : 
         weeklyStrength >= 70 ? '🔥 You are building strong identity!' :
         weeklyStrength >= 50 ? '🌱 You are growing consistently!' :
         '🌟 Every vote counts - you\'re building your future self!'}
      </div>
    </div>
  );
};

export default CompoundEffect;