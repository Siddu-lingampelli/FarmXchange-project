'use client';
import { useEffect, useState } from 'react';
import '../../styles/order-management.css';
import FarmerNavbar from '../../components/FarmerNavbar';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/orders/farmer', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('userToken');
      await fetch(`http://localhost:3002/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const token = localStorage.getItem('userToken');
      await fetch(`http://localhost:3002/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-badge success';
      case 'cancelled': return 'status-badge danger';
      case 'delivered': return 'status-badge delivered';
      case 'shipped': return 'status-badge shipped';
      default: return 'status-badge pending';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <>
      <FarmerNavbar />
      <div className="order-management">
        <div className="management-header">
          <div className="header-content">
            <div className="header-title">
              <h1>Order Management</h1>
              <p>Manage and track your orders</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-value">{orders.length}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {orders.filter(order => order.status === 'confirmed').length}
                </div>
                <div className="stat-label">Confirmed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {orders.filter(order => order.status === 'pending').length}
                </div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-grid">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="filter-buttons">
              {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  className={`filter-button ${filter === status ? 'active' : ''}`}
                  onClick={() => setFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No orders found</h3>
            <p>{searchQuery ? 'Try different search terms' : 'New orders will appear here'}</p>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order.orderId} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <div className="order-id">
                      <h3>Order #{order.orderId}</h3>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="order-date">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()} at {' '}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="order-amount">
                    <span className="amount-label">Order Total:</span>
                    <span className="amount-value">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="customer-details">
                    <h4>Customer Details</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{order.customerName}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{order.customerPhone}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Delivery:</span>
                        <span className="info-value">{order.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="delivery-address">
                      <span className="info-label">Delivery Address:</span>
                      <p className="address-text">{order.deliveryAddress}</p>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Order Items</h4>
                    <div className="items-list">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="item-row">
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                          </div>
                          <span className="item-price">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="order-actions">
                    <button 
                      className="action-btn confirm"
                      onClick={() => handleOrderAction(order.orderId, 'confirmed')}
                    >
                      Accept Order
                    </button>
                    <button 
                      className="action-btn cancel"
                      onClick={() => handleOrderAction(order.orderId, 'cancelled')}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
