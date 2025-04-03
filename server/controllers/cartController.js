const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customerId: req.user.userId });
    res.json({ 
      success: true, 
      cart: cart || { items: [] }  // Return empty cart if none exists
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Debug logs
    console.log('Adding to cart:', { productId, userId: req.user._id });

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find or create cart with proper user ID
    let cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) {
      cart = new Cart({
        customerId: req.user._id,
        items: []
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        farmerId: product.farmerId,
        farmerName: product.farmerName,
        image: product.image
      });
    }

    const savedCart = await cart.save();
    console.log('Cart saved:', savedCart);

    res.json({
      success: true,
      cart: savedCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add product to cart'
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => !item.productId.equals(req.params.productId));
    await cart.save();
    res.json({ success: true, cart: cart.items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { change } = req.body; // change will be +1 or -1

    const cart = await Cart.findOne({ customerId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    const item = cart.items[itemIndex];
    const newQuantity = item.quantity + change;

    // Check if the new quantity is valid
    if (newQuantity <= 0) {
      // Remove item if quantity becomes 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }

      if (newQuantity > product.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Not enough stock available' 
        });
      }

      cart.items[itemIndex].quantity = newQuantity;
    }

    await cart.save();

    res.json({ 
      success: true, 
      cart: cart.items 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
