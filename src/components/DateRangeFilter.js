import React, { useState } from 'react';

const DateRangeFilter = ({ onApply }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    if (startDate && endDate) {
      onApply(new Date(startDate), new Date(endDate));
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onApply(null, null);
  };

  return (
    <div className="date-range-filter">
      <div className="filter-header">
        <h3>📅 Custom Date Range</h3>
      </div>
      <div className="date-inputs">
        <div className="date-input-group">
          <label>Start Date</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input-group">
          <label>End Date</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="filter-actions">
        <button onClick={handleApply} disabled={!startDate || !endDate}>
          Apply Filter
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
