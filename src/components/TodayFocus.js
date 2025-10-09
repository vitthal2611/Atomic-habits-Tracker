import React, { useState } from 'react';

const TodayFocus = ({ habits, stats, getHabitStats, updateHabitCount, updateStartDate, currentDate }) => {
  const isToday = currentDate.toDateString() === new Date().toDateString();
  const dateTitle = isToday ? "Today's" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const isCurrentPeriod = (habit) => {
    const startDate = new Date(habit.startDate);
    
    // Only show habits that have started by the current viewing date
    if (currentDate < startDate) return false;
    
    return true;
  };
  
  const categorizeHabits = () => {
    const categories = {
      'Financial': [],
      'Health & Wellness': [],
      'Fitness & Movement': [],
      'Learning & Growth': [],
      'Productivity': [],
      'Social & Emotional': []
    };
    
    habits.filter(isCurrentPeriod).forEach(habit => {
      const name = habit.name.toLowerCase();
      if (name.includes('save') || name.includes('money') || name.includes('income') || name.includes('invest')) {
        categories['Financial'].push(habit);
      } else if (name.includes('water') || name.includes('tea') || name.includes('vitamin') || name.includes('fruit') || name.includes('floss') || name.includes('breath')) {
        categories['Health & Wellness'].push(habit);
      } else if (name.includes('push') || name.includes('squat') || name.includes('plank') || name.includes('walk') || name.includes('stretch') || name.includes('stand')) {
        categories['Fitness & Movement'].push(habit);
      } else if (name.includes('read') || name.includes('learn') || name.includes('podcast') || name.includes('piano') || name.includes('word')) {
        categories['Learning & Growth'].push(habit);
      } else if (name.includes('bed') || name.includes('organize') || name.includes('wash') || name.includes('priorities') || name.includes('phone') || name.includes('goal')) {
        categories['Productivity'].push(habit);
      } else {
        categories['Social & Emotional'].push(habit);
      }
    });
    
    return Object.entries(categories).filter(([_, habits]) => habits.length > 0);
  };
  
  const categorizedHabits = categorizeHabits();
  
  return (
    <div className="today-focus">
      <div className="today-header">
        <h2>{dateTitle} Identity Votes</h2>
        <div className={`today-score ${stats.completedToday === stats.totalHabits && stats.totalHabits > 0 ? 'perfect' : ''}`}>
          <span className="sr-only">Completed {stats.completedToday} out of {stats.totalHabits} habits</span>
          {stats.completedToday}/{stats.totalHabits}
        </div>
      </div>
      
      <div className="categories-container">
        {categorizedHabits.map(([category, categoryHabits]) => (
          <div key={category} className="habit-category">
            <h3 className="category-title">{category}</h3>
            <div className="category-habits">
              {categoryHabits.map(habit => {
                const habitStats = getHabitStats(habit, currentDate);
                return (
                  <TodayHabitCard 
                    key={habit.id}
                    habit={habit}
                    stats={habitStats}
                    onVote={() => updateHabitCount(habit.id, habitStats.isCompletedToday ? -1 : 1, currentDate)}
                    onUpdateStartDate={updateStartDate}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="today-quote">
        "Every action is a vote for the type of person you wish to become." - James Clear
      </div>
    </div>
  );
};

const TodayHabitCard = ({ habit, stats, onVote, onUpdateStartDate }) => {
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState('');
  
  const handleDateEdit = () => {
    const startDate = new Date(habit.startDate);
    setTempDate(startDate.toISOString().split('T')[0]);
    setIsEditingDate(true);
  };
  
  const handleDateSave = () => {
    if (tempDate && onUpdateStartDate) {
      onUpdateStartDate(habit.id, tempDate);
    }
    setIsEditingDate(false);
  };
  const getDaysBuilding = () => {
    const start = new Date(habit.startDate);
    const now = new Date();
    return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
  };
  
  const getPeriodBuilding = () => {
    const start = new Date(habit.startDate);
    const now = new Date();
    
    if (habit.frequency === 'weekly') {
      return Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 7));
    } else if (habit.frequency === 'monthly') {
      return (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
    } else if (habit.frequency === 'yearly') {
      return now.getFullYear() - start.getFullYear() + 1;
    }
    return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
  };
  
  const getPeriodLabel = () => {
    if (habit.frequency === 'weekly') return 'weeks';
    if (habit.frequency === 'monthly') return 'months';
    if (habit.frequency === 'yearly') return 'years';
    return 'days';
  };
  
  const isNonDaily = habit.frequency !== 'daily';

  return (
    <div className={`today-habit-card ${stats.isCompletedToday ? 'completed' : ''}`}>
      <div className="habit-header">
        <div className="habit-icon" role="img" aria-label={habit.name}>
          {habit.icon}
        </div>
        <button 
          className={`vote-btn ${stats.isCompletedToday ? 'voted' : ''}`}
          onClick={onVote}
          aria-label={`${stats.isCompletedToday ? 'Remove identity vote for' : 'Cast identity vote for'} ${habit.name}. Current streak: ${stats.streak} days`}
          aria-pressed={stats.isCompletedToday}
        >
          {stats.isCompletedToday ? '✓ IDENTITY VOTE CAST' : '🗳️ CAST YOUR IDENTITY VOTE'}
        </button>
      </div>
      <div className="habit-body">
        <h4 className="habit-name">🔗 After {habit.cue.replace('After ', '')}, I will {habit.name}</h4>
        <div className="four-laws">
          <div className="law obvious">👁️ <strong>Cue:</strong> {habit.cue}</div>
          <div className="law attractive">🎁 <strong>Craving:</strong> {habit.reward || 'Feel accomplished'}</div>
          <div className="law easy">⏱️ <strong>Response:</strong> {habit.twoMinuteVersion}</div>
          <div className="law satisfying">
            {stats.streak >= 7 ? '🏆' : stats.streak >= 3 ? '🔥' : '✨'} <strong>Reward:</strong> {stats.streak} day streak {stats.streak >= 21 ? '(Identity Master!)' : stats.streak >= 7 ? '(Strong Identity!)' : ''}
          </div>
        </div>
        <div className="identity-statement">🎯 {habit.identity}</div>
        <div className="building">
          {isEditingDate ? (
            <div className="date-edit">
              📅 Starting from 
              <input 
                type="date" 
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                onBlur={handleDateSave}
                onKeyDown={(e) => e.key === 'Enter' && handleDateSave()}
                autoFocus
              />
            </div>
          ) : (
            <div onClick={handleDateEdit} style={{cursor: 'pointer'}}>
              📅 Starting from {new Date(habit.startDate).toLocaleDateString()}
            </div>
          )}
          {isNonDaily && <div className="monthly-note">{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} habit - complete once this {habit.frequency === 'yearly' ? 'year' : habit.frequency === 'monthly' ? 'month' : 'week'}</div>}
        </div>
      </div>
    </div>
  );
};

export default TodayFocus;