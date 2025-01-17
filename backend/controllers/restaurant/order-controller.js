const Cart = require("../../models/Cart");
const Order = require("../../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { customerId, cartId, deliveryDetails, paymentType } = req.body;

    // Fetch cart details
    const cart = await Cart.findById(cartId).populate("items.menuItemId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Prepare items for the order
    const items = cart.items.map((item) => ({
      menuItemId: item.menuItemId._id,
      name: item.menuItemId.name,
      image: item.menuItemId.image,
      price: item.menuItemId.price,
      quantity: item.quantity,
    }));

    // Calculate total amount
    const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Handle Razorpay order creation for online payment
    let razorpayOrderId = null;
    if (paymentType === "online") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // Razorpay expects the amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      razorpayOrderId = razorpayOrder.id;
    }

    // Save order to the database
    const order = new Order({
      customerId,
      cartId,
      items,
      deliveryDetails,
      status: "pending",
      paymentType,
      paymentStatus: paymentType === "online" ? "pending" : "unpaid",
      totalAmount,
      createdAt: new Date(),
      paymentDetails: razorpayOrderId ? { transactionId: razorpayOrderId } : {},
    });

    const savedOrder = await order.save();
    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
      razorpayOrderId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Capture Razorpay payment
exports.capturePayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify Razorpay payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.paymentDetails.transactionId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Update order on successful payment
    order.paymentDetails = {
      transactionId: razorpayPaymentId,
      payerId: razorpayPaymentId,
    };
    order.paymentStatus = "paid";
    order.status = "pending";
    order.updatedAt = new Date();

    const updatedOrder = await order.save();
    res.status(200).json({
      message: "Payment successful and order completed",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to capture payment" });
  }
};

// Get all orders by user
exports.getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ customerId: userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};
