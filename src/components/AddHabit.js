import React, { useState } from 'react';

const AddHabit = ({ onAdd, loading, habits }) => {
  const [formData, setFormData] = useState({
    name: '',
    identity: '',
    time: '',
    location: '',
    visualCue: '',
    afterHabit: '',
    twoMinuteVersion: '',
    reward: '',
    accountabilityPartner: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.identity && formData.time && formData.location && formData.twoMinuteVersion) {
      const cue = `${formData.afterHabit ? `After ${formData.afterHabit}, ` : ''}I will ${formData.name} at ${formData.time} in ${formData.location}`;
      onAdd({ ...formData, cue, frequency: 'daily', icon: '⭐' });
      setFormData({ name: '', identity: '', time: '', location: '', visualCue: '', afterHabit: '', twoMinuteVersion: '', reward: '', accountabilityPartner: '' });
    }
  };

  return (
    <div className="add-habit-section">
      <div className="form-header">
        <h3>✨ Create Atomic Habit</h3>
        <p>Build better habits through small, consistent actions</p>
      </div>
      
      <form onSubmit={handleSubmit} className="add-habit">
        <div className="form-group">
          <label>What's the habit?</label>
          <input 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Read 10 pages"
            required
          />
        </div>

        <div className="form-group">
          <label>Who does this make you?</label>
          <input 
            value={formData.identity}
            onChange={(e) => setFormData(prev => ({ ...prev, identity: e.target.value }))}
            placeholder="a reader"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>When exactly? (Time)</label>
            <input 
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Where exactly? (Location)</label>
            <input 
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Kitchen table"
              required
            />
          </div>
        </div>

        <div className="form-group highlight-cue">
          <label>👁️ What's the visual cue? (Make it Obvious!)</label>
          <input 
            value={formData.visualCue}
            onChange={(e) => setFormData(prev => ({ ...prev, visualCue: e.target.value }))}
            placeholder="Book on nightstand"
            required
          />
          <small className="form-hint">💡 Place a visual reminder in your environment. Make good habits obvious!</small>
        </div>

        <div className="form-group highlight-stack">
          <label>🔗 After which habit? (Habit Stacking - HIGHLY Recommended!)</label>
          <select 
            value={formData.afterHabit}
            onChange={(e) => setFormData(prev => ({ ...prev, afterHabit: e.target.value }))}
          >
            <option value="">⚠️ No stacking (harder to remember)</option>
            {habits?.map(h => <option key={h.id} value={h.name}>{h.icon} {h.name} {h.time && `(${h.time})`}</option>)}
          </select>
          <small className="form-hint">💡 <strong>Habit stacking is the #1 way to build new habits.</strong> After [CURRENT HABIT], I will [NEW HABIT]. Don't skip this!</small>
        </div>

        <div className="form-group highlight">
          <label>2-Minute Version (Start here!)</label>
          <input 
            value={formData.twoMinuteVersion}
            onChange={(e) => setFormData(prev => ({ ...prev, twoMinuteVersion: e.target.value }))}
            placeholder="Read 1 page"
            required
          />
        </div>

        <div className="form-group">
          <label>Reward (Optional)</label>
          <input 
            value={formData.reward}
            onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
            placeholder="Enjoy a cup of coffee"
          />
        </div>

        <div className="form-group">
          <label>Accountability Partner (Optional)</label>
          <input 
            value={formData.accountabilityPartner}
            onChange={(e) => setFormData(prev => ({ ...prev, accountabilityPartner: e.target.value }))}
            placeholder="Who will you tell about this habit?"
          />
        </div>

        <button type="submit" className="create-btn" disabled={loading}>
          {loading ? '⏳ Creating...' : '✨ Create Habit'}
        </button>
      </form>
    </div>
  );
};

export default AddHabit;