const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// CREATE NEW ORDER
router.post('/', async (req, res) => {
  const {
    orderItems,
    totalPrice,
    user, // We will send the User ID from the frontend
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else {
    const order = new Order({
      user,
      orderItems,
      totalPrice,
      isPaid: true, // For now, we assume instant payment
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// GET MY ORDERS (Optional: allows users to see history later)
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;