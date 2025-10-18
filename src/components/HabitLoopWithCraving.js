import React, { useState } from 'react';

const HabitLoopWithCraving = ({ habit, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [craving, setCraving] = useState(habit.craving || '');
  
  const handleSave = () => {
    onUpdate(habit.id, { craving });
    setShowEdit(false);
  };
  
  return (
    <div className="habit-loop">
      <h4>🔄 Your Habit Loop</h4>
      <div className="loop-diagram">
        <div className="loop-step cue">
          <div className="step-number">1</div>
          <div className="step-label">Cue</div>
          <div className="step-content">{habit.cue}</div>
        </div>
        
        <div className="loop-arrow">→</div>
        
        <div className="loop-step craving">
          <div className="step-number">2</div>
          <div className="step-label">Craving</div>
          <div className="step-content">
            {habit.craving || (
              <button className="add-craving-btn" onClick={() => setShowEdit(true)}>
                + Add craving
              </button>
            )}
          </div>
        </div>
        
        <div className="loop-arrow">→</div>
        
        <div className="loop-step response">
          <div className="step-number">3</div>
          <div className="step-label">Response</div>
          <div className="step-content">{habit.name}</div>
        </div>
        
        <div className="loop-arrow">→</div>
        
        <div className="loop-step reward">
          <div className="step-number">4</div>
          <div className="step-label">Reward</div>
          <div className="step-content">{habit.reward || 'Feel accomplished'}</div>
        </div>
      </div>
      
      {showEdit && (
        <div className="craving-edit">
          <label>What feeling do you anticipate?</label>
          <input 
            value={craving}
            onChange={(e) => setCraving(e.target.value)}
            placeholder="Feel energized, feel calm, feel productive..."
            autoFocus
          />
          <div className="edit-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setShowEdit(false)}>Cancel</button>
          </div>
        </div>
      )}
      
      <div className="loop-explanation">
        <p><strong>Why this matters:</strong> Understanding your craving helps you substitute bad habits with good ones that satisfy the same need.</p>
      </div>
    </div>
  );
};

export default HabitLoopWithCraving;
