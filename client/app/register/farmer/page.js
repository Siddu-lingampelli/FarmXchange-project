'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FarmerRegister() {
  const [error, setError] = useState('');
  // ... existing state declarations
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = {
        ...formData,
        userType: 'farmer'
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code remains the same


  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-overlay"></div>
        <div className="auth-content">
          <h1>Join as a Farmer</h1>
          <p>Connect directly with customers and grow your business</p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <h2>FarmConnect</h2>
          </div>
          <h3>Create Farmer Account</h3>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
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
                  placeholder="Create a password"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Farm Name</label>
              <div className="input-group">
                <span className="input-icon">🌾</span>
                <input
                  type="text"
                  name="farmName"
                  placeholder="Enter your farm name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-group">
                <span className="input-icon">📞</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Farm Address</label>
              <div className="input-group">
                <span className="input-icon">📍</span>
                <textarea
                  name="farmAddress"
                  placeholder="Enter your farm address"
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="auth-footer">
              Already have an account? 
              <a href="/login">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
