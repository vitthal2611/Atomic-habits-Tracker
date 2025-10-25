import React, { useState } from 'react';
import { useFirebaseHabits } from '../hooks/useFirebaseHabits';
import './EisenhowerMatrix.css';

const EisenhowerMatrix = () => {
  const { tasks, addTask, updateTask, deleteTask } = useFirebaseHabits();
  const [newTask, setNewTask] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState(1);
  const [showCompleted, setShowCompleted] = useState(false);



  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask({
        text: newTask,
        quadrant: selectedQuadrant,
        completed: false
      });
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const moveTask = (id, newQuadrant) => {
    updateTask(id, { quadrant: newQuadrant });
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, quadrantId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, quadrantId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
  };

  const quadrants = [
    { id: 1, title: 'Do', subtitle: 'Urgent & Important', color: '#ef4444', icon: '🔥' },
    { id: 2, title: 'Schedule', subtitle: 'Important, Not Urgent', color: '#667eea', icon: '📅' },
    { id: 3, title: 'Delegate', subtitle: 'Urgent, Not Important', color: '#f59e0b', icon: '👥' },
    { id: 4, title: 'Delete', subtitle: 'Not Urgent, Not Important', color: '#6b7280', icon: '🗑️' }
  ];

  return (
    <div className="eisenhower-container">
      <div className="eisenhower-header">
        <h2>📊 Eisenhower Matrix</h2>
        <p>Prioritize tasks by urgency and importance</p>
      </div>

      <div className="matrix-controls">
        <button 
          onClick={() => setShowCompleted(!showCompleted)} 
          className="toggle-completed-btn"
        >
          {showCompleted ? 'Hide' : 'Show'} Completed ({tasks.filter(t => t.completed).length})
        </button>
      </div>

      <div className="add-task-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add a new task..."
          className="task-input"
        />
        <select
          value={selectedQuadrant}
          onChange={(e) => setSelectedQuadrant(Number(e.target.value))}
          className="quadrant-select"
        >
          {quadrants.map(q => (
            <option key={q.id} value={q.id}>{q.icon} {q.title}</option>
          ))}
        </select>
        <button onClick={handleAddTask} className="add-task-btn">Add Task</button>
      </div>

      <div className="matrix-grid">
        {quadrants.map(quadrant => (
          <div 
            key={quadrant.id} 
            className="quadrant" 
            style={{ '--quadrant-color': quadrant.color }}
            onDrop={(e) => handleDrop(e, quadrant.id)}
            onDragOver={handleDragOver}
          >
            <div className="quadrant-header">
              <span className="quadrant-icon">{quadrant.icon}</span>
              <div>
                <h3>{quadrant.title}</h3>
                <p>{quadrant.subtitle}</p>
              </div>
            </div>
            <div className="task-list">
              {tasks.filter(t => t.quadrant === quadrant.id && !t.completed).map(task => (
                <div 
                  key={task.id} 
                  className="task-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="task-text">{task.text}</span>
                  <button onClick={() => handleDeleteTask(task.id)} className="delete-task">×</button>
                </div>
              ))}
              {tasks.filter(t => t.quadrant === quadrant.id && !t.completed).length === 0 && (
                <div className="empty-quadrant">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCompleted && (
        <div className="completed-section">
          <h3>✅ Completed Tasks</h3>
          <div className="completed-list">
            {tasks.filter(t => t.completed).map(task => (
              <div key={task.id} className="completed-task">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="task-text">{task.text}</span>
                <span className="task-quadrant">{quadrants.find(q => q.id === task.quadrant)?.icon}</span>
                <button onClick={() => handleDeleteTask(task.id)} className="delete-task">×</button>
              </div>
            ))}
            {tasks.filter(t => t.completed).length === 0 && (
              <div className="empty-quadrant">No completed tasks</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EisenhowerMatrix;
