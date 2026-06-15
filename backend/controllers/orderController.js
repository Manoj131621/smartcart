const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const addOrderItems = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product,
    }));

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    cart.items = [];
    await cart.save();

    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = new Date();

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name email");
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
};