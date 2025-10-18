import React, { useState } from 'react';

const TemptationBundling = ({ habits, onSaveBundle }) => {
  const [bundle, setBundle] = useState({
    needHabit: '',
    wantActivity: '',
    rule: ''
  });
  const [savedBundles, setSavedBundles] = useState(() => {
    const saved = localStorage.getItem('temptationBundles');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = () => {
    if (bundle.needHabit && bundle.wantActivity) {
      const newBundle = {
        ...bundle,
        rule: `Only ${bundle.wantActivity} while ${bundle.needHabit}`,
        id: Date.now()
      };
      const updated = [...savedBundles, newBundle];
      setSavedBundles(updated);
      localStorage.setItem('temptationBundles', JSON.stringify(updated));
      setBundle({ needHabit: '', wantActivity: '', rule: '' });
    }
  };

  const handleDelete = (id) => {
    const updated = savedBundles.filter(b => b.id !== id);
    setSavedBundles(updated);
    localStorage.setItem('temptationBundles', JSON.stringify(updated));
  };

  return (
    <div className="temptation-bundling">
      <div className="bundling-header">
        <h3>🎁 Temptation Bundling</h3>
        <p>Link what you need to do with what you want to do</p>
      </div>

      <div className="bundling-explanation">
        <div className="explanation-card">
          <h4>How It Works</h4>
          <p>Pair an action you want to do with an action you need to do. This makes hard habits more attractive.</p>
          <div className="bundling-examples">
            <div className="example-item">
              <span className="example-icon">📺</span>
              <span className="example-text">Only watch Netflix while exercising</span>
            </div>
            <div className="example-item">
              <span className="example-icon">🎧</span>
              <span className="example-text">Only listen to audiobooks while commuting</span>
            </div>
            <div className="example-item">
              <span className="example-icon">☕</span>
              <span className="example-text">Only have coffee after meditation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bundling-form">
        <h4>Create Your Bundle</h4>
        
        <div className="bundle-builder">
          <div className="form-group">
            <label>I NEED to...</label>
            <select
              value={bundle.needHabit}
              onChange={(e) => setBundle({ ...bundle, needHabit: e.target.value })}
            >
              <option value="">Select habit you need to do...</option>
              {habits.map(h => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="bundle-connector">
            <span className="connector-text">WHILE</span>
          </div>

          <div className="form-group">
            <label>I WANT to...</label>
            <input
              value={bundle.wantActivity}
              onChange={(e) => setBundle({ ...bundle, wantActivity: e.target.value })}
              placeholder="Watch favorite show, Listen to podcast, etc."
            />
          </div>
        </div>

        {bundle.needHabit && bundle.wantActivity && (
          <div className="bundle-preview">
            <div className="preview-icon">📋</div>
            <div className="preview-text">
              <strong>Your Rule:</strong> Only {bundle.wantActivity} while {bundle.needHabit}
            </div>
          </div>
        )}

        <button 
          className="save-bundle-btn"
          onClick={handleSave}
          disabled={!bundle.needHabit || !bundle.wantActivity}
        >
          Save Bundle
        </button>
      </div>

      {savedBundles.length > 0 && (
        <div className="saved-bundles">
          <h4>Your Temptation Bundles</h4>
          {savedBundles.map(b => (
            <div key={b.id} className="bundle-card">
              <div className="bundle-rule">
                <span className="rule-icon">🎁</span>
                <span className="rule-text">{b.rule}</span>
              </div>
              <button 
                className="delete-bundle-btn"
                onClick={() => handleDelete(b.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bundling-quote">
        "The more attractive an opportunity is, the more likely it is to become habit-forming."
      </div>
    </div>
  );
};

export default TemptationBundling;
