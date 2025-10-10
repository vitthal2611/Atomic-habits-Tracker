import { useState, useEffect, useCallback } from 'react';

export const useHabits = () => {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      setError('Failed to save habits');
      console.error('Error saving habits:', error);
    }
  }, [habits]);

  const addHabit = useCallback((habitData) => {
    // Validate required fields
    if (!habitData?.name?.trim() || !habitData?.identity?.trim() || !habitData?.cue?.trim()) {
      return false;
    }
    
    setLoading(true);
    try {
      const newHabit = {
        id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        ...habitData,
        frequency: habitData.frequency || 'daily',
        startDate: new Date().toISOString(),
        daily: []
      };
      setHabits(prev => [...prev, newHabit]);
      setError(null);
      return true;
    } catch (error) {
      setError('Failed to add habit');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  }, []);

  const toggleHabit = useCallback((id, date = null) => {
    const targetDate = date ? new Date(date) : new Date();
    const key = habit => {
      if (habit.frequency === 'weekly') {
        const weekStart = new Date(targetDate);
        weekStart.setDate(targetDate.getDate() - targetDate.getDay());
        return `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
      } else if (habit.frequency === 'monthly') {
        return `${targetDate.getFullYear()}-${targetDate.getMonth()}`;
      } else if (habit.frequency === 'yearly') {
        return `${targetDate.getFullYear()}`;
      }
      return targetDate.toDateString();
    };
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const entryKey = key(habit);
      const daily = [...habit.daily];
      const index = daily.findIndex(entry => entry.key === entryKey);
      
      if (index >= 0) {
        daily[index].completed = !daily[index].completed;
        daily[index].count = daily[index].completed ? (daily[index].count || 1) : 0;
      } else {
        daily.push({ key: entryKey, completed: true, count: 1 });
      }
      
      return { ...habit, daily };
    }));
  }, []);

  const updateHabitCount = useCallback((id, increment, targetDate = new Date()) => {
    const today = new Date(targetDate);
    
    setHabits(prev => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const key = (() => {
        if (habit.frequency === 'weekly') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
        } else if (habit.frequency === 'monthly') {
          return `${today.getFullYear()}-${today.getMonth()}`;
        } else if (habit.frequency === 'yearly') {
          return `${today.getFullYear()}`;
        }
        return today.toDateString();
      })();
      
      const daily = [...habit.daily];
      const index = daily.findIndex(entry => entry.key === key);
      
      if (index >= 0) {
        const newCount = Math.max(0, Math.min(50, (daily[index].count || 0) + increment));
        daily[index].count = newCount;
        daily[index].completed = newCount > 0;
      } else if (increment > 0) {
        daily.push({ key, completed: true, count: 1 });
      }
      
      return { ...habit, daily };
    }));
  }, []);

  const getHabitStats = useCallback((habit, currentDate = new Date()) => {
    const today = new Date(currentDate);
    const startDate = new Date(habit.startDate);
    
    if (habit.frequency === 'weekly') {
      const weeksSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24 * 7));
      
      let streak = 0;
      for (let i = 0; i <= weeksSinceStart; i++) {
        const checkWeek = new Date(today);
        checkWeek.setDate(today.getDate() - (i * 7));
        const weekStart = new Date(checkWeek);
        weekStart.setDate(checkWeek.getDate() - checkWeek.getDay());
        
        if (weekStart < startDate) break;
        
        const weekKey = `${weekStart.getFullYear()}-W${Math.ceil(weekStart.getDate() / 7)}`;
        const entry = habit.daily.find(entry => entry.key === weekKey);
        
        if (entry && entry.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());
      const currentWeekKey = `${currentWeekStart.getFullYear()}-W${Math.ceil(currentWeekStart.getDate() / 7)}`;
      const currentEntry = habit.daily.find(entry => entry.key === currentWeekKey);
      
      return {
        streak,
        isCompletedToday: currentEntry?.completed || false,
        todayCount: currentEntry?.count || 0,
        daysSinceStart: Math.max(1, weeksSinceStart + 1)
      };
    } else if (habit.frequency === 'monthly') {
      const monthsSinceStart = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
      
      let streak = 0;
      for (let i = 0; i <= monthsSinceStart; i++) {
        const checkMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
        if (checkMonth < startDate) break;
        
        const monthKey = `${checkMonth.getFullYear()}-${checkMonth.getMonth()}`;
        const entry = habit.daily.find(entry => entry.key === monthKey);
        
        if (entry && entry.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
      const currentEntry = habit.daily.find(entry => entry.key === currentMonthKey);
      
      return {
        streak,
        isCompletedToday: currentEntry?.completed || false,
        todayCount: currentEntry?.count || 0,
        daysSinceStart: Math.max(1, monthsSinceStart + 1)
      };
    } else if (habit.frequency === 'yearly') {
      const yearsSinceStart = today.getFullYear() - startDate.getFullYear();
      
      let streak = 0;
      for (let i = 0; i <= yearsSinceStart; i++) {
        const checkYear = today.getFullYear() - i;
        if (checkYear < startDate.getFullYear()) break;
        
        const yearKey = `${checkYear}`;
        const entry = habit.daily.find(entry => entry.key === yearKey);
        
        if (entry && entry.completed) {
          streak++;
        } else {
          break;
        }
      }
      
      const currentYearKey = `${today.getFullYear()}`;
      const currentEntry = habit.daily.find(entry => entry.key === currentYearKey);
      
      return {
        streak,
        isCompletedToday: currentEntry?.completed || false,
        todayCount: currentEntry?.count || 0,
        daysSinceStart: Math.max(1, yearsSinceStart + 1)
      };
    }
    
    const daysSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    let streak = 0;
    for (let i = 0; i <= daysSinceStart; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      if (checkDate < startDate) break;
      
      const dateKey = checkDate.toDateString();
      const entry = habit.daily.find(entry => entry.key === dateKey);
      
      if (entry && entry.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    const currentKey = today.toDateString();
    const currentEntry = habit.daily.find(entry => entry.key === currentKey);
    
    return {
      streak,
      isCompletedToday: currentEntry?.completed || false,
      todayCount: currentEntry?.count || 0,
      daysSinceStart: Math.max(1, daysSinceStart)
    };
  }, []);

  const getOverallStats = useCallback(() => {
    const completedHabits = habits.filter(h => getHabitStats(h).isCompletedToday).length;
    
    const totalHabits = habits.length;
    const completedToday = completedHabits;
    const bestStreak = Math.max(...habits.map(h => getHabitStats(h).streak), 0);
    const identityScore = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const totalVotes = habits.reduce((sum, h) => sum + h.daily.filter(d => d.completed).length, 0);
    const avgDays = totalHabits > 0 ? Math.round(habits.reduce((sum, h) => {
      return sum + getHabitStats(h).daysSinceStart;
    }, 0) / totalHabits) : 0;

    return { totalHabits, completedToday, bestStreak, identityScore, totalVotes, avgDays };
  }, [habits]);

  const updateStartDate = useCallback((id, newDate) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id 
        ? { ...habit, startDate: new Date(newDate).toISOString() }
        : habit
    ));
  }, []);

  return {
    habits,
    loading,
    error,
    addHabit,
    deleteHabit,
    toggleHabit,
    updateHabitCount,
    updateStartDate,
    getHabitStats,
    getOverallStats,
    clearError: () => setError(null)
  };
};