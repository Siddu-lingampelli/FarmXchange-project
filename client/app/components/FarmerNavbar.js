'use client';
import { useRouter } from 'next/navigation';

export default function FarmerNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  return (
    <nav className="farmer-navbar">
      <div className="nav-brand">
        <h2>FarmConnect</h2>
      </div>
      <div className="nav-links">
        <button onClick={() => router.push('/farmer/dashboard')} className="nav-link">
          <span className="nav-icon">🏠</span>
          Dashboard
        </button>
        <button onClick={() => router.push('/farmer/products/manage')} className="nav-link">
          <span className="nav-icon">📦</span>
          Products
        </button>
        <button onClick={() => router.push('/farmer/orders')} className="nav-link">
          <span className="nav-icon">🛍️</span>
          Orders
        </button>
        <button onClick={() => router.push('/farmer/profile')} className="nav-link">
          <span className="nav-icon">👤</span>
          Profile
        </button>
        <button onClick={handleLogout} className="nav-link logout">
          <span className="nav-icon">🚪</span>
          Log Out
        </button>
      </div>
    </nav>
  );
}
