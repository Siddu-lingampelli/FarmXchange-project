'use client';
import { useEffect, useState } from 'react';
import '../../styles/farmer-dashboard.css';
import { useRouter } from 'next/navigation'; // Add this import
import FarmerNavbar from '../../components/FarmerNavbar';

export default function FarmerDashboard() {
  const router = useRouter(); // Add router
  const [userEmail, setUserEmail] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [profile, setProfile] = useState({});
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    orderCount: 0,
    confirmedOrders: 0,
    recentOrders: []
  });

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('userEmail');
    
    if (userType !== 'farmer') {
      window.location.href = '/login';
      return;
    }
    
    setUserEmail(email);
    fetchMyProducts();
    fetchProfile();
    fetchOrders();

    // Set up intervals for periodic updates
    const productInterval = setInterval(fetchMyProducts, 30000);
    const orderInterval = setInterval(fetchOrders, 30000);

    return () => {
      clearInterval(productInterval);
      clearInterval(orderInterval);
    };
  }, []);

  const fetchMyProducts = async () => {
    try {
      const farmerId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:3002/api/products/farmer/${farmerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setMyProducts(data.products || []);
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

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/orders/farmer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (data.success) {
        setEarnings({
          totalEarnings: data.earnings.totalEarnings || 0,
          orderCount: data.earnings.orderCount || 0,
          confirmedOrders: data.earnings.confirmedOrders || 0,
          recentOrders: data.orders.slice(0, 5) || [] // Get only last 5 orders
        });
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(productId);
        fetchMyProducts(); // Refresh the products list
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <>
      <FarmerNavbar />
      <div className="dashboard-container">
        <div className="welcome-section">
          <h1 className="farmer-name">Welcome back, Farmer!</h1>
          <p className="welcome-subtitle">Manage your farm products and track orders efficiently</p>
        </div>

        <div className="metrics-row">
          <div className="metric-box">
            <div className="metric-icon">🌾</div>
            <div className="metric-info">
              <div className="metric-value">{myProducts.length}</div>
              <div className="metric-label">Total Products</div>
            </div>
          </div>
          
          <div className="metric-box">
            <div className="metric-icon">📦</div>
            <div className="metric-info">
              <div className="metric-value">{earnings.orderCount}</div>
              <div className="metric-label">Total Orders</div>
              <div className="metric-subtext">{earnings.confirmedOrders} confirmed</div>
            </div>
          </div>
          
          <div className="metric-box">
            <div className="metric-icon">💰</div>
            <div className="metric-info">
              <div className="metric-value">₹{earnings.totalEarnings}</div>
              <div className="metric-label">Total Earnings</div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <div 
            className="action-box" 
            onClick={() => handleNavigation('/farmer/products/manage')}
          >
            <div className="action-icon">➕</div>
            <h3 className="action-title">Add New Product</h3>
            <p className="action-subtitle">List new items for sale</p>
          </div>

          <div 
            className="action-box"
            onClick={() => handleNavigation('/farmer/orders')}
          >
            <div className="action-icon">📋</div>
            <h3 className="action-title">View Orders</h3>
            <p className="action-subtitle">Check and manage orders</p>
          </div>

          <div 
            className="action-box"
            onClick={() => handleNavigation('/farmer/earnings')}
          >
            <div className="action-icon">📊</div>
            <h3 className="action-title">Track Earnings</h3>
            <p className="action-subtitle">View your revenue</p>
          </div>
        </div>

        <div className="recent-products-section">
          <div className="section-header">
            <h2>Recent Products</h2>
            <a href="/farmer/products/manage" className="view-all-btn">View All</a>
          </div>
          <div className="products-grid">
            {myProducts.slice(0, 4).map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="product-image" />
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price}</p>
                  <p className="stock">Stock: {product.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-orders-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
          </div>
          <div className="orders-grid">
            {earnings.recentOrders && earnings.recentOrders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-header">
                  <h3>Order #{order.orderId}</h3>
                  <span className={`order-status ${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <div className="items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>
                  <p className="order-date">
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
