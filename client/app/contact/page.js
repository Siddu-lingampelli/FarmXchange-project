'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Thank you! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container">
      <Navbar />

      <div className="contact-hero">
        <div className="contact-hero-content">
          <span className="pre-title">Get In Touch</span>
          <h1>How Can We Help You?</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <section className="contact-section">
        <div className="contact-content">
          <div className="contact-methods">
            <div className="contact-method-card">
              <div className="contact-method-icon">📞</div>
              <h3>Call Us</h3>
              <p className="highlight">+1 (234) 567-8900</p>
              <p>Mon-Fri: 9AM-6PM</p>
            </div>
            {/* Add more contact method cards */}
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Visit Our Office</h3>
                  <p>123 Farm Street</p>
                  <p>Agricultural District</p>
                  <p>Rural City, 12345</p>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Call Us</h3>
                  <p className="highlight">+1 (234) 567-8900</p>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h3>Email Us</h3>
                  <p className="highlight">support@farmconnect.com</p>
                  <p>For general inquiries</p>
                  <p className="highlight">business@farmconnect.com</p>
                  <p>For business proposals</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <div className="form-header">
                <span className="pre-title">Contact Us</span>
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly</p>
              </div>
              
              {success && <div className="success-message">{success}</div>}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                    placeholder="How can we help?"
                  />
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Send Message
                  <span className="btn-icon">→</span>
                </button>
              </form>
            </div>
          </div>

          <div className="social-links">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon">📱</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">👥</a>
              <a href="#" className="social-icon">📸</a>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-content">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I place an order?</h3>
              <p>Simply browse our products, add items to your cart, and checkout when ready.</p>
            </div>
            <div className="faq-item">
              <h3>What are the delivery areas?</h3>
              <p>We currently deliver to major cities and surrounding areas.</p>
            </div>
            <div className="faq-item">
              <h3>How can I become a farmer on FarmConnect?</h3>
              <p>Register as a farmer through our sign-up process and complete verification.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
