import React from 'react';

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '32px'
  };

  return (
    <div 
      className="spinner" 
      style={{ width: sizes[size], height: sizes[size] }}
      role="status"
      aria-label="Loading"
    />
  );
};

export const ButtonLoading = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="habit-skeleton" aria-label="Loading habit" />
  );
};

export const SkeletonList = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
};

export const EmptyState = ({ icon, title, description, action, onAction }) => {
  return (
    <div className="empty-state-improved">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {action && onAction && (
        <button className="btn btn-primary btn-lg" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="empty-state-improved" style={{ borderColor: 'var(--error)' }}>
      <div className="empty-state-icon">⚠️</div>
      <h3 className="empty-state-title">Something went wrong</h3>
      <p className="empty-state-description">{message || 'Please try again'}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
