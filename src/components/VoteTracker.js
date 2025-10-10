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
  
  const totalHabits = habits.filter(habit => new Date() >= new Date(habit.startDate)).length;
  const overallConsistency = totalHabits > 0 ? Math.round(
    habits.filter(habit => new Date() >= new Date(habit.startDate))
      .reduce((sum, habit) => sum + getConsistency(habit), 0) / totalHabits
  ) : 0;

  const getViewTitle = () => {
    switch(view) {
      case 'weekly': return '📅 Weekly Identity Tracker';
      case 'monthly': return '📊 Monthly Progress View';
      case 'yearly': return '📈 Yearly Transformation';
      default: return 'Identity Tracker';
    }
  };

  const getViewSubtitle = () => {
    switch(view) {
      case 'weekly': return 'Every vote this week shapes who you become';
      case 'monthly': return 'Small daily changes create remarkable monthly results';
      case 'yearly': return 'Your complete identity transformation journey';
      default: return 'Track your identity votes';
    }
  };

  return (
    <div className="modern-vote-tracker">
      <div className="tracker-hero">
        <div className="hero-content">
          <h1 className="tracker-title">{getViewTitle()}</h1>
          <p className="tracker-subtitle">{getViewSubtitle()}</p>
        </div>
        
        <div className="overall-stats">
          <div className="stat-circle">
            <svg className="circle-svg" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="6"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallConsistency / 100)}`}
                className="consistency-stroke"
              />
            </svg>
            <div className="circle-content">
              <span className="consistency-percentage">{overallConsistency}%</span>
              <span className="consistency-label">Consistency</span>
            </div>
          </div>
          
          <div className="stats-summary">
            <div className="summary-item">
              <span className="summary-number">{totalHabits}</span>
              <span className="summary-label">Active Habits</span>
            </div>
            <div className="summary-item">
              <span className="summary-number">{days.length}</span>
              <span className="summary-label">{view === 'yearly' ? 'Months' : 'Days'} Tracked</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tracker-content">
        <div className="modern-tracker-grid">
          <div className="grid-header-modern">
            <div className="habit-column-header">
              <span className="header-icon">🎯</span>
              <span className="header-text">Identity Habits</span>
            </div>
            
            <div className="timeline-header">
              <div className="timeline-grid">
                {days.map((day, i) => (
                  <div key={i} className="timeline-day">
                    <div className="day-label">
                      {view === 'yearly' 
                        ? day.toLocaleDateString('en', {month: 'short'})
                        : view === 'weekly'
                        ? day.toLocaleDateString('en', {weekday: 'short'})
                        : day.getDate()
                      }
                    </div>
                    {view === 'weekly' && (
                      <div className="day-number">{day.getDate()}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="performance-header">
              <span className="header-icon">📈</span>
              <span className="header-text">Performance</span>
            </div>
          </div>
          
          <div className="habits-rows">
            {habits.filter(habit => new Date() >= new Date(habit.startDate)).map(habit => {
              const habitStats = getHabitStats(habit);
              const consistency = getConsistency(habit);
              
              return (
                <ModernHabitRow 
                  key={habit.id}
                  habit={habit}
                  days={days}
                  consistency={consistency}
                  habitStats={habitStats}
                  isCompleted={isCompleted}
                  toggleHabit={toggleHabit}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="tracker-legend">
        <div className="legend-title">📝 Legend</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot voted">✅</div>
            <span>Identity Vote Cast</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot empty">○</div>
            <span>Available Opportunity</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot star">🌟</div>
            <span>High Performer (80%+)</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot disabled">•</div>
            <span>Not Started Yet</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModernHabitRow = ({ habit, days, consistency, habitStats, isCompleted, toggleHabit }) => {
  const getPerformanceColor = () => {
    if (consistency >= 90) return '#10b981'; // Green
    if (consistency >= 70) return '#f59e0b'; // Yellow
    if (consistency >= 50) return '#3b82f6'; // Blue
    return '#ef4444'; // Red
  };

  const getPerformanceLabel = () => {
    if (consistency >= 90) return 'Excellent';
    if (consistency >= 70) return 'Good';
    if (consistency >= 50) return 'Fair';
    return 'Needs Focus';
  };

  return (
    <div className="modern-habit-row">
      <div className="habit-info-modern">
        <div className="habit-avatar">
          <span className="habit-icon">{habit.icon || '⭐'}</span>
        </div>
        <div className="habit-details-modern">
          <h4 className="habit-name">{habit.name}</h4>
          <p className="habit-identity">I am {habit.identity}</p>
          <div className="habit-frequency">
            <span className="frequency-badge">{habit.frequency}</span>
          </div>
        </div>
      </div>
      
      <div className="timeline-data">
        <div className="timeline-grid">
          {days.map((day, i) => {
            const canEdit = day >= new Date(habit.startDate);
            const completed = isCompleted(habit, day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={i} 
                className={`vote-cell-modern ${
                  canEdit ? 'interactive' : 'disabled'
                } ${isToday ? 'today' : ''}`}
                onClick={canEdit ? () => toggleHabit(habit.id, day) : undefined}
                title={`${habit.name} - ${day.toLocaleDateString()}: ${
                  completed ? 'Identity vote cast ✓' : canEdit ? 'Click to cast vote' : 'Not available yet'
                }`}
              >
                <div className={`vote-indicator ${completed ? 'voted' : 'empty'}`}>
                  {completed ? (
                    consistency >= 80 ? '🌟' : '✅'
                  ) : canEdit ? (
                    isToday ? '🗳️' : '○'
                  ) : '•'}
                </div>
                {isToday && <div className="today-pulse"></div>}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="performance-data">
        <div className="performance-score" style={{ '--performance-color': getPerformanceColor() }}>
          <div className="score-number">{consistency}%</div>
          <div className="score-label">{getPerformanceLabel()}</div>
        </div>
        
        <div className="performance-bar">
          <div 
            className="performance-fill" 
            style={{ 
              width: `${consistency}%`,
              backgroundColor: getPerformanceColor()
            }}
          ></div>
        </div>
        
        <div className="streak-info">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{habitStats.currentStreak || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default VoteTracker;