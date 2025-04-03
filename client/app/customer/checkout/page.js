'use client';
import { useState, useEffect } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import '../../styles/secure-checkout.css';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
    deliveryTime: 'morning'
  });

  useEffect(() => {
    loadCartAndUserDetails();
  }, []);

  const loadCartAndUserDetails = async () => {
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
        setError('Failed to load cart');
      }
    } catch (error) {
      console.error('Failed to load checkout details:', error);
      setError('Failed to load checkout details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({ ...orderDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!orderDetails.fullName || !orderDetails.phone || !orderDetails.address) {
        throw new Error('Please fill in all required fields');
      }

      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:3002/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: orderDetails.fullName,
          phone: orderDetails.phone,
          address: orderDetails.address,
          deliveryTime: orderDetails.deliveryTime,
          paymentMethod: orderDetails.paymentMethod,
          items: cartItems,
          totalAmount: totalAmount + 40
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      alert('Order placed successfully!');
      window.location.href = '/customer/orders';
    } catch (error) {
      console.error('Order error:', error);
      setError(error.message || 'Failed to place order');
    }
  };

  const handleUPIPayment = (method) => {
    setOrderDetails(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  if (loading) {
    return (
      <div className="container">
        <nav className="navbar">
          <a href="/customer/cart" className="nav-link">Back to Cart</a>
        </nav>
        <div className="dashboard-container">
          <h1>Checkout</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <nav className="navbar">
          <a href="/customer/cart" className="nav-link">Back to Cart</a>
        </nav>
        <div className="dashboard-container">
          <h1>Checkout</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomerNavbar />
      <div className="checkout-container">
        <div className="delivery-section">
          <h2 className="section-title">Delivery Details</h2>
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name*</label>
                <input 
                  type="text"
                  className="form-control"
                  name="fullName"
                  value={orderDetails.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number*</label>
                <input 
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={orderDetails.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address*</label>
                <textarea 
                  className="form-control"
                  name="address"
                  value={orderDetails.address}
                  onChange={handleChange}
                  required
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Time</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="morning"
                      checked={orderDetails.deliveryTime === 'morning'}
                      onChange={handleChange}
                    />
                    <span className="radio-label">Morning (9 AM - 12 PM)</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="afternoon"
                      checked={orderDetails.deliveryTime === 'afternoon'}
                      onChange={handleChange}
                    />
                    <span className="radio-label">Afternoon (12 PM - 3 PM)</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryTime"
                      value="evening"
                      checked={orderDetails.deliveryTime === 'evening'}
                      onChange={handleChange}
                    />
                    <span className="radio-label">Evening (3 PM - 6 PM)</span>
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div className="payment-section">
            <h3 className="section-title">Select Payment Method</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={orderDetails.paymentMethod === 'cash'}
                  onChange={(e) => handleUPIPayment('cash')}
                />
                <div className="payment-content">
                  <span className="payment-icon">💵</span>
                  <div className="payment-details">
                    <div className="payment-name">Cash on Delivery</div>
                    <div className="payment-info">Pay when you receive</div>
                  </div>
                </div>
              </label>

              <div className="online-payment">
                <h4 className="payment-subtitle">Pay Online (UPI)</h4>
                <div className="upi-options">
                  <button 
                    className={`upi-option ${orderDetails.paymentMethod === 'gpay' ? 'selected' : ''}`}
                    onClick={() => handleUPIPayment('gpay')}
                  >
                    <img 
                      src="https://static.vecteezy.com/system/resources/previews/017/221/853/original/google-pay-logo-transparent-free-png.png" 
                      alt="Google Pay" 
                      className="upi-logo"
                    />
                    <span>Google Pay</span>
                  </button>

                  <button 
                    className={`upi-option ${orderDetails.paymentMethod === 'phonepe' ? 'selected' : ''}`}
                    onClick={() => handleUPIPayment('phonepe')}
                  >
                    <img 
                      src="https://th.bing.com/th/id/OIP.NnVN55UD-vWuXyxXsFWAeAHaHa?w=153&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" 
                      alt="PhonePe" 
                      className="upi-logo"
                    />
                    <span>PhonePe</span>
                  </button>

                  <button 
                    className={`upi-option ${orderDetails.paymentMethod === 'paytm' ? 'selected' : ''}`}
                    onClick={() => handleUPIPayment('paytm')}
                  >
                    <img 
                      src="https://static.vecteezy.com/system/resources/previews/022/100/711/large_2x/paytm-logo-transparent-free-png.png" 
                      alt="Paytm" 
                      className="upi-logo"
                    />
                    <span>Paytm</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h2 className="section-title">Order Summary ({cartItems.length} items)</h2>
          <div className="summary-items">
            {cartItems.map((item, index) => (
              <div key={index} className="summary-item">
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="seller-info">Sold by: {item.farmerName}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="price-row">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>
            <div className="total-row">
              <span>Total</span>
              <span>₹{totalAmount + 40}</span>
            </div>
          </div>

          <button 
            className="place-order-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </>
  );
}
