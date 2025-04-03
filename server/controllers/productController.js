const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
    }
  }
}).single('image');

exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
        category: req.body.category || 'vegetables',
        unit: req.body.unit || 'kg',
        farmerId: req.user.userId,
        farmerName: req.user.fullName,
        // Make image optional
        image: req.file ? `/uploads/products/${req.file.filename}` : '/default-product.png'
      };

      // Validate required fields
      if (!productData.name || !productData.description || !productData.price || !productData.quantity) {
        return res.status(400).json({
          success: false,
          message: 'All required fields must be provided'
        });
      }

      const product = new Product(productData);
      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product
      });
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error creating product'
      });
    }
  });
};

exports.getFarmerProducts = async (req, res) => {
  try {
    console.log('Fetching products for farmer:', req.params.farmerId);
    const products = await Product.find({ farmerId: req.params.farmerId });
    console.log('Found products:', products);
    res.json({ 
      success: true, 
      products
    });
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch products' 
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    console.log('Fetching all products');
    const products = await Product.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('-__v'); // Exclude version key
    
    console.log(`Found ${products.length} products`);
    res.json({ 
      success: true, 
      products,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch products' 
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmerId: req.user.userId
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
