import React, { useState } from 'react';

const AddHabit = ({ onAdd, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '⭐',
    identity: '',
    cue: '',
    reward: '',
    twoMinuteVersion: '',
    frequency: 'daily'
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    
    if (!formData.identity.trim()) {
      newErrors.identity = 'Identity statement is required';
    }
    
    if (!formData.cue.trim()) {
      newErrors.cue = 'Implementation intention is required';
    }
    
    if (!formData.twoMinuteVersion.trim()) {
      newErrors.twoMinuteVersion = '2-minute version is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const success = await onAdd(formData);
      if (success) {
        setFormData({
          name: '',
          icon: '⭐',
          identity: '',
          cue: '',
          reward: '',
          twoMinuteVersion: '',
          frequency: 'daily'
        });
        setErrors({});
      }
    } catch (error) {
      setErrors({ submit: 'Failed to create habit. Please try again.' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="add-habit-section">
      <div className="form-header">
        <h3>✨ Create New Atomic Habit</h3>
        <p>Follow the 4 Laws to design a habit that sticks</p>
      </div>
      
      <form onSubmit={handleSubmit} className="add-habit" noValidate>
        <div className="habit-basics">
          <div className="basic-input">
            <label htmlFor="habit-name">What habit do you want to build?</label>
            <input 
              id="habit-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Read 1 page, Do 2 push-ups, Meditate 1 minute..."
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <div id="name-error" className="error-message" role="alert">
                {errors.name}
              </div>
            )}
          </div>
          
          <div className="basic-input">
            <label htmlFor="habit-identity">Who will you become?</label>
            <input 
              id="habit-identity"
              value={formData.identity}
              onChange={(e) => handleChange('identity', e.target.value)}
              placeholder="I am someone who takes care of my health"
              aria-describedby={errors.identity ? 'identity-error' : undefined}
              aria-invalid={!!errors.identity}
            />
            {errors.identity && (
              <div id="identity-error" className="error-message" role="alert">
                {errors.identity}
              </div>
            )}
          </div>
          
          <div className="basic-input">
            <label htmlFor="habit-frequency">How often?</label>
            <select 
              id="habit-frequency"
              value={formData.frequency}
              onChange={(e) => handleChange('frequency', e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="laws-grid">
          <div className="law-input obvious">
            <div className="law-header">
              <span className="law-number">1</span>
              <span className="law-title">Make it Obvious</span>
            </div>
            <input 
              value={formData.cue}
              onChange={(e) => handleChange('cue', e.target.value)}
              placeholder="After I wake up, I will..."
              aria-describedby={errors.cue ? 'cue-error' : undefined}
              aria-invalid={!!errors.cue}
            />
            {errors.cue && (
              <div id="cue-error" className="error-message" role="alert">
                {errors.cue}
              </div>
            )}
          </div>
          
          <div className="law-input attractive">
            <div className="law-header">
              <span className="law-number">2</span>
              <span className="law-title">Make it Attractive</span>
            </div>
            <input 
              value={formData.reward}
              onChange={(e) => handleChange('reward', e.target.value)}
              placeholder="Then I will enjoy..."
            />
          </div>
          
          <div className="law-input easy">
            <div className="law-header">
              <span className="law-number">3</span>
              <span className="law-title">Make it Easy</span>
            </div>
            <input 
              value={formData.twoMinuteVersion}
              onChange={(e) => handleChange('twoMinuteVersion', e.target.value)}
              placeholder="Easiest way to start..."
              aria-describedby={errors.twoMinuteVersion ? 'two-minute-error' : undefined}
              aria-invalid={!!errors.twoMinuteVersion}
            />
            {errors.twoMinuteVersion && (
              <div id="two-minute-error" className="error-message" role="alert">
                {errors.twoMinuteVersion}
              </div>
            )}
          </div>
          
          <div className="law-input satisfying">
            <div className="law-header">
              <span className="law-number">4</span>
              <span className="law-title">Make it Satisfying</span>
            </div>
            <div className="satisfaction-note">Track completion for instant satisfaction</div>
          </div>
        </div>
        
        {errors.submit && (
          <div className="error-message" role="alert">
            {errors.submit}
          </div>
        )}
        
        <button 
          type="submit" 
          className="create-btn"
          disabled={loading}
          aria-describedby="create-btn-status"
        >
          {loading ? '⏳ Creating...' : '✨ Create My Atomic Habit'}
        </button>
        
        {loading && (
          <div id="create-btn-status" className="sr-only" aria-live="polite">
            Creating your habit...
          </div>
        )}
      </form>
    </div>
  );
};

export default AddHabit;