'use client';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); // Initialize as empty array
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(data.cart?.items || []);
        calculateTotal(data.cart?.items || []);
      } else {
        setError(data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:3002/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart after removal
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:3002/api/cart/update/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ change })
      });

      const data = await response.json();
      
      if (response.ok) {
        await fetchCart(); // Refresh cart after update
      } else {
        setError(data.message || 'Failed to update quantity');
        // Refresh cart to ensure correct state
        await fetchCart();
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Failed to update quantity');
      await fetchCart(); // Refresh cart on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <nav className="navbar">
          <a href="/customer/dashboard" className="nav-link">Back to Dashboard</a>
        </nav>
        <div className="dashboard-container">
          <h1>Shopping Cart</h1>
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Shopping Cart</h2>
        </div>
        <div className="nav-group">
          <a href="/customer/dashboard" className="nav-link">
            <span className="nav-icon">🏪</span>
            Continue Shopping
          </a>
          <a href="/customer/orders" className="nav-link">
            <span className="nav-icon">📦</span>
            My Orders
          </a>
        </div>
      </nav>

      <div className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Fill it with fresh farm products!</p>
            <a href="/customer/dashboard" className="continue-shopping-btn">
              Start Shopping <span className="arrow">→</span>
            </a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/product-placeholder.png';
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="farmer-name">Sold by: {item.farmerName}</p>
                    <div className="price">₹{item.price} per unit</div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => updateQuantity(item.productId, -1)}
                          disabled={loading || item.quantity <= 1}
                        >−</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, 1)}
                          disabled={loading}
                        >+</button>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.productId)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="subtotal">
                <span>Items ({cartItems.length})</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="delivery-fee">
                <span>Delivery Fee</span>
                <span>₹40</span>
              </div>
              <div className="total">
                <span>Total Amount</span>
                <span>₹{totalAmount + 40}</span>
              </div>
              <a href="/customer/checkout" className="checkout-btn">
                Proceed to Checkout
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
