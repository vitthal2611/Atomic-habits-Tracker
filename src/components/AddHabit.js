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
    craving: '',
    reward: '',
    accountabilityPartner: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const testHabits = [
    {
      name: 'Read books',
      identity: 'a reader',
      time: '20:00',
      location: 'bedroom',
      visualCue: 'Book on nightstand',
      twoMinuteVersion: 'Read 1 page',
      craving: 'I get to learn something new',
      reward: 'Mark progress in reading journal',
      icon: '📚'
    },
    {
      name: 'Clean kitchen',
      identity: 'someone who lives in a clean space',
      time: '21:00',
      location: 'kitchen',
      visualCue: 'Cleaning supplies visible on counter',
      twoMinuteVersion: 'Wipe down one counter',
      craving: 'I get to enjoy a clean cooking space',
      reward: 'Admire the clean kitchen',
      icon: '🧽'
    },
    {
      name: 'House cleaning',
      identity: 'someone who maintains an organized home',
      time: '10:00',
      location: 'living room',
      visualCue: 'Cleaning checklist on fridge',
      twoMinuteVersion: 'Pick up 5 items',
      craving: 'I get to feel proud of my space',
      reward: 'Take a photo of the clean room',
      icon: '🏠'
    },
    {
      name: 'Brush teeth',
      identity: 'someone with excellent oral health',
      time: '22:00',
      location: 'bathroom',
      visualCue: 'Toothbrush next to sink',
      twoMinuteVersion: 'Brush for 30 seconds',
      craving: 'I get fresh breath and clean teeth',
      reward: 'Feel the clean, smooth teeth',
      icon: '🦷'
    },
    {
      name: 'Take a bath',
      identity: 'someone who prioritizes self-care',
      time: '21:30',
      location: 'bathroom',
      visualCue: 'Bath towel laid out',
      twoMinuteVersion: 'Run warm water for 2 minutes',
      craving: 'I get to relax and unwind',
      reward: 'Enjoy the warm, relaxing feeling',
      icon: '🛁'
    },
    {
      name: 'Learn Angular',
      identity: 'a skilled developer',
      time: '19:00',
      location: 'home office',
      visualCue: 'Angular tutorial bookmark open',
      twoMinuteVersion: 'Read one concept',
      craving: 'I get to build better applications',
      reward: 'Update learning progress tracker',
      icon: '💻'
    },
    {
      name: 'Work on business',
      identity: 'an entrepreneur',
      time: '18:00',
      location: 'desk',
      visualCue: 'Business plan notebook open',
      twoMinuteVersion: 'Write one business idea',
      craving: 'I get closer to financial freedom',
      reward: 'Celebrate the progress made',
      icon: '💼'
    },
    {
      name: 'Daily walk',
      identity: 'an active person',
      time: '07:00',
      location: 'neighborhood',
      visualCue: 'Walking shoes by the door',
      twoMinuteVersion: 'Walk to the end of the street',
      craving: 'I get fresh air and energy',
      reward: 'Enjoy the endorphin boost',
      icon: '🚶'
    },
    {
      name: 'Meditate',
      identity: 'someone with inner peace',
      time: '06:30',
      location: 'quiet corner',
      visualCue: 'Meditation cushion in place',
      twoMinuteVersion: 'Take 5 deep breaths',
      craving: 'I get mental clarity and calm',
      reward: 'Feel the peaceful state',
      icon: '🧘'
    },
    {
      name: 'Face care routine',
      identity: 'someone who takes care of their skin',
      time: '22:30',
      location: 'bathroom mirror',
      visualCue: 'Face wash next to sink',
      twoMinuteVersion: 'Splash face with water',
      craving: 'I get healthy, glowing skin',
      reward: 'Admire my refreshed face',
      icon: '✨'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Habit name is required';
    if (!formData.identity) newErrors.identity = 'Identity is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.visualCue) newErrors.visualCue = 'Visual cue is required';
    if (!formData.craving) newErrors.craving = 'What makes this attractive is required';
    if (!formData.twoMinuteVersion) newErrors.twoMinuteVersion = '2-minute version is required';
    if (!formData.reward) newErrors.reward = 'Immediate reward is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const cue = `${formData.afterHabit ? `After ${formData.afterHabit}, ` : ''}I will ${formData.name} at ${formData.time} in ${formData.location}`;
      onAdd({ ...formData, cue, frequency: 'daily', icon: '⭐' });
      setFormData({ name: '', identity: '', time: '', location: '', visualCue: '', afterHabit: '', twoMinuteVersion: '', craving: '', reward: '', accountabilityPartner: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="add-habit-section">
      <div className="form-header">
        <h3>✨ Create Atomic Habit</h3>
        <p>Build better habits through small, consistent actions</p>
      </div>
      
      <div className="quick-add-section">
        <button 
          type="button" 
          className="quick-add-toggle"
          onClick={() => setShowQuickAdd(!showQuickAdd)}
        >
          {showQuickAdd ? '📝 Custom Habit' : '⚡ Quick Add Test Habits'}
        </button>
        
        {showQuickAdd && (
          <div className="test-habits-grid">
            {testHabits.map((habit, index) => (
              <button
                key={index}
                type="button"
                className="test-habit-card"
                onClick={() => {
                  const cue = `I will ${habit.name} at ${habit.time} in ${habit.location}`;
                  onAdd({ ...habit, cue, frequency: 'daily' });
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }}
              >
                <span className="test-habit-icon">{habit.icon}</span>
                <span className="test-habit-name">{habit.name}</span>
                <span className="test-habit-identity">I am {habit.identity}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="add-habit">
        {showSuccess && (
          <div className="success-message">
            ✅ Habit created successfully! Start with your 2-minute version today.
          </div>
        )}
        
        <div className="form-group">
          <label>What's the habit?</label>
          <input 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Read 10 pages"
            className={errors.name ? 'error' : ''}
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Who does this make you?</label>
          <input 
            value={formData.identity}
            onChange={(e) => setFormData(prev => ({ ...prev, identity: e.target.value }))}
            placeholder="a reader"
            className={errors.identity ? 'error' : ''}
            required
          />
          {errors.identity && <span className="error-text">{errors.identity}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>When exactly? (Time)</label>
            <input 
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className={errors.time ? 'error' : ''}
              required
            />
            {errors.time && <span className="error-text">{errors.time}</span>}
          </div>
          <div className="form-group">
            <label>Where exactly? (Location)</label>
            <input 
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Kitchen table"
              className={errors.location ? 'error' : ''}
              required
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
        </div>

        <div className="form-group highlight-cue">
          <label>👁️ What's the visual cue? (Make it Obvious!)</label>
          <input 
            value={formData.visualCue}
            onChange={(e) => setFormData(prev => ({ ...prev, visualCue: e.target.value }))}
            placeholder="Book on nightstand"
            className={errors.visualCue ? 'error' : ''}
            required
          />
          {errors.visualCue && <span className="error-text">{errors.visualCue}</span>}
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

        <div className="form-group highlight-attractive">
          <label>🎯 What makes this attractive? (Law #2)</label>
          <input 
            value={formData.craving}
            onChange={(e) => setFormData(prev => ({ ...prev, craving: e.target.value }))}
            placeholder="I get to learn something new"
            className={errors.craving ? 'error' : ''}
            required
          />
          {errors.craving && <span className="error-text">{errors.craving}</span>}
          <small className="form-hint">💡 Bundle with something you enjoy or focus on the benefits you'll gain</small>
        </div>

        <div className="form-group highlight">
          <label>⚡ 2-Minute Version (Start here!)</label>
          <input 
            value={formData.twoMinuteVersion}
            onChange={(e) => setFormData(prev => ({ ...prev, twoMinuteVersion: e.target.value }))}
            placeholder="Read 1 page"
            className={errors.twoMinuteVersion ? 'error' : ''}
            required
          />
          {errors.twoMinuteVersion && <span className="error-text">{errors.twoMinuteVersion}</span>}
        </div>

        <div className="form-group highlight-reward">
          <label>🎉 Immediate Reward (Law #4 - Make it Satisfying)</label>
          <input 
            value={formData.reward}
            onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
            placeholder="Check it off with celebration"
            className={errors.reward ? 'error' : ''}
            required
          />
          {errors.reward && <span className="error-text">{errors.reward}</span>}
          <small className="form-hint">💡 What will you do immediately after to celebrate? Make it satisfying!</small>
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