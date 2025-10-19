import React, { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    console.warn('useToast must be used within ToastProvider');
    return { success: () => {}, error: () => {}, info: () => {} };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', action = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, action }]);
    
    if (!action) {
      setTimeout(() => removeToast(id), 4000);
    }
  }, [removeToast]);

  const success = useCallback((message, action) => addToast(message, 'success', action), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, action, onClose }) => {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <div className="toast-actions">
        {action && (
          <button className="toast-action-btn" onClick={() => { action.onClick(); onClose(); }}>
            {action.label}
          </button>
        )}
        <button className="toast-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};
