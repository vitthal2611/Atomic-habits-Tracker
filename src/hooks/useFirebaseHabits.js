import { useState, useEffect, useCallback } from 'react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

export const useFirebaseHabits = () => {
  const [habits, setHabits] = useState([]);
  const [userSettings, setUserSettings] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        setHabits([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  // Real-time data listeners
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    
    // Habits listener
    const habitsQuery = query(
      collection(db, 'habits'),
      where('userId', '==', user.uid)
    );
    const unsubscribeHabits = onSnapshot(habitsQuery, 
      (snapshot) => {
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHabits(habitsData);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    // User settings listener
    const settingsQuery = query(
      collection(db, 'userSettings'),
      where('userId', '==', user.uid)
    );
    const unsubscribeSettings = onSnapshot(settingsQuery, 
      (snapshot) => {
        const settings = {};
        snapshot.docs.forEach(doc => {
          settings[doc.data().key] = doc.data().value;
        });
        setUserSettings(settings);
      }
    );

    // Tasks listener
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    );
    const unsubscribeTasks = onSnapshot(tasksQuery, 
      (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
      }
    );

    return () => {
      unsubscribeHabits();
      unsubscribeSettings();
      unsubscribeTasks();
    };
  }, [user]);

  const addHabit = useCallback(async (habitData) => {
    if (!user) return false;
    if (!habitData?.name?.trim() || !habitData?.identity?.trim()) return false;

    setLoading(true);
    try {
      const habitId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, 'habits', habitId), {
        ...habitData,
        userId: user.uid,
        frequency: habitData.frequency || 'daily',
        startDate: new Date().toISOString(),
        daily: [],
        createdAt: new Date().toISOString()
      });
      setError(null);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteHabit = useCallback(async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'habits', id));
    } catch (error) {
      setError(error.message);
    }
  }, [user]);

  const updateHabit = useCallback(async (id, updates) => {
    if (!user) return;
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    try {
      await setDoc(doc(db, 'habits', id), { ...habit, ...updates }, { merge: true });
    } catch (error) {
      setError(error.message);
    }
  }, [user, habits]);

  const toggleHabit = useCallback(async (id, date = null) => {
    if (!user) return;
    
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const targetDate = date ? new Date(date) : new Date();
    const key = targetDate.toDateString();
    
    const daily = [...(habit.daily || [])];
    const index = daily.findIndex(entry => entry.key === key);
    
    if (index >= 0) {
      daily[index].completed = !daily[index].completed;
      daily[index].count = daily[index].completed ? 1 : 0;
    } else {
      daily.push({ key, completed: true, count: 1 });
    }

    try {
      await setDoc(doc(db, 'habits', id), { ...habit, daily }, { merge: true });
    } catch (error) {
      setError(error.message);
    }
  }, [user, habits]);

  const getHabitStats = useCallback((habit, currentDate = new Date()) => {
    const today = new Date(currentDate);
    const startDate = new Date(habit.startDate);
    const daysSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    let streak = 0;
    for (let i = 0; i <= daysSinceStart; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (checkDate < startDate) break;
      
      const dateKey = checkDate.toDateString();
      const entry = habit.daily?.find(entry => entry.key === dateKey);
      
      if (entry?.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    const currentKey = today.toDateString();
    const currentEntry = habit.daily?.find(entry => entry.key === currentKey);
    
    return {
      streak,
      isCompletedToday: currentEntry?.completed || false,
      todayCount: currentEntry?.count || 0,
      daysSinceStart: Math.max(1, daysSinceStart)
    };
  }, []);

  const getOverallStats = useCallback(() => {
    try {
      const completedHabits = habits.filter(h => getHabitStats(h).isCompletedToday).length;
      const totalHabits = habits.length;
      const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => getHabitStats(h).streak), 0) : 0;
      const identityScore = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
      const totalVotes = habits.reduce((sum, h) => sum + (h.daily?.filter(d => d.completed).length || 0), 0);
      
      return { 
        totalHabits, 
        completedToday: completedHabits, 
        bestStreak, 
        identityScore, 
        totalVotes, 
        avgDays: 0 
      };
    } catch (error) {
      return { totalHabits: 0, completedToday: 0, bestStreak: 0, identityScore: 0, totalVotes: 0, avgDays: 0 };
    }
  }, [habits, getHabitStats]);

  const updateUserSetting = useCallback(async (key, value) => {
    if (!user) return;
    try {
      const settingId = `${user.uid}_${key}`;
      await setDoc(doc(db, 'userSettings', settingId), {
        userId: user.uid,
        key,
        value,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      setError(error.message);
    }
  }, [user]);

  const addTask = useCallback(async (taskData) => {
    if (!user) return;
    try {
      const taskId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, 'tasks', taskId), {
        ...taskData,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      setError(error.message);
    }
  }, [user]);

  const updateTask = useCallback(async (id, updates) => {
    if (!user) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await setDoc(doc(db, 'tasks', id), { ...task, ...updates }, { merge: true });
    } catch (error) {
      setError(error.message);
    }
  }, [user, tasks]);

  const deleteTask = useCallback(async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      setError(error.message);
    }
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  return {
    habits,
    userSettings,
    tasks,
    loading,
    error,
    user,
    addHabit,
    deleteHabit,
    updateHabit,
    toggleHabit,
    getHabitStats,
    getOverallStats,
    updateUserSetting,
    addTask,
    updateTask,
    deleteTask,
    logout,
    clearError: () => setError(null)
  };
};
