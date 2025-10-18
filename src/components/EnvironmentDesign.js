import React, { useState } from 'react';

const EnvironmentDesign = ({ habits, onUpdateHabit }) => {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [environment, setEnvironment] = useState({
    makeObvious: '',
    makeInvisible: '',
    makeEasy: '',
    makeHard: ''
  });

  const handleSave = () => {
    if (selectedHabit && onUpdateHabit) {
      onUpdateHabit(selectedHabit.id, { environment });
      setSelectedHabit(null);
      setEnvironment({ makeObvious: '', makeInvisible: '', makeEasy: '', makeHard: '' });
    }
  };

  return (
    <div className="environment-design">
      <div className="environment-header">
        <h3>🏠 Environment Design</h3>
        <p>Your environment shapes your behavior more than motivation</p>
      </div>

      <div className="environment-principles">
        <div className="principle-card">
          <div className="principle-icon">👁️</div>
          <h4>Make Good Habits Obvious</h4>
          <p>Place visual cues in your environment</p>
          <ul>
            <li>Put book on pillow for reading</li>
            <li>Lay out workout clothes</li>
            <li>Keep fruit visible on counter</li>
          </ul>
        </div>

        <div className="principle-card">
          <div className="principle-icon">🙈</div>
          <h4>Make Bad Habits Invisible</h4>
          <p>Remove cues from your environment</p>
          <ul>
            <li>Hide TV remote in drawer</li>
            <li>Delete social media apps</li>
            <li>Keep junk food out of house</li>
          </ul>
        </div>

        <div className="principle-card">
          <div className="principle-icon">⚡</div>
          <h4>Make Good Habits Easy</h4>
          <p>Reduce friction for desired behaviors</p>
          <ul>
            <li>Prep healthy meals in advance</li>
            <li>Keep gym bag in car</li>
            <li>Use smaller plates for portions</li>
          </ul>
        </div>

        <div className="principle-card">
          <div className="principle-icon">🚧</div>
          <h4>Make Bad Habits Hard</h4>
          <p>Increase friction for undesired behaviors</p>
          <ul>
            <li>Unplug TV after each use</li>
            <li>Use website blockers</li>
            <li>Leave phone in another room</li>
          </ul>
        </div>
      </div>

      <div className="environment-setup">
        <h4>Design Your Environment</h4>
        <select 
          value={selectedHabit?.id || ''} 
          onChange={(e) => {
            const habit = habits.find(h => h.id === e.target.value);
            setSelectedHabit(habit);
            setEnvironment(habit?.environment || { makeObvious: '', makeInvisible: '', makeEasy: '', makeHard: '' });
          }}
        >
          <option value="">Select a habit...</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        {selectedHabit && (
          <div className="environment-form">
            <div className="form-group">
              <label>👁️ How will you make it obvious?</label>
              <input
                value={environment.makeObvious}
                onChange={(e) => setEnvironment({ ...environment, makeObvious: e.target.value })}
                placeholder="e.g., Put book on nightstand"
              />
            </div>

            <div className="form-group">
              <label>⚡ How will you make it easy?</label>
              <input
                value={environment.makeEasy}
                onChange={(e) => setEnvironment({ ...environment, makeEasy: e.target.value })}
                placeholder="e.g., Bookmark the page before bed"
              />
            </div>

            <div className="form-group">
              <label>🙈 What competing cue will you remove?</label>
              <input
                value={environment.makeInvisible}
                onChange={(e) => setEnvironment({ ...environment, makeInvisible: e.target.value })}
                placeholder="e.g., Hide phone in drawer"
              />
            </div>

            <div className="form-group">
              <label>🚧 What friction will you add to bad habits?</label>
              <input
                value={environment.makeHard}
                onChange={(e) => setEnvironment({ ...environment, makeHard: e.target.value })}
                placeholder="e.g., Log out of social media"
              />
            </div>

            <button className="save-environment-btn" onClick={handleSave}>
              Save Environment Design
            </button>
          </div>
        )}
      </div>

      <div className="environment-quote">
        "Environment is the invisible hand that shapes human behavior. Design your world to make good habits easier."
      </div>
    </div>
  );
};

export default EnvironmentDesign;
