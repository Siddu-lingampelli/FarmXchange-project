'use client';
import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import '../../../styles/product-management.css'; // Add this import
import FarmerNavbar from '../../../components/FarmerNavbar';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    unit: 'kg', // Default unit
    image: null
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Form validation
      if (!formData.name?.trim()) {
        setError('Product name is required');
        return;
      }
      if (!formData.description?.trim()) {
        setError('Product description is required');
        return;
      }
      if (!formData.price || formData.price <= 0) {
        setError('Valid price is required');
        return;
      }
      if (!formData.quantity || formData.quantity <= 0) {
        setError('Valid quantity is required');
        return;
      }

      const token = localStorage.getItem('userToken');
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('category', formData.category || 'vegetables');
      formDataToSend.append('unit', formData.unit || 'kg');
      
      // Use default image if none selected
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      } else {
        formDataToSend.append('image', 'default-product.png');
      }

      console.log('Sending form data:', Object.fromEntries(formDataToSend));

      const response = await fetch('http://localhost:3002/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }

      setSuccessMessage('Product added successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: 'vegetables',
        unit: 'kg'
      });
      setSelectedImage(null);
      setPreviewUrl('');
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Please login again');
      }

      const farmerId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3002/api/products/farmer/${farmerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data.products || []);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch products:', error);
      if (error.message.includes('login')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'farmer') {
      window.location.href = '/login';
      return;
    }
    
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setShowForm(true);
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      unit: 'kg',
      image: null
    });
    setPreviewUrl('');
  };

  const handleEdit = (product) => {
    // Logic for editing a product
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(productId);
        await fetchProducts();
      } catch (error) {
        setError('Failed to delete product');
      }
    }
  };

  return (
    <>
      <FarmerNavbar />
      <div className="product-management">
        <div className="management-header">
          <div className="header-title">
            <h1>Product Management</h1>
            <p>Manage your farm products</p>
          </div>
          <button className="add-product-btn" onClick={() => handleAddProduct()}>
            <span>+</span> Add New Product
          </button>
        </div>

        {showForm && (
          <div className="add-product-form">
            <div className="form-header">
              <h2>Add New Product</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
            </div>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="image-upload-section">
                <input
                  type="file"
                  id="product-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-input"
                  required
                />
                <label htmlFor="product-image" className="upload-area">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📸</span>
                      <p>Click or drag image here</p>
                      <span className="upload-hint">Recommended size: 800x600px</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                  </select>
                </div>

                <div className="form-group price-group">
                  <label htmlFor="price">Price (₹) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group quantity-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <div className="quantity-input">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="Enter quantity"
                    />
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="kg">Kg</option>
                      <option value="g">g</option>
                      <option value="dozen">Dozen</option>
                      <option value="piece">Piece</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Describe your product"
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Add Product
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🌾</div>
            <h3>No Products Added</h3>
            <p>Start adding your farm products</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-product.png';
                  }}
                />
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">₹{product.price}</div>
                  <div className="product-stock">Stock: {product.quantity} {product.unit}</div>
                  <div className="product-actions">
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
