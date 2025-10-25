import React, { useState, useEffect } from 'react';
import './OnboardingTutorial.css';

const OnboardingTutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 500);
  }, []);

  const steps = [
    {
      title: 'Welcome to Atomic Habits Tracker',
      description: 'Build better habits through small, consistent actions that compound over time.',
      icon: '🎯',
      action: 'Get Started'
    },
    {
      title: 'Every Action is a Vote',
      description: 'Each time you complete a habit, you cast a vote for who you\'re becoming. Focus on identity, not outcomes.',
      icon: '🗳️',
      action: 'Next'
    },
    {
      title: 'Start with 2 Minutes',
      description: 'New habits should take less than 2 minutes. Read 1 page, do 1 pushup, meditate for 2 minutes. You can always do more.',
      icon: '⚡',
      action: 'Next'
    },
    {
      title: 'Never Miss Twice',
      description: 'Missing once is an accident. Missing twice is the start of a new habit. We\'ll help you stay on track.',
      icon: '⚠️',
      action: 'Next'
    },
    {
      title: 'Ready to Begin?',
      description: 'Let\'s start by identifying your current habits. Awareness comes before change.',
      icon: '✨',
      action: 'Start Habit Scorecard'
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {

      setShow(false);
      onComplete();
    }
  };

  const handleSkip = () => {

    setShow(false);
    onComplete();
  };

  if (!show) return null;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="skip-btn" onClick={handleSkip}>
          Skip
        </button>

        <div className="onboarding-content">
          <div className="onboarding-icon">{currentStep.icon}</div>
          <h2 className="onboarding-title">{currentStep.title}</h2>
          <p className="onboarding-description">{currentStep.description}</p>
        </div>

        <div className="onboarding-footer">
          <div className="step-indicators">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
              />
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleNext}>
            {currentStep.action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
