import React, { useState } from 'react';
import './WeeklySchedulePlanner.css';

const WeeklySchedulePlanner = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ time: '06:00', name: '', days: days });

  const addHabit = () => {
    if (!newHabit.name.trim() || newHabit.days.length === 0) return;
    setHabits([...habits, { ...newHabit, id: Date.now() }]);
    setNewHabit({ time: '06:00', name: '', days: days });
    setShowAddForm(false);
  };

  const toggleDaySelection = (day) => {
    setNewHabit(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const shouldShowCheckbox = (habit, day) => {
    return habit.days.includes(day);
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
    // Clean up completions for deleted habit
    const updatedCompletions = { ...completions };
    Object.keys(updatedCompletions).forEach(key => {
      if (key.startsWith(`${id}-`)) {
        delete updatedCompletions[key];
      }
    });
    setCompletions(updatedCompletions);
  };

  const toggleCompletion = (habitId, day) => {
    const key = `${habitId}-${day}`;
    setCompletions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isCompleted = (habitId, day) => {
    return completions[`${habitId}-${day}`] || false;
  };

  return (
    <div className="weekly-planner-grid">
      <div className="planner-header">
        <h2>📅 Weekly Schedule Planner</h2>
        <p>Track your daily habits</p>
        <button className="add-habit-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add Habit'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <div className="form-row">
            <input
              type="time"
              value={newHabit.time}
              onChange={(e) => setNewHabit({ ...newHabit, time: e.target.value })}
              min="06:00"
              max="23:00"
            />
            <input
              type="text"
              placeholder="Habit name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            />
          </div>
          <div className="day-selector">
            <label>Select days:</label>
            <div className="day-checkboxes">
              {days.map(day => (
                <label key={day} className="day-checkbox">
                  <input
                    type="checkbox"
                    checked={newHabit.days.includes(day)}
                    onChange={() => toggleDaySelection(day)}
                  />
                  <span>{day.substring(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={addHabit} disabled={newHabit.days.length === 0}>Save Habit</button>
        </div>
      )}

      <div className="schedule-table">
        <div className="table-header">
          <div className="header-cell habit-column">Habit</div>
          {days.map(day => (
            <div key={day} className="header-cell">{day.substring(0, 3)}</div>
          ))}
        </div>

        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits added yet. Click "+ Add Habit" to start.</p>
          </div>
        ) : (
          <div className="table-body">
            {habits.map(habit => (
              <div key={habit.id} className="table-row">
                <div className="habit-cell">
                  <span className="habit-time">{habit.time}</span>
                  <span className="habit-name">{habit.name}</span>
                  <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>×</button>
                </div>
                {days.map(day => (
                  <div key={day} className="day-cell">
                    {shouldShowCheckbox(habit, day) ? (
                      <input
                        type="checkbox"
                        checked={isCompleted(habit.id, day)}
                        onChange={() => toggleCompletion(habit.id, day)}
                      />
                    ) : (
                      <span className="not-applicable">—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySchedulePlanner;
