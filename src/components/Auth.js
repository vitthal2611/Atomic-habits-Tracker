import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAnonymous = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🎯 Atomic Habits</h2>
        <p className="auth-tagline">Sign in to sync your habits across devices</p>
        
        <form onSubmit={handleAuth} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} className="auth-toggle">
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>

        <div className="auth-divider">OR</div>

        <button onClick={handleAnonymous} className="auth-anonymous">
          Continue Without Account (Local Only)
        </button>
      </div>
    </div>
  );
};

export default Auth;
