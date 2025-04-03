'use client';

export default function Navbar() {
  return (
    <nav className="main-navbar">
      <div className="nav-brand">
        <h1>FarmConnect</h1>
      </div>
      <div className="nav-links">
        <a href="/" className="nav-button">Home</a>
        <a href="/about" className="nav-button">About</a>
        <a href="/contact" className="nav-button">Contact</a>
        <a href="/login" className="nav-button">Login</a>
        <a href="/register" className="nav-button primary">Register</a>
      </div>
    </nav>
  );
}
