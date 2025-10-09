import React from 'react';

const YesterdayView = ({ habits, getHabitStats }) => {
  const getYesterdayKey = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString();
  };

  const wasCompletedYesterday = (habit) => {
    const key = getYesterdayKey();
    return habit.daily.some(entry => entry.key === key && entry.completed);
  };

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const completedCount = habits.filter(h => wasCompletedYesterday(h)).length;
  const identityScore = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <section className="yesterday-view" aria-label="Yesterday's progress">
      <h3>📅 Yesterday's Identity Building</h3>
      <div className="yesterday-summary">
        <div className="summary-card">
          <div className="summary-value" aria-label={`${completedCount} out of ${habits.length} habits completed`}>
            {completedCount}/{habits.length}
          </div>
          <div className="summary-label">Habits Completed</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{identityScore}%</div>
          <div className="summary-label">Identity Score</div>
        </div>
      </div>
      
      <div className="yesterday-habits">
        {habits.filter(habit => new Date() >= new Date(habit.startDate)).map(habit => {
          const completed = wasCompletedYesterday(habit);
          return (
            <div key={habit.id} className={`yesterday-habit ${completed ? 'completed' : 'missed'}`}>
              <div className="habit-info">
                <span className="habit-icon" role="img" aria-label={habit.name}>{habit.icon}</span>
                <div className="habit-details">
                  <div className="habit-name">{habit.name}</div>
                  <div className="habit-identity">{habit.identity}</div>
                </div>
              </div>
              <div className="completion-status" aria-label={completed ? 'Completed yesterday' : 'Missed yesterday'}>
                {completed ? '✅ Completed' : '❌ Missed'}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="yesterday-reflection">
        <p>"Every action is a vote for the type of person you wish to become."</p>
        <p>Reflect on yesterday's votes and use them to guide today's choices.</p>
      </div>
    </section>
  );
};

export default YesterdayView;