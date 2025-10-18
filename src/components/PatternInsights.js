import React, { useMemo } from 'react';

const PatternInsights = ({ habits, getHabitStats }) => {
  const insights = useMemo(() => {
    const patterns = [];
    
    // Analyze each habit
    habits.forEach(habit => {
      const completions = habit.daily?.filter(d => d.completed) || [];
      if (completions.length < 7) return;
      
      // Day of week analysis
      const dayStats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      
      completions.forEach(c => {
        const date = new Date(c.key);
        const day = date.getDay();
        dayStats[day]++;
      });
      
      // Count total days for each day of week
      const startDate = new Date(habit.startDate);
      const today = new Date();
      const totalDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i <= totalDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dayCounts[date.getDay()]++;
      }
      
      // Calculate percentages
      const dayPercentages = {};
      Object.keys(dayStats).forEach(day => {
        dayPercentages[day] = dayCounts[day] > 0 
          ? Math.round((dayStats[day] / dayCounts[day]) * 100)
          : 0;
      });
      
      const weekdayAvg = [1,2,3,4,5].reduce((sum, d) => sum + dayPercentages[d], 0) / 5;
      const weekendAvg = [0,6].reduce((sum, d) => sum + dayPercentages[d], 0) / 2;
      
      if (Math.abs(weekdayAvg - weekendAvg) > 20) {
        patterns.push({
          type: 'weekday-weekend',
          habit: habit.name,
          icon: habit.icon,
          message: weekdayAvg > weekendAvg
            ? `You complete "${habit.name}" ${Math.round(weekdayAvg)}% on weekdays but only ${Math.round(weekendAvg)}% on weekends`
            : `You complete "${habit.name}" ${Math.round(weekendAvg)}% on weekends but only ${Math.round(weekdayAvg)}% on weekdays`,
          suggestion: weekdayAvg > weekendAvg
            ? 'Set a weekend-specific reminder or stack it with a weekend routine'
            : 'Your weekday routine is working - replicate it on weekends'
        });
      }
      
      // Best day analysis
      const bestDay = Object.entries(dayPercentages).reduce((best, [day, pct]) => 
        pct > best.pct ? { day: parseInt(day), pct } : best
      , { day: 0, pct: 0 });
      
      if (bestDay.pct > 80) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        patterns.push({
          type: 'best-day',
          habit: habit.name,
          icon: habit.icon,
          message: `${dayNames[bestDay.day]} is your best day for "${habit.name}" (${bestDay.pct}% completion)`,
          suggestion: 'Consider stacking new habits on this day when you\'re most consistent'
        });
      }
    });
    
    // Correlation analysis
    if (habits.length >= 2) {
      for (let i = 0; i < habits.length; i++) {
        for (let j = i + 1; j < habits.length; j++) {
          const h1 = habits[i];
          const h2 = habits[j];
          
          const h1Days = new Set((h1.daily || []).filter(d => d.completed).map(d => d.key));
          const h2Days = new Set((h2.daily || []).filter(d => d.completed).map(d => d.key));
          
          const intersection = [...h1Days].filter(d => h2Days.has(d)).length;
          const union = new Set([...h1Days, ...h2Days]).size;
          
          if (union > 0) {
            const correlation = intersection / union;
            
            if (correlation > 0.7 && intersection > 5) {
              patterns.push({
                type: 'correlation',
                habit: `${h1.name} + ${h2.name}`,
                icon: '🔗',
                message: `When you do "${h1.name}", you're ${Math.round(correlation * 100)}% more likely to do "${h2.name}"`,
                suggestion: 'These habits reinforce each other - keep them together!'
              });
            }
          }
        }
      }
    }
    
    return patterns;
  }, [habits, getHabitStats]);
  
  if (insights.length === 0) {
    return (
      <div className="pattern-insights">
        <h3>🔍 Pattern Insights</h3>
        <p className="no-insights">Keep tracking for 2+ weeks to unlock personalized insights</p>
      </div>
    );
  }
  
  return (
    <div className="pattern-insights">
      <div className="insights-header">
        <h3>🔍 Your Habit Patterns</h3>
        <p>Data-driven insights from your tracking</p>
      </div>
      
      <div className="insights-list">
        {insights.map((insight, idx) => (
          <div key={idx} className={`insight-card ${insight.type}`}>
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <div className="insight-message">{insight.message}</div>
              <div className="insight-suggestion">
                <strong>💡 Suggestion:</strong> {insight.suggestion}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="insights-footer">
        <p>Insights update automatically as you track more data</p>
      </div>
    </div>
  );
};

export default PatternInsights;
