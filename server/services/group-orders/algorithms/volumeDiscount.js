module.exports = function calculateVolumeDiscount(order) {
  if (order.total > 100) {
    return order.total * 0.9; // 10% discount for orders above $100
  }
  return order.total; // No discount
};
