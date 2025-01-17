const express = require("express");

const { addToCart, deleteCartItem, updateCartItemQty, fetchCartItems } = require("../../controllers/restaurant/cart-controller");

const router = express.Router();

// Add item to cart
router.post("/add", addToCart);

// Get cart items for a specific user
router.get("/get/:userId", fetchCartItems);

// Update item quantity in the cart
router.put("/update-cart", updateCartItemQty);

// Delete item from the cart
router.delete("/:userId/:productId", deleteCartItem);

module.exports = router;
