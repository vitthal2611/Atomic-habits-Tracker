import React, { useState } from 'react';

const TodayFocus = ({ habits, stats, getHabitStats, updateHabitCount, updateStartDate, currentDate }) => {
  const isToday = currentDate.toDateString() === new Date().toDateString();
  const dateTitle = isToday ? "Today's" : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const isCurrentPeriod = (habit) => {
    const startDate = new Date(habit.startDate);
    return currentDate >= startDate;
  };
  
  const categorizeHabits = () => {
    const categories = {
      '💰 Financial': { habits: [], color: '#f59e0b', icon: '💰' },
      '🌱 Health & Wellness': { habits: [], color: '#10b981', icon: '🌱' },
      '💪 Fitness & Movement': { habits: [], color: '#ef4444', icon: '💪' },
      '📚 Learning & Growth': { habits: [], color: '#8b5cf6', icon: '📚' },
      '⚡ Productivity': { habits: [], color: '#3b82f6', icon: '⚡' },
      '🥰 Social & Emotional': { habits: [], color: '#ec4899', icon: '🥰' }
    };
    
    habits.filter(isCurrentPeriod).forEach(habit => {
      const name = habit.name.toLowerCase();
      if (name.includes('save') || name.includes('money') || name.includes('income') || name.includes('invest')) {
        categories['💰 Financial'].habits.push(habit);
      } else if (name.includes('water') || name.includes('tea') || name.includes('vitamin') || name.includes('fruit') || name.includes('floss') || name.includes('breath')) {
        categories['🌱 Health & Wellness'].habits.push(habit);
      } else if (name.includes('push') || name.includes('squat') || name.includes('plank') || name.includes('walk') || name.includes('stretch') || name.includes('stand')) {
        categories['💪 Fitness & Movement'].habits.push(habit);
      } else if (name.includes('read') || name.includes('learn') || name.includes('podcast') || name.includes('piano') || name.includes('word')) {
        categories['📚 Learning & Growth'].habits.push(habit);
      } else if (name.includes('bed') || name.includes('organize') || name.includes('wash') || name.includes('priorities') || name.includes('phone') || name.includes('goal')) {
        categories['⚡ Productivity'].habits.push(habit);
      } else {
        categories['🥰 Social & Emotional'].habits.push(habit);
      }
    });
    
    return Object.entries(categories).filter(([_, categoryData]) => categoryData.habits.length > 0);
  };
  
  const categorizedHabits = categorizeHabits();
  const completionRate = stats.totalHabits > 0 ? Math.round((stats.completedToday / stats.totalHabits) * 100) : 0;
  
  return (
    <div className="modern-focus-view">
      <div className="focus-hero">
        <div className="hero-content">
          <h1 className="focus-title">{dateTitle} Identity Votes</h1>
          <p className="focus-subtitle">Every action is a vote for who you're becoming</p>
        </div>
        
        <div className="completion-ring">
          <svg className="ring-svg" viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="50" 
              fill="none" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth="8"
            />
            <circle 
              cx="60" 
              cy="60" 
              r="50" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionRate / 100)}`}
              className="completion-stroke"
            />
          </svg>
          <div className="ring-content">
            <span className="completion-percentage">{completionRate}%</span>
            <span className="completion-label">{stats.completedToday}/{stats.totalHabits}</span>
          </div>
        </div>
      </div>
      
      <div className="categories-modern">
        {categorizedHabits.map(([categoryName, categoryData]) => (
          <CategorySection 
            key={categoryName}
            name={categoryName}
            habits={categoryData.habits}
            color={categoryData.color}
            getHabitStats={getHabitStats}
            updateHabitCount={updateHabitCount}
            updateStartDate={updateStartDate}
            currentDate={currentDate}
          />
        ))}
      </div>
      
      <div className="focus-inspiration">
        <div className="inspiration-content">
          <blockquote>
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </blockquote>
          <cite>- James Clear</cite>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ name, habits, color, getHabitStats, updateHabitCount, updateStartDate, currentDate }) => {
  const completedCount = habits.filter(habit => getHabitStats(habit, currentDate).isCompletedToday).length;
  const completionRate = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;
  
  return (
    <div className="category-section" style={{ '--category-color': color }}>
      <div className="category-header">
        <h3 className="category-name">{name}</h3>
        <div className="category-progress">
          <div className="progress-bar-mini">
            <div 
              className="progress-fill-mini" 
              style={{ width: `${completionRate}%`, backgroundColor: color }}
            ></div>
          </div>
          <span className="category-count">{completedCount}/{habits.length}</span>
        </div>
      </div>
      
      <div className="category-habits-modern">
        {habits.map(habit => {
          const habitStats = getHabitStats(habit, currentDate);
          return (
            <ModernHabitItem 
              key={habit.id}
              habit={habit}
              stats={habitStats}
              onVote={() => updateHabitCount(habit.id, habitStats.isCompletedToday ? -1 : 1, currentDate)}
              onUpdateStartDate={updateStartDate}
              categoryColor={color}
            />
          );
        })}
      </div>
    </div>
  );
};

const ModernHabitItem = ({ habit, stats, onVote, onUpdateStartDate, categoryColor }) => {
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
  
  const getStreakEmoji = () => {
    if (stats.streak >= 21) return '🏆';
    if (stats.streak >= 7) return '🔥';
    if (stats.streak >= 3) return '⭐';
    if (stats.streak >= 1) return '🌱';
    return '✨';
  };

  return (
    <div className={`modern-habit-item ${stats.isCompletedToday ? 'completed' : ''}`} style={{ '--item-color': categoryColor }}>
      <div className="habit-item-header">
        <div className="habit-icon-wrapper">
          <span className="habit-icon">{habit.icon || '⭐'}</span>
        </div>
        
        <div className="habit-info">
          <h4 className="habit-name">{habit.name}</h4>
          <p className="habit-identity">I am {habit.identity}</p>
        </div>
        
        <div className="streak-badge">
          <span className="streak-emoji">{getStreakEmoji()}</span>
          <span className="streak-number">{stats.streak}</span>
        </div>
      </div>
      
      <div className="habit-implementation">
        <div className="implementation-item">
          <span className="impl-icon">🔗</span>
          <span className="impl-text">{habit.cue}</span>
        </div>
        <div className="implementation-item">
          <span className="impl-icon">⚡</span>
          <span className="impl-text">{habit.twoMinuteVersion}</span>
        </div>
      </div>
      
      <div className="habit-meta-info">
        {isEditingDate ? (
          <div className="date-edit-modern">
            <input 
              type="date" 
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              onBlur={handleDateSave}
              onKeyDown={(e) => e.key === 'Enter' && handleDateSave()}
              autoFocus
              className="date-input-modern"
            />
          </div>
        ) : (
          <div className="start-date-info" onClick={handleDateEdit}>
            <span className="date-icon">📅</span>
            <span className="date-text">Since {new Date(habit.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
        
        {habit.frequency !== 'daily' && (
          <div className="frequency-note">
            {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)} habit
          </div>
        )}
      </div>
      
      <button 
        className={`modern-vote-btn ${stats.isCompletedToday ? 'voted' : ''}`}
        onClick={onVote}
        aria-label={`${stats.isCompletedToday ? 'Remove vote for' : 'Cast vote for'} ${habit.name}`}
        style={{ '--vote-color': categoryColor }}
      >
        <span className="vote-btn-icon">
          {stats.isCompletedToday ? '✅' : '🗳️'}
        </span>
        <span className="vote-btn-text">
          {stats.isCompletedToday ? 'Vote Cast!' : 'Cast Vote'}
        </span>
        <div className="vote-btn-ripple"></div>
      </button>
    </div>
  );
};

export default TodayFocus;