import React, { useState } from 'react';

const HabitStackingSuggestions = ({ habits, onAdd, loading }) => {
  const [newHabit, setNewHabit] = useState('');
  const [selectedAnchor, setSelectedAnchor] = useState('');
  const [identity, setIdentity] = useState('');
  const [twoMinute, setTwoMinute] = useState('');
  
  const anchorHabit = habits.find(h => h.id === selectedAnchor);
  
  const handleCreate = () => {
    if (!newHabit || !selectedAnchor || !identity || !twoMinute) return;
    
    const anchor = habits.find(h => h.id === selectedAnchor);
    const cue = `After ${anchor.name}, I will ${newHabit}`;
    
    onAdd({
      name: newHabit,
      identity,
      cue,
      time: anchor.time || '',
      location: anchor.location || '',
      twoMinuteVersion: twoMinute,
      stackedAfter: anchor.id,
      icon: '⭐',
      frequency: 'daily'
    });
    
    setNewHabit('');
    setSelectedAnchor('');
    setIdentity('');
    setTwoMinute('');
  };
  
  const getStackingSuggestions = () => {
    const suggestions = [
      { anchor: 'coffee', suggest: 'meditate for 2 minutes', identity: 'a mindful person' },
      { anchor: 'brush', suggest: 'floss one tooth', identity: 'someone with great dental health' },
      { anchor: 'sit down for dinner', suggest: 'say one thing I\'m grateful for', identity: 'a grateful person' },
      { anchor: 'close laptop', suggest: 'do 10 pushups', identity: 'an athlete' },
      { anchor: 'get in bed', suggest: 'read one page', identity: 'a reader' }
    ];
    
    return suggestions.filter(s => 
      habits.some(h => h.name.toLowerCase().includes(s.anchor))
    );
  };
  
  const suggestions = getStackingSuggestions();
  
  return (
    <div className="habit-stacking">
      <div className="stacking-header">
        <h3>🔗 Habit Stacking</h3>
        <p>The easiest way to build new habits: stack them onto existing ones</p>
      </div>
      
      <div className="stacking-formula">
        <div className="formula-box">
          <strong>Formula:</strong> After [CURRENT HABIT], I will [NEW HABIT]
        </div>
      </div>
      
      {habits.length === 0 ? (
        <div className="no-habits-message">
          <p>Create your first habit to unlock habit stacking</p>
        </div>
      ) : (
        <>
          <div className="stacking-form">
            <div className="form-step">
              <label>1. Select an existing habit (your anchor):</label>
              <select 
                value={selectedAnchor} 
                onChange={(e) => setSelectedAnchor(e.target.value)}
              >
                <option value="">Choose a habit you do consistently...</option>
                {habits.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.icon} {h.name} {h.time && `(${h.time})`}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedAnchor && (
              <>
                <div className="form-step">
                  <label>2. What new habit will you stack?</label>
                  <input 
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="meditate, do pushups, write one sentence..."
                  />
                </div>
                
                <div className="form-step">
                  <label>3. Who does this make you?</label>
                  <input 
                    value={identity}
                    onChange={(e) => setIdentity(e.target.value)}
                    placeholder="a mindful person, an athlete, a writer..."
                  />
                </div>
                
                <div className="form-step">
                  <label>4. What's the 2-minute version?</label>
                  <input 
                    value={twoMinute}
                    onChange={(e) => setTwoMinute(e.target.value)}
                    placeholder="Take 3 deep breaths, do 1 pushup, write 1 word..."
                  />
                </div>
                
                <div className="stacking-preview">
                  <div className="preview-icon">📋</div>
                  <div className="preview-text">
                    <strong>Your Habit Stack:</strong><br />
                    After <strong>{anchorHabit?.name}</strong>, I will <strong>{newHabit || '[new habit]'}</strong>
                  </div>
                </div>
                
                <button 
                  className="create-stack-btn"
                  onClick={handleCreate}
                  disabled={!newHabit || !identity || !twoMinute || loading}
                >
                  {loading ? '⏳ Creating...' : '✨ Create Stacked Habit'}
                </button>
              </>
            )}
          </div>
          
          {suggestions.length > 0 && (
            <div className="stacking-suggestions">
              <h4>💡 Suggested Stacks Based on Your Habits:</h4>
              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-card">
                  <div className="suggestion-text">
                    After <strong>{habits.find(h => h.name.toLowerCase().includes(s.anchor))?.name}</strong>, 
                    try: <strong>{s.suggest}</strong>
                  </div>
                  <div className="suggestion-identity">→ Become {s.identity}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      <div className="stacking-why">
        <h4>Why Habit Stacking Works:</h4>
        <ul>
          <li>Leverages existing neural pathways</li>
          <li>No willpower needed - automatic trigger</li>
          <li>Builds habits in natural sequences</li>
          <li>Creates obvious cues you can't miss</li>
        </ul>
      </div>
    </div>
  );
};

export default HabitStackingSuggestions;
