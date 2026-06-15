const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId || !qty) {
      return res.status(400).json({ message: "productId and qty are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.countInStock < qty) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQty = cart.items[existingItemIndex].qty + qty;

      if (newQty > product.countInStock) {
        return res.status(400).json({ message: "Quantity exceeds stock" });
      }

      cart.items[existingItemIndex].qty = newQty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
        countInStock: product.countInStock,
      });
    }

    const savedCart = await cart.save();
    return res.status(201).json(savedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name image price countInStock"
    );

    if (!cart) {
      return res.status(200).json({ user: req.user._id, items: [] });
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { qty } = req.body;
    const { productId } = req.params;

    if (!qty || qty < 1) {
      return res.status(400).json({ message: "Valid qty is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (qty > product.countInStock) {
      return res.status(400).json({ message: "Quantity exceeds stock" });
    }

    item.qty = qty;
    item.countInStock = product.countInStock;

    const updatedCart = await cart.save();
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    const updatedCart = await cart.save();
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getMyCart,
  updateCartItemQty,
  removeCartItem,
};