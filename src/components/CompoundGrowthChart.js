import React from 'react';

const CompoundGrowthChart = ({ daysSinceStart }) => {
  const days = Math.min(daysSinceStart, 365);
  const betterValue = Math.pow(1.01, days).toFixed(2);
  const worseValue = Math.pow(0.99, days).toFixed(2);
  
  const points = [];
  for (let i = 0; i <= 12; i++) {
    const day = (i / 12) * 365;
    const y = Math.pow(1.01, day);
    points.push({ x: (i / 12) * 360 + 20, y: 180 - (y - 1) * 40 });
  }
  
  const worsePoints = [];
  for (let i = 0; i <= 12; i++) {
    const day = (i / 12) * 365;
    const y = Math.pow(0.99, day);
    worsePoints.push({ x: (i / 12) * 360 + 20, y: 180 - (y - 1) * 40 });
  }
  
  return (
    <div className="compound-growth-chart">
      <h3>📈 The Compound Effect</h3>
      <p>Small changes make a big difference over time</p>
      
      <svg viewBox="0 0 400 220" className="growth-svg">
        <line x1="20" y1="180" x2="380" y2="180" stroke="#cbd5e1" strokeWidth="2" />
        <line x1="20" y1="20" x2="20" y2="180" stroke="#cbd5e1" strokeWidth="2" />
        
        <text x="200" y="210" textAnchor="middle" fill="#64748b" fontSize="12">Days</text>
        <text x="10" y="100" textAnchor="middle" fill="#64748b" fontSize="12" transform="rotate(-90 10 100)">Growth</text>
        
        <path 
          d={`M ${points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
          stroke="#10b981" 
          strokeWidth="3" 
          fill="none"
        />
        <text x="300" y="60" fill="#10b981" fontSize="12" fontWeight="bold">+1% Daily</text>
        
        <path 
          d={`M ${worsePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}`}
          stroke="#ef4444" 
          strokeWidth="3" 
          fill="none"
        />
        <text x="300" y="190" fill="#ef4444" fontSize="12" fontWeight="bold">-1% Daily</text>
        
        {days > 0 && (
          <circle cx={20 + (days / 365) * 360} cy={180 - (Math.pow(1.01, days) - 1) * 40} r="5" fill="#f59e0b" />
        )}
      </svg>
      
      <div className="compound-stats-grid">
        <div className="compound-stat better">
          <div className="stat-value">{betterValue}x</div>
          <div className="stat-label">1% Better Daily</div>
          <div className="stat-detail">After {days} days</div>
        </div>
        <div className="compound-stat worse">
          <div className="stat-value">{worseValue}x</div>
          <div className="stat-label">1% Worse Daily</div>
          <div className="stat-detail">After {days} days</div>
        </div>
      </div>
      
      <div className="compound-insight">
        {days < 30 && "🌱 Early days - trust the process"}
        {days >= 30 && days < 90 && "📈 Momentum building - keep going"}
        {days >= 90 && days < 180 && "🔥 Compound interest kicking in"}
        {days >= 180 && "🏆 You're experiencing exponential growth"}
      </div>
    </div>
  );
};

export default CompoundGrowthChart;
