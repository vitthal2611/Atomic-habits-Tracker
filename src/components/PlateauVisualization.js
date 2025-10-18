import React from 'react';

const PlateauVisualization = ({ daysSinceStart, streak }) => {
  const breakthroughPoint = 21;
  const progress = Math.min((daysSinceStart / breakthroughPoint) * 100, 100);
  const inValley = daysSinceStart >= 10 && daysSinceStart < breakthroughPoint;
  
  return (
    <div className="plateau-container">
      <div className="plateau-header">
        <h3>📈 The Plateau of Latent Potential</h3>
        <p>Why habits feel useless before they feel powerful</p>
      </div>
      
      <div className="plateau-chart">
        <svg viewBox="0 0 400 200" className="plateau-svg">
          {/* Expected linear progress */}
          <line x1="20" y1="180" x2="380" y2="20" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
          <text x="300" y="50" fill="#64748b" fontSize="12">Expected Results</text>
          
          {/* Actual curve */}
          <path 
            d="M 20 180 Q 150 170, 200 140 T 380 20" 
            stroke="#4f46e5" 
            strokeWidth="3" 
            fill="none"
          />
          <text x="280" y="100" fill="#4f46e5" fontSize="12" fontWeight="bold">Actual Results</text>
          
          {/* Valley of Disappointment */}
          <rect x="80" y="140" width="140" height="50" fill="#fef2f2" opacity="0.7" />
          <text x="90" y="165" fill="#dc2626" fontSize="11" fontWeight="600">Valley of</text>
          <text x="90" y="180" fill="#dc2626" fontSize="11" fontWeight="600">Disappointment</text>
          
          {/* Breakthrough line */}
          <line x1="240" y1="20" x2="240" y2="190" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
          <text x="245" y="15" fill="#10b981" fontSize="12" fontWeight="bold">Breakthrough</text>
          
          {/* Your position */}
          {daysSinceStart <= breakthroughPoint && (
            <>
              <circle 
                cx={20 + (daysSinceStart / breakthroughPoint) * 220} 
                cy={180 - Math.pow(daysSinceStart / breakthroughPoint, 2) * 140}
                r="6" 
                fill="#f59e0b"
              />
              <text 
                x={20 + (daysSinceStart / breakthroughPoint) * 220} 
                y={165 - Math.pow(daysSinceStart / breakthroughPoint, 2) * 140}
                fill="#f59e0b" 
                fontSize="12" 
                fontWeight="bold"
              >
                You
              </text>
            </>
          )}
        </svg>
      </div>
      
      <div className="plateau-progress">
        <div className="progress-bar-plateau">
          <div className="progress-fill-plateau" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="plateau-days">Day {daysSinceStart} of {breakthroughPoint}</div>
      </div>
      
      <div className={`plateau-message ${inValley ? 'warning' : 'success'}`}>
        {daysSinceStart < 10 && (
          <>
            <span className="message-icon">🌱</span>
            <p><strong>Early Days:</strong> You're planting seeds. Results aren't visible yet, but you're building the foundation.</p>
          </>
        )}
        {inValley && (
          <>
            <span className="message-icon">⚠️</span>
            <p><strong>The Valley of Disappointment:</strong> This is where most people quit. You're doing the work but not seeing results. Keep going - breakthrough is near!</p>
          </>
        )}
        {daysSinceStart >= breakthroughPoint && (
          <>
            <span className="message-icon">🏆</span>
            <p><strong>Breakthrough Zone!</strong> You've crossed the critical threshold. Your habits are now compounding. This is where change becomes visible.</p>
          </>
        )}
      </div>
      
      <div className="plateau-quote">
        "All big things come from small beginnings. The seed of every habit is a single, tiny decision. But as that decision is repeated, a habit sprouts and grows stronger."
      </div>
    </div>
  );
};

export default PlateauVisualization;
