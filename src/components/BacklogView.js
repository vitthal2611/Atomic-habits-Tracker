import React from 'react';

const BacklogView = ({ habits, toggleHabit }) => {
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      days.push(day);
    }
    return days;
  };

  const canEditDate = (habit, date) => {
    const startDate = new Date(habit.startDate);
    return date >= startDate;
  };

  const isCompleted = (habit, day) => {
    const key = day.toDateString();
    return habit.daily.some(entry => entry.key === key && entry.completed);
  };

  const days = getLast7Days();

  return (
    <section className="backlog-view" aria-label="Habit backlog">
      <h3>⏰ Catch Up on Missed Habits</h3>
      <p className="backlog-intro">Mark habits you completed but forgot to log. Every action counts toward your identity!</p>
      
      <div className="backlog-grid" role="table" aria-label="Habit completion grid">
        <div className="backlog-header" role="row">
          <div className="habit-col" role="columnheader">Habit</div>
          {days.map((day, i) => (
            <div key={i} className="day-col" role="columnheader">
              <div className="day-name">{day.toLocaleDateString('en', {weekday: 'short'})}</div>
              <div className="day-date">{day.getDate()}</div>
            </div>
          ))}
        </div>
        
        {habits.filter(habit => new Date() >= new Date(habit.startDate)).map(habit => (
          <div key={habit.id} className="backlog-row" role="row">
            <div className="habit-info" role="cell">
              <span className="habit-icon" role="img" aria-label={habit.name}>{habit.icon}</span>
              <span className="habit-name">{habit.name}</span>
            </div>
            {days.map((day, i) => {
              const canEdit = canEditDate(habit, day);
              const completed = isCompleted(habit, day);
              return (
                <div 
                  key={i} 
                  className={`backlog-cell ${canEdit ? 'editable' : 'disabled'}`} 
                  onClick={canEdit ? () => toggleHabit(habit.id, day) : undefined}
                  role="cell"
                  tabIndex={canEdit ? 0 : -1}
                  onKeyDown={(e) => {
                    if (canEdit && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      toggleHabit(habit.id, day);
                    }
                  }}
                  aria-label={`${habit.name} on ${day.toLocaleDateString()}: ${completed ? 'completed' : 'not completed'}${canEdit ? ', click to toggle' : ', cannot edit'}`}
                >
                  <div className={`backlog-dot ${completed ? 'completed' : ''} ${!canEdit ? 'disabled' : ''}`}>
                    {completed ? '✓' : '○'}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="backlog-note">
        <p>Click on any circle to mark that habit as completed for that day.</p>
      </div>
    </section>
  );
};

export default BacklogView;