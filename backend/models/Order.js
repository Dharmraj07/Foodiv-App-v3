const mongoose = require("mongoose");

const RestaurantOrderSchema = new mongoose.Schema({
  customerId: String, // ID of the customer placing the order
  cartId: String, // Associated cart ID
  items: [
    {
      menuItemId: String, // ID of the menu item
      name: String, // Name of the dish
      image: String, // Image URL of the dish
      price: Number, // Price of the dish
      quantity: Number, // Quantity ordered
    },
  ],
  deliveryDetails: {
    addressId: String, // ID of the saved address
    fullAddress: String, // Complete address
    city: String, // City
    postalCode: String, // Postal code
    contactNumber: String, // Customer's contact number
    additionalNotes: String, // Special delivery instructions
  },
  status: String, // Order status (e.g., pending, delivered, canceled)
  paymentType: String, // Payment method (e.g., card, cash)
  paymentStatus: String, // Payment status (e.g., paid, unpaid)
  totalAmount: Number, // Total cost of the order
  createdAt: Date, // Order creation timestamp
  updatedAt: Date, // Last update timestamp for the order
  paymentDetails: {
    transactionId: String, // ID of the payment transaction
    payerId: String, // ID of the payer
  },
});

module.exports = mongoose.model("Order", RestaurantOrderSchema);
