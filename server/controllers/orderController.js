const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    console.log('User:', req.user);

    const {
      fullName,
      phone,
      address,
      deliveryTime,
      paymentMethod,
      items,
      totalAmount
    } = req.body;

    if (!fullName || !phone || !address || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const order = new Order({
      customerId: req.user._id,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        farmerId: item.farmerId,
        farmerName: item.farmerName,
        image: item.image // Add image to order items
      })),
      totalAmount: totalAmount,
      status: 'pending',
      deliveryAddress: address,
      deliveryTime,
      paymentMethod,
      customerName: fullName,
      customerPhone: phone,
      customerEmail: req.user.email
    });

    await order.save();
    console.log('Order saved:', order);

    // Clear the customer's cart
    await Cart.findOneAndUpdate(
      { customerId: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      customerId: req.user._id 
    }).sort({ createdAt: -1 });

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      deliveryTime: order.deliveryTime,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt
    }));

    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};

exports.getFarmerOrders = async (req, res) => {
  try {
    // Find all orders that contain items from this farmer
    const orders = await Order.find({
      'items.farmerId': req.user._id
    }).sort({ createdAt: -1 });

    let totalEarnings = 0;
    let confirmedOrders = 0;

    // Process orders to get farmer-specific items and calculations
    const farmerOrders = orders.map(order => {
      // Filter items to only those belonging to this farmer
      const farmerItems = order.items.filter(item => 
        item.farmerId.toString() === req.user._id.toString()
      );

      // Calculate total for this order's farmer items
      const orderTotal = farmerItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      // Add to total earnings if order is confirmed
      if (order.status === 'confirmed') {
        totalEarnings += orderTotal;
        confirmedOrders++;
      }

      return {
        orderId: order._id,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        deliveryAddress: order.deliveryAddress,
        deliveryTime: order.deliveryTime,
        status: order.status,
        createdAt: order.createdAt,
        items: farmerItems,
        totalAmount: orderTotal
      };
    });

    res.json({
      success: true,
      orders: farmerOrders,
      earnings: {
        totalEarnings,
        orderCount: orders.length,
        confirmedOrders
      }
    });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        'items.farmerId': req.user.userId
      },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
