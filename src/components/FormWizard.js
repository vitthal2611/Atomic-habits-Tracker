import React, { useState } from 'react';
import { useFormValidation, FormField } from './FormValidation';
import './FormWizard.css';

const FormWizard = ({ onComplete, habits, loading }) => {
  const scorecardHabits = JSON.parse(localStorage.getItem('scorecardHabits') || '[]');
  const [step, setStep] = useState(1);
  
  // Filter out habits that are already linked
  const usedHabits = new Set(habits?.map(h => h.afterHabit).filter(Boolean) || []);
  const availableHabits = scorecardHabits.filter(h => !usedHabits.has(h.name));
  
  const validationRules = {
    name: { required: true, minLength: 2, message: 'Habit name must be at least 2 characters' },
    identity: { required: true, minLength: 2, message: 'Identity must be at least 2 characters' },
    time: { required: true, message: 'Time is required' },
    location: { required: true, minLength: 2, message: 'Location is required' },
    twoMinuteVersion: { required: true, minLength: 2, message: '2-minute version is required' },
    afterHabit: { required: true, message: 'Please select an existing habit to stack after' }
  };
  
  const { values: formData, errors, touched, handleChange, handleBlur, validateAll, setValues } = useFormValidation({
    name: '',
    identity: '',
    time: '',
    location: '',
    visualCue: '',
    afterHabit: '',
    twoMinuteVersion: '',
    reward: '',
    accountabilityPartner: ''
  }, validationRules);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    const fieldsToValidate = {
      1: ['name'],
      2: ['identity'],
      3: ['time', 'location'],
      4: ['twoMinuteVersion'],
      5: ['afterHabit']
    }[step];
    
    if (fieldsToValidate) {
      const hasErrors = fieldsToValidate.some(field => {
        handleBlur(field);
        return errors[field];
      });
      if (hasErrors) return;
    }
    
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!validateAll()) return;
    const cue = `${formData.afterHabit ? `After ${formData.afterHabit}, ` : ''}I will ${formData.name} at ${formData.time} in ${formData.location}`;
    
    // Add new habit to scorecard list
    const updatedScorecard = [...scorecardHabits, { id: Date.now(), name: formData.name, rating: 'good' }];
    localStorage.setItem('scorecardHabits', JSON.stringify(updatedScorecard));
    
    onComplete({ ...formData, cue, frequency: 'daily', icon: '⭐' });
  };

  const canProceed = () => {
    switch(step) {
      case 1: return formData.name.trim();
      case 2: return formData.identity.trim();
      case 3: return formData.time && formData.location.trim();
      case 4: return formData.twoMinuteVersion.trim();
      case 5: return formData.afterHabit.trim();
      default: return false;
    }
  };

  return (
    <div className="form-wizard">
      <div className="wizard-progress">
        <div className="progress-bar-wizard">
          <div className="progress-fill-wizard" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">Step {step} of {totalSteps}</div>
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <div className="wizard-step fade-in">
            <h2 className="step-title">What's the habit?</h2>
            <p className="step-description">Be specific. What action will you take?</p>
            <input
              type="text"
              className={`wizard-input ${touched.name && errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="Read 10 pages"
              autoFocus
            />
            {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
            <div className="examples">
              <p className="examples-label">Examples:</p>
              <div className="example-chips">
                <button className="chip" onClick={() => setValues({ ...formData, name: 'Read 10 pages' })}>
                  Read 10 pages
                </button>
                <button className="chip" onClick={() => setValues({ ...formData, name: 'Do 20 pushups' })}>
                  Do 20 pushups
                </button>
                <button className="chip" onClick={() => setValues({ ...formData, name: 'Meditate for 5 minutes' })}>
                  Meditate 5 min
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step fade-in">
            <h2 className="step-title">Who does this make you?</h2>
            <p className="step-description">Focus on identity, not outcomes</p>
            <div className="identity-input-wrapper">
              <span className="identity-prefix">I am</span>
              <input
                type="text"
                className={`wizard-input identity-input ${touched.identity && errors.identity ? 'error' : ''}`}
                value={formData.identity}
                onChange={(e) => handleChange('identity', e.target.value)}
                onBlur={() => handleBlur('identity')}
                placeholder="a reader"
                autoFocus
              />
            </div>
            {touched.identity && errors.identity && <span className="form-error">{errors.identity}</span>}
            <div className="identity-input-wrapper" style={{ display: 'none' }}>
            </div>
            <div className="examples">
              <p className="examples-label">Examples:</p>
              <div className="example-chips">
                <button className="chip" onClick={() => setValues({ ...formData, identity: 'a reader' })}>
                  a reader
                </button>
                <button className="chip" onClick={() => setValues({ ...formData, identity: 'an athlete' })}>
                  an athlete
                </button>
                <button className="chip" onClick={() => setValues({ ...formData, identity: 'a mindful person' })}>
                  a mindful person
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step fade-in">
            <h2 className="step-title">When and where?</h2>
            <p className="step-description">Make it obvious with time and location</p>
            <div className="two-column">
              <div className="form-group-wizard">
                <label>Time</label>
                <input
                  type="time"
                  className={`wizard-input ${touched.time && errors.time ? 'error' : ''}`}
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  onBlur={() => handleBlur('time')}
                  autoFocus
                />
                {touched.time && errors.time && <span className="form-error">{errors.time}</span>}
              </div>
              <div className="form-group-wizard">
                <label>Location</label>
                <input
                  type="text"
                  className={`wizard-input ${touched.location && errors.location ? 'error' : ''}`}
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  onBlur={() => handleBlur('location')}
                  placeholder="Kitchen table"
                />
                {touched.location && errors.location && <span className="form-error">{errors.location}</span>}
              </div>
            </div>
            <div className="form-group-wizard">
              <label>Visual Cue (Optional)</label>
              <input
                type="text"
                className="wizard-input"
                value={formData.visualCue}
                onChange={(e) => handleChange('visualCue', e.target.value)}
                placeholder="Book on nightstand"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-step fade-in">
            <h2 className="step-title">What's the 2-minute version?</h2>
            <p className="step-description">Start small. You can always do more.</p>
            <input
              type="text"
              className={`wizard-input ${touched.twoMinuteVersion && errors.twoMinuteVersion ? 'error' : ''}`}
              value={formData.twoMinuteVersion}
              onChange={(e) => handleChange('twoMinuteVersion', e.target.value)}
              onBlur={() => handleBlur('twoMinuteVersion')}
              placeholder="Read 1 page"
              autoFocus
            />
            {touched.twoMinuteVersion && errors.twoMinuteVersion && <span className="form-error">{errors.twoMinuteVersion}</span>}
            <div className="info-box">
              <div className="info-icon">💡</div>
              <div className="info-text">
                <strong>The 2-Minute Rule:</strong> When you start a new habit, it should take less than two minutes to do. 
                This makes it easy to start, even on your worst days.
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="wizard-step fade-in">
            <h2 className="step-title">Review your habit</h2>
            <div className="review-card">
              <div className="review-item">
                <span className="review-label">Habit:</span>
                <span className="review-value">{formData.name}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Identity:</span>
                <span className="review-value">I am {formData.identity}</span>
              </div>
              <div className="review-item">
                <span className="review-label">When:</span>
                <span className="review-value">{formData.time} at {formData.location}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Start with:</span>
                <span className="review-value">⚡ {formData.twoMinuteVersion}</span>
              </div>
            </div>
            
            <div className="form-group-wizard">
              <label>Stack after existing habit *</label>
              <select
                className={`wizard-input ${touched.afterHabit && errors.afterHabit ? 'error' : ''}`}
                value={formData.afterHabit}
                onChange={(e) => handleChange('afterHabit', e.target.value)}
                onBlur={() => handleBlur('afterHabit')}
              >
                <option value="">Select a habit...</option>
                {availableHabits.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
              </select>
              {touched.afterHabit && errors.afterHabit && <span className="form-error">{errors.afterHabit}</span>}
            </div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        {step > 1 && (
          <button className="btn btn-secondary" onClick={handleBack}>
            ← Back
          </button>
        )}
        {step < totalSteps ? (
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleNext}
            disabled={!canProceed()}
            style={{ flex: 1 }}
          >
            Next →
          </button>
        ) : (
          <button 
            className="btn btn-success btn-lg" 
            onClick={handleSubmit}
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? 'Creating...' : '✨ Create Habit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormWizard;
