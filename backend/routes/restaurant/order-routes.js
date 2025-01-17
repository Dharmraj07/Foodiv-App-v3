const express = require("express");
const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/restaurant/order-controller");

const router = express.Router();

// Route to create an order
router.post("/create", createOrder);

// Route to capture Razorpay payment
router.post("/capture", capturePayment);

// Route to get all orders for a specific user
router.get("/list/:userId", getAllOrdersByUser);

// Route to get details of a specific order
router.get("/details/:id", getOrderDetails);

module.exports = router;
