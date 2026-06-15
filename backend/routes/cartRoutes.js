const express = require("express");
const router = express.Router();
const {
  addToCart,
  getMyCart,
  updateCartItemQty,
  removeCartItem,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, addToCart)
  .get(protect, getMyCart);

router.route("/:productId")
  .put(protect, updateCartItemQty)
  .delete(protect, removeCartItem);

module.exports = router;