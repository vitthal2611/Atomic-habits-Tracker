import React, { useState, useEffect } from 'react';

const OnboardingTips = ({ currentView, habitCount, daysSinceStart }) => {
  const [currentTip, setCurrentTip] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    const saved = localStorage.getItem('dismissedTips');
    return saved ? JSON.parse(saved) : [];
  });

  const tips = {
    firstHabit: {
      id: 'firstHabit',
      title: '🎯 Start with the 2-Minute Version',
      message: 'Make it so easy you can\'t say no. "Read 30 pages" becomes "Read 1 page". Master showing up before scaling up.',
      show: habitCount === 0 && currentView === 'today'
    },
    habitStacking: {
      id: 'habitStacking',
      title: '🔗 Use Habit Stacking',
      message: 'Link new habits to existing ones. "After I pour my morning coffee, I will meditate for 1 minute." The current habit becomes the cue.',
      show: habitCount >= 1 && habitCount < 3 && currentView === 'today'
    },
    valley: {
      id: 'valley',
      title: '⚠️ You\'re in the Valley of Disappointment',
      message: 'Days 10-21 are when most people quit. You\'re doing the work but not seeing results. This is NORMAL. Breakthrough is near - check Insights!',
      show: daysSinceStart >= 10 && daysSinceStart < 21 && currentView === 'today'
    },
    breakthrough: {
      id: 'breakthrough',
      title: '🏆 You\'ve Crossed the Plateau!',
      message: 'You made it through the valley! Your habits are now compounding. This is where change becomes visible. Keep going!',
      show: daysSinceStart === 21 && currentView === 'today'
    },
    weeklyReview: {
      id: 'weeklyReview',
      title: '📝 Time for Weekly Review',
      message: 'Systems improve through reflection. Visit Insights → Weekly Review to reflect on what worked and what didn\'t.',
      show: daysSinceStart % 7 === 0 && daysSinceStart > 0 && currentView === 'today'
    },
    environmentDesign: {
      id: 'environmentDesign',
      title: '🏠 Design Your Environment',
      message: 'Motivation is overrated. Environment shapes behavior. Visit Tools → Environment Design to optimize your space.',
      show: habitCount >= 3 && currentView === 'today'
    },
    neverMissTwice: {
      id: 'neverMissTwice',
      title: '⚠️ Never Miss Twice',
      message: 'Missing once is an accident. Missing twice is the start of a new habit. Get back on track today!',
      show: currentView === 'today' // This would need streak break detection
    }
  };

  useEffect(() => {
    // Find the first applicable tip that hasn't been dismissed
    const applicableTip = Object.values(tips).find(
      tip => tip.show && !dismissed.includes(tip.id)
    );
    setCurrentTip(applicableTip);
  }, [currentView, habitCount, daysSinceStart]);

  const handleDismiss = () => {
    if (currentTip) {
      const updated = [...dismissed, currentTip.id];
      setDismissed(updated);
      localStorage.setItem('dismissedTips', JSON.stringify(updated));
      setCurrentTip(null);
    }
  };

  const handleResetTips = () => {
    setDismissed([]);
    localStorage.removeItem('dismissedTips');
  };

  if (!currentTip) return null;

  return (
    <>
      <div className="onboarding-tip">
        <div className="tip-content">
          <h4 className="tip-title">{currentTip.title}</h4>
          <p className="tip-message">{currentTip.message}</p>
        </div>
        <button className="tip-dismiss" onClick={handleDismiss}>
          Got it!
        </button>
      </div>
      
      {/* Hidden reset button for development */}
      <button 
        className="reset-tips-btn"
        onClick={handleResetTips}
        style={{ display: 'none' }}
      >
        Reset Tips
      </button>
    </>
  );
};

export default OnboardingTips;
