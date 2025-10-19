import React, { useState } from 'react';
import './MobileCalendar.css';

const MobileCalendar = ({ habit, getHabitStats }) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const today = new Date();
  
  const getWeekDays = (offset) => {
    const days = [];
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (offset * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const weekDays = getWeekDays(currentWeekOffset);
  const startDate = new Date(habit.startDate);
  
  const getDayStatus = (date) => {
    if (date > today) return 'future';
    if (date < startDate) return 'not-started';
    const stats = getHabitStats(habit, date);
    return stats.isCompletedToday ? 'completed' : 'missed';
  };
  
  const currentStreak = getHabitStats(habit, today).streak;
  const weekStats = weekDays.filter(d => getDayStatus(d) === 'completed').length;
  
  return (
    <div className="mobile-calendar">
      <div className="mobile-calendar-header">
        <div className="habit-info">
          <span className="habit-icon-large">{habit.icon}</span>
          <div>
            <h3 className="habit-name-mobile">{habit.name}</h3>
            <p className="habit-streak-mobile">🔥 {currentStreak} day streak</p>
          </div>
        </div>
      </div>
      
      <div className="week-navigation">
        <button 
          className="nav-btn"
          onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          aria-label="Previous week"
        >
          ←
        </button>
        <div className="week-label">
          {currentWeekOffset === 0 ? 'This Week' : 
           currentWeekOffset === -1 ? 'Last Week' :
           `${Math.abs(currentWeekOffset)} weeks ago`}
        </div>
        <button 
          className="nav-btn"
          onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          disabled={currentWeekOffset >= 0}
          aria-label="Next week"
        >
          →
        </button>
      </div>
      
      <div className="week-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="day-label">{day}</div>
        ))}
        {weekDays.map((date, i) => {
          const status = getDayStatus(date);
          return (
            <div 
              key={i} 
              className={`day-cell ${status}`}
              title={`${date.toLocaleDateString()}: ${status}`}
            >
              <span className="day-number">{date.getDate()}</span>
            </div>
          );
        })}
      </div>
      
      <div className="week-stats">
        <div className="stat-item">
          <span className="stat-value">{weekStats}/7</span>
          <span className="stat-label">This Week</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{Math.round((weekStats/7)*100)}%</span>
          <span className="stat-label">Completion</span>
        </div>
      </div>
    </div>
  );
};

export default MobileCalendar;
