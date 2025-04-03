const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    farmerName: String,
    image: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
