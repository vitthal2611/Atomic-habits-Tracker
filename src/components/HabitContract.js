import React, { useState } from 'react';

const HabitContract = ({ habits, onSaveContract }) => {
  const [contract, setContract] = useState({
    habitId: '',
    commitment: '',
    consequence: '',
    accountabilityPartner: '',
    partnerEmail: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: '30'
  });
  const [signed, setSigned] = useState(false);

  const handleSign = () => {
    if (contract.habitId && contract.commitment && contract.consequence) {
      onSaveContract(contract);
      setSigned(true);
      setTimeout(() => {
        setSigned(false);
        setContract({
          habitId: '',
          commitment: '',
          consequence: '',
          accountabilityPartner: '',
          partnerEmail: '',
          startDate: new Date().toISOString().split('T')[0],
          duration: '30'
        });
      }, 3000);
    }
  };

  const selectedHabit = habits.find(h => h.id === contract.habitId);

  return (
    <div className="habit-contract">
      <div className="contract-header">
        <h3>📜 Habit Contract</h3>
        <p>Create accountability through commitment devices</p>
      </div>

      <div className="contract-info">
        <div className="info-card">
          <h4>Why Contracts Work</h4>
          <p>Making your habits public and adding consequences creates social pressure and accountability. You're less likely to break a promise made to others.</p>
        </div>
      </div>

      {signed ? (
        <div className="contract-signed">
          <div className="signed-icon">✅</div>
          <h3>Contract Signed!</h3>
          <p>Your commitment is now official. Stay accountable!</p>
        </div>
      ) : (
        <div className="contract-form">
          <div className="form-group">
            <label>Select Habit</label>
            <select
              value={contract.habitId}
              onChange={(e) => setContract({ ...contract, habitId: e.target.value })}
            >
              <option value="">Choose a habit...</option>
              {habits.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          {selectedHabit && (
            <>
              <div className="contract-preview">
                <h4>Habit Contract</h4>
                <div className="contract-text">
                  <p>I, <strong>[Your Name]</strong>, commit to the following:</p>
                </div>
              </div>

              <div className="form-group">
                <label>My Commitment</label>
                <textarea
                  value={contract.commitment}
                  onChange={(e) => setContract({ ...contract, commitment: e.target.value })}
                  placeholder={`I will ${selectedHabit.name} every day for ${contract.duration} days`}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  value={contract.duration}
                  onChange={(e) => setContract({ ...contract, duration: e.target.value })}
                  min="7"
                  max="365"
                />
              </div>

              <div className="form-group">
                <label>If I Fail, I Will...</label>
                <textarea
                  value={contract.consequence}
                  onChange={(e) => setContract({ ...contract, consequence: e.target.value })}
                  placeholder="e.g., Donate $20 to charity, Do 50 pushups, Skip my favorite show"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Accountability Partner (Optional)</label>
                <input
                  value={contract.accountabilityPartner}
                  onChange={(e) => setContract({ ...contract, accountabilityPartner: e.target.value })}
                  placeholder="Name of person who will hold you accountable"
                />
              </div>

              <div className="form-group">
                <label>Partner Email (Optional)</label>
                <input
                  type="email"
                  value={contract.partnerEmail}
                  onChange={(e) => setContract({ ...contract, partnerEmail: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div className="contract-preview">
                <div className="contract-text">
                  <p><strong>Commitment:</strong> {contract.commitment || '[Your commitment]'}</p>
                  <p><strong>Duration:</strong> {contract.duration} days starting {new Date(contract.startDate).toLocaleDateString()}</p>
                  <p><strong>Consequence:</strong> {contract.consequence || '[Your consequence]'}</p>
                  {contract.accountabilityPartner && (
                    <p><strong>Witnessed by:</strong> {contract.accountabilityPartner}</p>
                  )}
                  <p className="signature-line">Signature: ________________</p>
                  <p className="contract-date">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <button 
                className="sign-contract-btn"
                onClick={handleSign}
                disabled={!contract.commitment || !contract.consequence}
              >
                🖊️ Sign Contract
              </button>
            </>
          )}
        </div>
      )}

      <div className="contract-examples">
        <h4>Example Consequences</h4>
        <ul>
          <li>💰 Donate $10 to a charity you dislike</li>
          <li>🏋️ Do 100 burpees</li>
          <li>📱 No social media for a week</li>
          <li>🍰 Skip dessert for a week</li>
          <li>📺 No TV for 3 days</li>
        </ul>
      </div>
    </div>
  );
};

export default HabitContract;
