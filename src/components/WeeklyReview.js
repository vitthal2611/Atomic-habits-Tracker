import React, { useState } from 'react';

const WeeklyReview = ({ habits, getHabitStats }) => {
  const [reflections, setReflections] = useState(() => {
    const saved = localStorage.getItem('weeklyReflections');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    wentWell: '',
    didntWork: '',
    willAdjust: ''
  });

  const lastReview = reflections[0];
  const daysSinceReview = lastReview 
    ? Math.floor((Date.now() - new Date(lastReview.date).getTime()) / (1000 * 60 * 60 * 24))
    : 7;

  const saveReview = () => {
    const review = {
      ...formData,
      date: new Date().toISOString(),
      weekStats: getWeekStats()
    };
    const updated = [review, ...reflections].slice(0, 12);
    setReflections(updated);
    localStorage.setItem('weeklyReflections', JSON.stringify(updated));
    setFormData({ wentWell: '', didntWork: '', willAdjust: '' });
    setShowForm(false);
  };

  const getWeekStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let totalVotes = 0;
    let possibleVotes = 0;
    
    habits.forEach(habit => {
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        if (checkDate >= new Date(habit.startDate)) {
          possibleVotes++;
          const stats = getHabitStats(habit, checkDate);
          if (stats.isCompletedToday) totalVotes++;
        }
      }
    });
    
    return {
      completion: possibleVotes > 0 ? Math.round((totalVotes / possibleVotes) * 100) : 0,
      totalVotes,
      possibleVotes
    };
  };

  const weekStats = getWeekStats();

  return (
    <div className="weekly-review">
      <div className="review-header">
        <h3>📝 Weekly Review & Reflection</h3>
        <p>Reflect on your systems to improve them</p>
      </div>

      <div className="review-stats">
        <div className="stat-card">
          <div className="stat-value">{weekStats.completion}%</div>
          <div className="stat-label">Week Completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{weekStats.totalVotes}</div>
          <div className="stat-label">Votes Cast</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{daysSinceReview}</div>
          <div className="stat-label">Days Since Review</div>
        </div>
      </div>

      {daysSinceReview >= 7 && (
        <div className="review-prompt">
          <p>⏰ Time for your weekly review! Reflection is key to improvement.</p>
          <button className="review-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Start Review'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="review-form">
          <div className="form-group">
            <label>✅ What went well this week?</label>
            <textarea
              value={formData.wentWell}
              onChange={(e) => setFormData({ ...formData, wentWell: e.target.value })}
              placeholder="Which habits felt easy? What helped you succeed?"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>❌ What didn't work?</label>
            <textarea
              value={formData.didntWork}
              onChange={(e) => setFormData({ ...formData, didntWork: e.target.value })}
              placeholder="Which habits did you struggle with? What got in the way?"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>🔧 What will you adjust?</label>
            <textarea
              value={formData.willAdjust}
              onChange={(e) => setFormData({ ...formData, willAdjust: e.target.value })}
              placeholder="How will you make it easier? What will you change?"
              rows="3"
            />
          </div>
          
          <button className="save-review-btn" onClick={saveReview}>
            Save Review
          </button>
        </div>
      )}

      {reflections.length > 0 && (
        <div className="past-reviews">
          <h4>Past Reviews</h4>
          {reflections.slice(0, 3).map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-date">
                {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                <span className="review-completion">{review.weekStats.completion}% completion</span>
              </div>
              <div className="review-content">
                <p><strong>Went well:</strong> {review.wentWell}</p>
                <p><strong>Didn't work:</strong> {review.didntWork}</p>
                <p><strong>Adjusting:</strong> {review.willAdjust}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyReview;
