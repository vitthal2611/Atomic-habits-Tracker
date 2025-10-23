import React from 'react';
import './BottomNavigation.css';

const BottomNavigation = ({ currentView, onViewChange }) => {
  const tabs = [
    { id: 'today', icon: '🏠', label: 'Today' },
    { id: 'tasks', icon: '✅', label: 'Tasks' },
    { id: 'progress', icon: '📊', label: 'Progress' },
    { id: 'insights', icon: '💡', label: 'Insights' },
    { id: 'tools', icon: '🛠️', label: 'Tools' }
  ];

  return (
    <nav className="bottom-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`bottom-nav-item ${currentView === tab.id ? 'active' : ''}`}
          onClick={() => onViewChange(tab.id)}
          aria-label={tab.label}
          aria-current={currentView === tab.id ? 'page' : undefined}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavigation;
