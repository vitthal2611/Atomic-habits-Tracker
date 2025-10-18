import React from 'react';

const GoldilocksRule = ({ habits, getHabitStats, onUpdateDifficulty }) => {
  const analyzeHabit = (habit) => {
    const stats = getHabitStats(habit);
    const completionRate = stats.daysSinceStart > 0 
      ? (stats.streak / stats.daysSinceStart) * 100 
      : 0;

    if (completionRate >= 90) return 'too-easy';
    if (completionRate <= 40) return 'too-hard';
    return 'just-right';
  };

  const getRecommendation = (status, habit) => {
    switch (status) {
      case 'too-easy':
        return {
          icon: '📈',
          title: 'Level Up!',
          message: `${habit.name} is too easy. Time to increase the challenge.`,
          action: 'Increase difficulty',
          color: '#10b981'
        };
      case 'too-hard':
        return {
          icon: '📉',
          title: 'Scale Back',
          message: `${habit.name} might be too difficult. Return to your 2-minute version.`,
          action: 'Reduce to: ' + habit.twoMinuteVersion,
          color: '#ef4444'
        };
      default:
        return {
          icon: '🎯',
          title: 'Perfect Zone',
          message: `${habit.name} is at the right difficulty level.`,
          action: 'Keep going!',
          color: '#f59e0b'
        };
    }
  };

  return (
    <div className="goldilocks-rule">
      <div className="goldilocks-header">
        <h3>🎯 The Goldilocks Rule</h3>
        <p>Habits are most engaging when at the edge of your abilities</p>
      </div>

      <div className="goldilocks-explanation">
        <div className="difficulty-spectrum">
          <div className="spectrum-item too-easy">
            <div className="spectrum-icon">😴</div>
            <div className="spectrum-label">Too Easy</div>
            <div className="spectrum-desc">Boring, no growth</div>
          </div>
          <div className="spectrum-item just-right">
            <div className="spectrum-icon">🔥</div>
            <div className="spectrum-label">Just Right</div>
            <div className="spectrum-desc">Challenging, engaging</div>
          </div>
          <div className="spectrum-item too-hard">
            <div className="spectrum-icon">😰</div>
            <div className="spectrum-label">Too Hard</div>
            <div className="spectrum-desc">Overwhelming, quit</div>
          </div>
        </div>
      </div>

      <div className="habit-difficulty-list">
        {habits.map(habit => {
          const status = analyzeHabit(habit);
          const rec = getRecommendation(status, habit);
          const stats = getHabitStats(habit);
          const completionRate = stats.daysSinceStart > 0 
            ? Math.round((stats.streak / stats.daysSinceStart) * 100)
            : 0;

          return (
            <div key={habit.id} className={`difficulty-card ${status}`} style={{ '--card-color': rec.color }}>
              <div className="difficulty-header">
                <div className="habit-info">
                  <span className="habit-icon">{habit.icon}</span>
                  <span className="habit-name">{habit.name}</span>
                </div>
                <div className="completion-badge">{completionRate}%</div>
              </div>

              <div className="difficulty-status">
                <span className="status-icon">{rec.icon}</span>
                <div className="status-content">
                  <div className="status-title">{rec.title}</div>
                  <div className="status-message">{rec.message}</div>
                </div>
              </div>

              <div className="difficulty-action">
                <div className="action-text">{rec.action}</div>
                {status !== 'just-right' && (
                  <button 
                    className="adjust-btn"
                    onClick={() => onUpdateDifficulty && onUpdateDifficulty(habit.id, status)}
                  >
                    Adjust
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="goldilocks-tips">
        <h4>Tips for Finding Your Sweet Spot</h4>
        <ul>
          <li><strong>Start too easy:</strong> It's better to start with a habit that's too easy than too hard</li>
          <li><strong>Progressive overload:</strong> Gradually increase difficulty as habits become automatic</li>
          <li><strong>Track completion:</strong> 70-80% success rate is ideal for growth</li>
          <li><strong>Scale back when needed:</strong> Return to 2-minute version if you miss 2+ days</li>
        </ul>
      </div>

      <div className="goldilocks-quote">
        "The greatest threat to success is not failure but boredom. We get bored with habits because they stop offering novelty."
      </div>
    </div>
  );
};

export default GoldilocksRule;
