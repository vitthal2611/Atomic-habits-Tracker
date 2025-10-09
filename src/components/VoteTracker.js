import React, { useMemo } from 'react';
import './VoteTracker.css';

const VoteTracker = ({ habits, view, currentDate, getHabitStats, toggleHabit }) => {
  const days = useMemo(() => {
    const daysList = [];
    const now = currentDate || new Date();
    
    if (view === 'weekly') {
      // Get Monday of current week
      const monday = new Date(now);
      const dayOfWeek = now.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      monday.setDate(now.getDate() - daysFromMonday);
      
      // Show current week (7 days starting from Monday)
      for (let i = 0; i < 7; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        daysList.push(day);
      }
    } else if (view === 'monthly') {
      // Show all days of the current month
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        daysList.push(new Date(year, month, day));
      }
    } else if (view === 'yearly') {
      // Show last 12 months
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        daysList.push(month);
      }
    }
    return daysList;
  }, [view, currentDate]);

  const isCompleted = (habit, day) => {
    const key = (() => {
      if (habit.frequency === 'weekly' && view !== 'monthly') {
        const weekStart = new Date(day);
        const dayOfWeek = day.getDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        weekStart.setDate(day.getDate() - daysFromMonday);
        return `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
      } else if (habit.frequency === 'monthly') {
        return `${day.getFullYear()}-${day.getMonth()}`;
      } else if (habit.frequency === 'yearly') {
        return `${day.getFullYear()}`;
      }
      return day.toDateString();
    })();
    
    return habit.daily.some(entry => entry.key === key && entry.completed);
  };

  const getConsistency = (habit) => {
    const completed = days.filter(day => isCompleted(habit, day)).length;
    return Math.round((completed / days.length) * 100);
  };
  
  return (
    <section className="vote-tracker" aria-label={`${view} vote tracking`}>
      <div className="tracker-header-section">
        <h3>🗳️ Identity Votes - {view.charAt(0).toUpperCase() + view.slice(1)}</h3>
        <div className="period-info">
          {view === 'weekly' && 'Current Week - Every vote shapes who you become'}
          {view === 'monthly' && 'Monthly Progress - Small changes, remarkable results'}
          {view === 'yearly' && 'Last 12 Months - Your identity transformation'}
        </div>
      </div>
      
      <div className="tracker-container">
        <div className="tracker-grid" role="table">
          <div className="grid-header" role="row">
            <div className="habit-header" role="columnheader">
              <span>Habit</span>
            </div>
            <div className="days-header" role="columnheader">
              <div className="days-grid">
                {days.map((day, i) => (
                  <div key={i} className="day-header">
                    <div className="day-name">
                      {view === 'yearly' 
                        ? day.toLocaleDateString('en', {month: 'short'})
                        : view === 'weekly'
                        ? day.toLocaleDateString('en', {weekday: 'short'})
                        : view === 'monthly'
                        ? day.getDate()
                        : day.getDate()
                      }
                    </div>
                    {view === 'weekly' && (
                      <div className="day-date">{day.getDate()}</div>
                    )}
                    {view === 'monthly' && (
                      <div className="day-date">{day.toLocaleDateString('en', {weekday: 'short'})}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="rate-header" role="columnheader">Rate</div>
          </div>
          
          <div className="habits-container">
            {habits.filter(habit => new Date() >= new Date(habit.startDate)).map(habit => {
              const habitStats = getHabitStats(habit);
              const consistency = getConsistency(habit);
              
              return (
                <div key={habit.id} className="habit-row" role="row">
                  <div className="habit-info" role="cell">
                    <div className="habit-content">
                      <span className="habit-icon">{habit.icon}</span>
                      <div className="habit-details">
                        <span className="habit-name">{habit.name}</span>
                        <span className="frequency-badge">{habit.frequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="days-data" role="cell">
                    <div className="days-grid">
                      {days.map((day, i) => {
                        const canEdit = day >= new Date(habit.startDate);
                        const completed = isCompleted(habit, day);
                        return (
                          <div 
                            key={i} 
                            className={`vote-cell ${canEdit ? 'clickable' : 'disabled'}`}
                            onClick={canEdit ? () => toggleHabit(habit.id, day) : undefined}
                            title={`${habit.name} - ${day.toLocaleDateString()}: ${completed ? 'Identity vote cast ✓' : 'Cast your identity vote'}`}
                          >
                            <div className={`vote-dot ${completed ? 'voted' : 'empty'}`}>
                              {completed ? (consistency >= 80 ? '🌟' : '✓') : '○'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="consistency-rate" role="cell">
                    <div className="rate-value">{consistency}%</div>
                    <div className="rate-bar">
                      <div className="rate-fill" style={{width: `${consistency}%`}}></div>
                    </div>
                    <div className="streak-indicator">
                      🔥 {habitStats.currentStreak || 0}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="vote-legend">
        <div className="legend-item">
          <span className="legend-dot voted">✓</span>
          <span>Identity Vote Cast</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot empty">○</span>
          <span>Opportunity Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot voted">🌟</span>
          <span>High Performer (80%+)</span>
        </div>
      </div>
    </section>
  );
};

export default VoteTracker;