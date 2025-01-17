const Order = require("../../models/Order");

// Get all orders of all users
exports.getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Fetch all orders, sorted by creation date
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// Get order details for admin
exports.getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params; // Extract order ID from params
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Failed to fetch order details." });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Extract order ID from params
    const { status } = req.body; // Extract new status from request body

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    order.updatedAt = new Date();

    const updatedOrder = await order.save();
    res.status(200).json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status." });
  }
};
