'use client';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="container">
      <Navbar />

      <div className="about-hero">
        <div className="about-hero-content">
          <h1>Our Story</h1>
          <p className="about-subtitle">Connecting Farms to Families Since 2023</p>
        </div>
      </div>

      <section className="about-stats">
        <div className="stats-container">
          <div className="stat-item" data-aos="fade-up" data-aos-delay="100">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Farmers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Customers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">20+</span>
            <span className="stat-label">Cities</span>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <div className="mission-vision">
            <div className="about-card featured">
              <div className="card-icon">🎯</div>
              <h2>Our Mission</h2>
              <p>To create a sustainable connection between farmers and consumers, ensuring fair prices and fresh produce for everyone.</p>
            </div>
            <div className="about-card featured">
              <div className="card-icon">👁️</div>
              <h2>Our Vision</h2>
              <p>To revolutionize agricultural commerce by leveraging technology to benefit both farmers and consumers.</p>
            </div>
          </div>

          <div className="journey-section">
            <h2>Our Journey of Growth</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>2023</h3>
                  <p>Launched FarmConnect with 50 farmers</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>2024</h3>
                  <p>Expanded to 10 cities across the region</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3>Future</h3>
                  <p>Planning nationwide expansion</p>
                </div>
              </div>
            </div>
          </div>

          <div className="values-section">
            <h2>What Drives Us</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌱</div>
                <h3>Sustainability</h3>
                <p>Promoting eco-friendly farming practices and packaging solutions</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Fair Trade</h3>
                <p>Ensuring farmers get fair prices for their produce</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💫</div>
                <h3>Quality First</h3>
                <p>Maintaining high standards in product quality</p>
              </div>
              <div className="value-card">
                <div className="value-icon">💪</div>
                <h3>Community</h3>
                <p>Building strong relationships with local farmers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
