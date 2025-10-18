import React, { useState } from 'react';

const ImprovedGoldilocksRule = ({ habits, getHabitStats, onUpdateHabit }) => {
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('habitDifficultyRatings');
    return saved ? JSON.parse(saved) : {};
  });
  
  const saveRating = (habitId, difficulty, isProgressing) => {
    const newRatings = {
      ...ratings,
      [habitId]: {
        difficulty,
        isProgressing,
        date: new Date().toISOString()
      }
    };
    setRatings(newRatings);
    localStorage.setItem('habitDifficultyRatings', JSON.stringify(newRatings));
  };
  
  const analyzeHabit = (habit) => {
    const stats = getHabitStats(habit);
    const rating = ratings[habit.id];
    
    // If no rating yet, ask for one
    if (!rating) return { status: 'needs-rating', message: 'Rate difficulty to get insights' };
    
    const { difficulty, isProgressing } = rating;
    const completionRate = stats.daysSinceStart > 0 
      ? (stats.streak / stats.daysSinceStart) * 100 
      : 0;
    
    // High completion + not progressing = too easy
    if (completionRate >= 80 && !isProgressing) {
      return {
        status: 'too-easy',
        icon: '📈',
        title: 'Time to Level Up',
        message: 'You\'re crushing this! Ready for more challenge?',
        action: 'Increase difficulty',
        color: '#10b981'
      };
    }
    
    // Low completion OR high difficulty rating = too hard
    if (completionRate < 50 || difficulty >= 8) {
      return {
        status: 'too-hard',
        icon: '📉',
        title: 'Scale Back',
        message: 'Return to your 2-minute version to rebuild momentum',
        action: `Reset to: ${habit.twoMinuteVersion}`,
        color: '#ef4444'
      };
    }
    
    // Medium difficulty + progressing = just right
    if (difficulty >= 4 && difficulty <= 7 && isProgressing) {
      return {
        status: 'just-right',
        icon: '🎯',
        title: 'Perfect Zone',
        message: 'You\'re in the Goldilocks zone - keep going!',
        action: 'Maintain current level',
        color: '#f59e0b'
      };
    }
    
    return {
      status: 'just-right',
      icon: '🎯',
      title: 'On Track',
      message: 'Keep building consistency',
      action: 'Stay the course',
      color: '#4f46e5'
    };
  };
  
  return (
    <div className="improved-goldilocks">
      <div className="goldilocks-header">
        <h3>🎯 The Goldilocks Rule</h3>
        <p>Habits are most engaging when at the edge of your abilities</p>
      </div>
      
      <div className="goldilocks-explanation">
        <div className="explanation-box">
          <p>Rate each habit after completing it to find your optimal difficulty level.</p>
          <p><strong>Sweet spot:</strong> 4-7 difficulty + making progress = maximum engagement</p>
        </div>
      </div>
      
      <div className="habits-analysis">
        {habits.map(habit => {
          const analysis = analyzeHabit(habit);
          const stats = getHabitStats(habit);
          const rating = ratings[habit.id];
          
          return (
            <div key={habit.id} className={`analysis-card ${analysis.status}`}>
              <div className="card-header">
                <div className="habit-info">
                  <span className="habit-icon">{habit.icon}</span>
                  <span className="habit-name">{habit.name}</span>
                </div>
                {analysis.color && (
                  <div className="status-badge" style={{ background: analysis.color }}>
                    {analysis.icon} {analysis.title}
                  </div>
                )}
              </div>
              
              {analysis.status === 'needs-rating' ? (
                <div className="rating-prompt">
                  <p>After your next completion, rate the difficulty:</p>
                  <div className="difficulty-scale">
                    <label>How hard was it? (1=Easy, 10=Very Hard)</label>
                    <div className="scale-buttons">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <button 
                          key={num}
                          className="scale-btn"
                          onClick={() => saveRating(habit.id, num, false)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="progress-check">
                    <label>
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          if (rating) {
                            saveRating(habit.id, rating.difficulty, e.target.checked);
                          }
                        }}
                      />
                      I'm doing more than the 2-minute version
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <div className="analysis-content">
                    <p className="analysis-message">{analysis.message}</p>
                    <div className="current-stats">
                      <span>Difficulty: {rating?.difficulty}/10</span>
                      <span>Completion: {Math.round((stats.streak / stats.daysSinceStart) * 100)}%</span>
                      <span>Progressing: {rating?.isProgressing ? '✅' : '❌'}</span>
                    </div>
                  </div>
                  
                  <div className="analysis-actions">
                    <div className="action-text">{analysis.action}</div>
                    <button 
                      className="update-rating-btn"
                      onClick={() => {
                        const newDifficulty = prompt('Rate difficulty (1-10):', rating?.difficulty || 5);
                        const progressing = window.confirm('Are you doing more than the 2-minute version?');
                        if (newDifficulty) {
                          saveRating(habit.id, parseInt(newDifficulty), progressing);
                        }
                      }}
                    >
                      Update Rating
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="goldilocks-tips">
        <h4>Finding Your Sweet Spot:</h4>
        <ul>
          <li><strong>Too Easy (1-3):</strong> Time to increase difficulty or add complexity</li>
          <li><strong>Just Right (4-7):</strong> Perfect! You're challenged but capable</li>
          <li><strong>Too Hard (8-10):</strong> Scale back to 2-minute version immediately</li>
          <li><strong>Not Progressing:</strong> Stuck at 2-minute version? That's okay - consistency first!</li>
        </ul>
      </div>
    </div>
  );
};

export default ImprovedGoldilocksRule;
