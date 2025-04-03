'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: 'PASTE_YOUR_CLIENT_ID_HERE', // Replace with the Client ID you copied
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          {
            theme: 'outline',
            size: 'large',
            width: 250,
            text: 'signin_with',
            shape: 'rectangular'
          }
        );
      };
    };

    loadGoogleScript();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Updated to use api utility
      const response = await api.post('/auth/login', formData);
      
      if (response.success) {
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userType', response.userType);
        localStorage.setItem('userEmail', response.email);
        
        window.location.href = `/${response.userType}/dashboard`;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      const token = response.credential;
      const result = await fetch('http://localhost:3002/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: token })
      });

      const data = await result.json();
      
      if (data.success) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('userEmail', data.email);
        
        window.location.href = `/${data.userType}/dashboard`;
      } else {
        setError(data.message || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-overlay"></div>
        <div className="auth-content">
          <h1>Welcome Back!</h1>
          <p>Connect with farmers and get fresh produce delivered to your doorstep</p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <h2>FarmConnect</h2>
          </div>
          <h3>Sign in to your account</h3>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email address</label>
              <div className="input-group">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div 
              id="googleSignInButton"
              className="google-sign-in-button"
            ></div>

            <p className="auth-footer">
              Don't have an account? 
              <a href="/register">Create account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
