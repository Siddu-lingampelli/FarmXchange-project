'use client';
export default function Register() {
  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>FarmConnect</h1>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/login" className="nav-link primary">Login</a>
        </div>
      </nav>

      <div className="register-choice-container">
        <div className="register-choice-header">
          <h1>Join FarmConnect</h1>
          <p>Choose how you want to be part of our community</p>
        </div>

        <div className="register-choice-grid">
          <div className="register-choice-card farmer">
            <div className="card-icon">👨‍🌾</div>
            <h2>Farmer Account</h2>
            <p>Join as a farmer to sell your products directly to customers</p>
            <ul className="benefits-list">
              <li>List and manage your products</li>
              <li>Reach more customers</li>
              <li>Track your earnings</li>
              <li>Manage orders efficiently</li>
            </ul>
            <a href="/register/farmer" className="choice-btn">Register as Farmer</a>
          </div>

          <div className="register-choice-card customer">
            <div className="card-icon">👥</div>
            <h2>Customer Account</h2>
            <p>Sign up as a customer to buy fresh produce directly from farms</p>
            <ul className="benefits-list">
              <li>Get fresh products</li>
              <li>Support local farmers</li>
              <li>Track your orders</li>
              <li>Convenient delivery</li>
            </ul>
            <a href="/register/customer" className="choice-btn">Register as Customer</a>
          </div>
        </div>
      </div>
    </div>
  );
}
