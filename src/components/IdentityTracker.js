import React from 'react';

const IdentityTracker = ({ habits, view, getHabitStats, toggleHabit }) => {
  const getDays = () => {
    const days = [];
    const now = new Date();
    
    if (view === 'weekly') {
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        days.push(day);
      }
    } else if (view === 'monthly') {
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        days.push(day);
      }
    } else if (view === 'yearly') {
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        days.push(month);
      }
    }
    return days;
  };

  const isCompleted = (habit, day) => {
    const key = day.toDateString();
    return habit.daily.some(entry => entry.key === key && entry.completed);
  };

  const getConsistency = (habit) => {
    const days = getDays();
    const completed = days.filter(day => isCompleted(habit, day)).length;
    return Math.round((completed / days.length) * 100);
  };

  const getStreakByPeriod = (habit, period) => {
    const now = new Date();
    let streak = 0;
    
    if (period === 'weekly') {
      for (let week = 0; week < 52; week++) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() - (week * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const hasCompletionInWeek = habit.daily.some(entry => {
          const entryDate = new Date(entry.key);
          return entry.completed && entryDate >= weekStart && entryDate <= weekEnd;
        });
        
        if (hasCompletionInWeek) {
          streak++;
        } else {
          break;
        }
      }
    } else if (period === 'monthly') {
      for (let month = 0; month < 24; month++) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - month, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - month + 1, 0);
        
        const hasCompletionInMonth = habit.daily.some(entry => {
          const entryDate = new Date(entry.key);
          return entry.completed && entryDate >= monthStart && entryDate <= monthEnd;
        });
        
        if (hasCompletionInMonth) {
          streak++;
        } else {
          break;
        }
      }
    } else if (period === 'yearly') {
      for (let year = 0; year < 10; year++) {
        const yearStart = new Date(now.getFullYear() - year, 0, 1);
        const yearEnd = new Date(now.getFullYear() - year, 11, 31);
        
        const hasCompletionInYear = habit.daily.some(entry => {
          const entryDate = new Date(entry.key);
          return entry.completed && entryDate >= yearStart && entryDate <= yearEnd;
        });
        
        if (hasCompletionInYear) {
          streak++;
        } else {
          break;
        }
      }
    }
    
    return streak;
  };

  const days = getDays();
  
  return (
    <section className="identity-tracker" aria-label={`${view} identity tracking`}>
      <h3>🎯 Identity Reinforcement - {view.charAt(0).toUpperCase() + view.slice(1)} View</h3>
      
      <div className="tracker-grid" role="table" aria-label="Identity tracking grid">
        <div className="tracker-header" role="row">
          <div className="habit-col" role="columnheader">Identity</div>
          {days.map((day, i) => (
            <div key={i} className="day-col" role="columnheader">
              {view === 'yearly' ? day.toLocaleDateString('en', {month: 'short'}) : day.getDate()}
            </div>
          ))}
          <div className="consistency-col" role="columnheader">Consistency</div>
          <div className="streak-col" role="columnheader">Streak</div>
        </div>
        
        {habits.filter(habit => new Date() >= new Date(habit.startDate)).map(habit => {
          const habitStats = getHabitStats(habit);
          const periodStreak = getStreakByPeriod(habit, view);
          const consistency = getConsistency(habit);
          
          return (
            <div key={habit.id} className="habit-row" role="row">
              <div className="habit-identity" role="cell">
                <span className="icon" role="img" aria-label={habit.name}>{habit.icon}</span>
                <div className="identity-info">
                  <span className="identity-text">{habit.identity}</span>
                  <span className="start-date" title="Days since starting this identity">
                    {habitStats.daysSinceStart} days building
                  </span>
                </div>
              </div>
              
              {days.map((day, i) => {
                const canEdit = day >= new Date(habit.startDate);
                const completed = isCompleted(habit, day);
                return (
                  <div 
                    key={i} 
                    className="day-dot" 
                    onClick={canEdit ? () => toggleHabit(habit.id, day) : undefined}
                    role="cell"
                    tabIndex={canEdit ? 0 : -1}
                    onKeyDown={(e) => {
                      if (canEdit && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        toggleHabit(habit.id, day);
                      }
                    }}
                    aria-label={`${habit.name} on ${day.toLocaleDateString()}: ${completed ? 'completed' : 'not completed'}${canEdit ? ', click to toggle' : ''}`}
                  >
                    <div className={`dot ${canEdit ? 'clickable' : 'disabled'} ${completed ? 'completed' : ''}`}></div>
                  </div>
                );
              })}
              
              <div className="consistency-score" role="cell" aria-label={`${consistency}% consistency`}>
                {consistency}%
              </div>
              <div className="period-streak" role="cell" aria-label={`${periodStreak} ${view} streak`}>
                🔥 {periodStreak}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="identity-insight">
        <p>"Every action is a vote for the type of person you wish to become."</p>
        <p>Focus on consistency, not perfection. Small wins compound into identity change.</p>
      </div>
    </section>
  );
};

export default IdentityTracker;