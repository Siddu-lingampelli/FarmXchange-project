'use client';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="container">
        <Navbar />

        <section className="home-hero">
          <div className="hero-content">
            <h1>Fresh From Farm to Your Table</h1>
            <p>Connect directly with local farmers and get fresh produce delivered to your doorstep</p>
            <div className="hero-badges">
              <span className="badge">100% Fresh</span>
              <span className="badge">Direct from Farmers</span>
              <span className="badge">Quick Delivery</span>
            </div>
            <a href="/register" className="cta-button">
              Get Started
              <span className="cta-icon">→</span>
            </a>
          </div>
        </section>

        <section className="features-section">
          <div className="section-title">
            <h2>Why Choose Us</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🌾</span>
              <h3>Fresh Products</h3>
              <p>Direct from farms ensuring maximum freshness</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👨‍🌾</span>
              <h3>Support Local Farmers</h3>
              <p>Help local farmers grow their business</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🚚</span>
              <h3>Quick Delivery</h3>
              <p>Fast and reliable delivery service</p>
            </div>
          </div>
        </section>

        <section className="steps-section">
          <div className="section-title">
            <h2>How It Works</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Register Account</h3>
              <p>Sign up as a customer or farmer</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Browse Products</h3>
              <p>Explore fresh produce from local farms</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Place Order</h3>
              <p>Select items and place your order</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Get Delivery</h3>
              <p>Receive fresh products at your doorstep</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: support@farmconnect.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <p><a href="/about">About Us</a></p>
              <p><a href="/contact">Contact Us</a></p>
              <p><a href="/register/farmer">Become a Farmer</a></p>
              <p><a href="/register/customer">Register as Customer</a></p>
              <p><a href="/login">Login</a></p>
            </div>
          </div>
          <div className="copyright">
            © 2023 FarmConnect. All rights reserved.
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
