'use client';
import { useRouter } from 'next/navigation';

export default function CustomerNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    router.push('/login');
  };

  return (
    <nav className="customer-navbar">
      <div className="nav-brand">
        <h2>FarmConnect</h2>
      </div>
      <div className="nav-links">
        <button onClick={() => router.push('/customer/dashboard')} className="nav-link">
          <span className="nav-icon">🏠</span>
          Dashboard
        </button>
        <button onClick={() => router.push('/customer/orders')} className="nav-link">
          <span className="nav-icon">📦</span>
          Orders
        </button>
        <button onClick={() => router.push('/customer/cart')} className="nav-link">
          <span className="nav-icon">🛒</span>
          Cart
        </button>
        <button onClick={() => router.push('/customer/profile')} className="nav-link">
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
