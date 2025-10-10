import React from 'react';
import ReactDOM from 'react-dom/client';
import { UnifiedApp } from './app/UnifiedApp.tsx';
import './App.css';
import './AddHabit.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<UnifiedApp />);