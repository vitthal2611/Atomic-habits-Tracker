import React from 'react';

const HabitCalendar = ({ habit, getHabitStats }) => {
  const today = new Date();
  const startDate = new Date(habit.startDate);
  const daysToShow = 90;
  
  const getDayStatus = (date) => {
    if (date > today) return 'future';
    if (date < startDate) return 'not-started';
    const stats = getHabitStats(habit, date);
    return stats.isCompletedToday ? 'completed' : 'missed';
  };
  
  const days = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push({
      date,
      status: getDayStatus(date),
      day: date.getDate(),
      month: date.getMonth()
    });
  }
  
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  const currentStreak = getHabitStats(habit, today).streak;
  const totalCompleted = habit.daily?.filter(d => d.completed).length || 0;
  const totalDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
  const completionRate = totalDays > 0 ? Math.round((totalCompleted / totalDays) * 100) : 0;
  
  return (
    <div className="habit-calendar">
      <div className="calendar-header">
        <div className="habit-title">
          <span className="habit-icon">{habit.icon}</span>
          <span>{habit.name}</span>
        </div>
        <div className="calendar-stats">
          <span className="stat">🔥 {currentStreak} day streak</span>
          <span className="stat">✅ {completionRate}% complete</span>
        </div>
      </div>
      
      <div className="calendar-grid">
        <div className="weekday-labels">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="weekday-label">{day}</div>
          ))}
        </div>
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="calendar-week">
            {week.map((day, dayIdx) => (
              <div 
                key={dayIdx} 
                className={`calendar-day ${day.status}`}
                title={`${day.date.toLocaleDateString()}: ${day.status}`}
              >
                {day.day === 1 && <span className="day-number">{day.day}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-box completed"></div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-box missed"></div>
          <span>Missed</span>
        </div>
        <div className="legend-item">
          <div className="legend-box future"></div>
          <span>Future</span>
        </div>
      </div>
      
      <div className="chain-message">
        {currentStreak === 0 && "🎯 Start your chain today!"}
        {currentStreak > 0 && currentStreak < 7 && "🌱 Keep the chain going!"}
        {currentStreak >= 7 && currentStreak < 21 && "🔥 Don't break the chain!"}
        {currentStreak >= 21 && "🏆 Incredible chain! You're unstoppable!"}
      </div>
    </div>
  );
};

export default HabitCalendar;
