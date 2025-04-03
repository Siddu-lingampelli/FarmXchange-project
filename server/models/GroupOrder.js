const mongoose = require('mongoose');

const GroupOrderSchema = new mongoose.Schema(
  {
    name: String,
    items: [String],
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('GroupOrder', GroupOrderSchema);
