'use client';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import CustomerNavbar from '../../components/CustomerNavbar';

export default function CustomerDashboard() {
  const [userEmail, setUserEmail] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] }); // Initialize cart with items array
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [profile, setProfile] = useState({});
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      console.log('Cart data:', data); // Debug log
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('userEmail');
    
    if (userType !== 'customer') {
      window.location.href = '/login';
    }
    setUserEmail(email);
    fetchProducts();
    fetchCart();
    fetchProfile();

    // Poll for updates
    const interval = setInterval(fetchProducts, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/products/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile();
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');

      const response = await fetch('http://localhost:3002/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        showToast(`${product.name} added to cart!`);
        await fetchCart(); // Refresh cart after adding
      } else {
        throw new Error(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast(error.message || 'Failed to add to cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CustomerNavbar />
      <div className="container">
        {/* Add Toast Notification */}
        {toast.show && (
          <div className={`toast ${toast.type}`} style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '1rem 2rem',
            background: toast.type === 'success' ? '#4caf50' : '#f44336',
            color: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {toast.message}
          </div>
        )}

        {orderMessage && (
          <div className="success-message" style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            padding: '1rem',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {orderMessage}
          </div>
        )}
        
        <nav className="navbar">
          <div className="nav-brand">
            <h2>FarmConnect</h2>
          </div>
          <div className="nav-group">
            <a href="/customer/orders" className="nav-link">
              <span className="nav-icon">📦</span>
              My Orders
            </a>
            <a href="/customer/cart" className="nav-link">
              <span className="nav-icon">🛒</span>
              Cart ({cart?.items?.length || 0})
            </a>
            <a href="/customer/profile" className="nav-link nav-profile">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt="" className="nav-profile-photo" />
              ) : (
                <div className="nav-default-profile">👤</div>
              )}
              <span>Profile</span>
            </a>
            <button className="nav-link" onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}>
              <span className="nav-icon">🚪</span>
              Logout
            </button>
          </div>
        </nav>

        <div className="dashboard-container">
          <div className="welcome-banner">
            <h1>Welcome to FarmConnect Market!</h1>
            <p>Discover fresh products directly from local farmers</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="categories-section">
            <div className="section-header">
              <h2>Categories</h2>
            </div>
            <div className="categories-grid">
              <div className="category-card">
                <span className="category-icon">🥬</span>
                <h3>Vegetables</h3>
              </div>
              <div className="category-card">
                <span className="category-icon">🍎</span>
                <h3>Fruits</h3>
              </div>
              <div className="category-card">
                <span className="category-icon">🥖</span>
                <h3>Grains</h3>
              </div>
              <div className="category-card">
                <span className="category-icon">🥜</span>
                <h3>Nuts</h3>
              </div>
            </div>
          </div>

          <div className="products-section">
            <div className="section-header">
              <h2>Available Products</h2>
            </div>
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="product-image" />
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="price">₹{product.price}</p>
                    <p className="farmer">By: {product.farmerName}</p>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={loading || product.quantity < 1}
                    >
                      {loading ? 'Adding...' : product.quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
