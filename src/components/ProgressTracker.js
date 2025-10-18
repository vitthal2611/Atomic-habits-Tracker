import React, { useMemo } from 'react';

const ProgressTracker = ({ habits, getHabitStats, currentDate, period }) => {
  const stats = useMemo(() => {
    const now = new Date(currentDate);
    let startDate, days;

    switch (period) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        days = 7;
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        const endQuarter = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        days = Math.ceil((endQuarter - startDate) / (1000 * 60 * 60 * 24)) + 1;
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        days = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0);
        break;
      default:
        return null;
    }

    const habitData = habits.map(habit => {
      let completed = 0;
      for (let i = 0; i < days; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(startDate.getDate() + i);
        if (checkDate > now) break;
        const key = checkDate.toDateString();
        const entry = habit.daily?.find(e => e.key === key);
        if (entry?.completed) completed++;
      }
      return {
        habit,
        completed,
        total: Math.min(days, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)) + 1),
        percentage: Math.round((completed / Math.min(days, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)) + 1)) * 100)
      };
    });

    const totalCompleted = habitData.reduce((sum, h) => sum + h.completed, 0);
    const totalPossible = habitData.reduce((sum, h) => sum + h.total, 0);

    return {
      habitData,
      totalCompleted,
      totalPossible,
      overallPercentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
    };
  }, [habits, currentDate, period]);

  if (!stats) return null;

  const getPeriodLabel = () => {
    const date = new Date(currentDate);
    switch (period) {
      case 'weekly':
        return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'quarterly':
        const q = Math.floor(date.getMonth() / 3) + 1;
        return `Q${q} ${date.getFullYear()}`;
      case 'yearly':
        return date.getFullYear().toString();
      default:
        return '';
    }
  };

  return (
    <div className="progress-tracker">
      <div className="tracker-header">
        <h2>📊 {period.charAt(0).toUpperCase() + period.slice(1)} Progress</h2>
        <p className="period-label">{getPeriodLabel()}</p>
      </div>

      <div className="overall-progress">
        <div className="progress-circle">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="8"
              strokeDasharray={`${stats.overallPercentage * 3.39} 339`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <text x="60" y="60" textAnchor="middle" dy="7" fontSize="24" fontWeight="700" fill="#1e293b">
              {stats.overallPercentage}%
            </text>
          </svg>
        </div>
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-value">{stats.totalCompleted}</span>
            <span className="stat-label">Identity Votes Cast</span>
          </div>
          <div className="stat">
            <span className="stat-value">{stats.totalPossible}</span>
            <span className="stat-label">Possible Votes</span>
          </div>
        </div>
      </div>

      <div className="habits-progress-list">
        {stats.habitData.map(({ habit, completed, total, percentage }) => (
          <div key={habit.id} className="habit-progress-item">
            <div className="habit-info">
              <span className="habit-icon">{habit.icon || '⭐'}</span>
              <div className="habit-details">
                <span className="habit-name">{habit.name}</span>
                <span className="habit-identity">{habit.identity}</span>
              </div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="progress-text">{completed}/{total} ({percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
