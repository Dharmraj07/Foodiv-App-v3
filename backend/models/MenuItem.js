const mongoose = require("mongoose");

const RestaurantMenuSchema = new mongoose.Schema(
  {
    image: String,
    name: String, // Name of the dish
    description: String, // Description of the dish
    category: String, // E.g., Appetizers, Main Courses, Desserts
    cuisine: String, // Type of cuisine (e.g., Italian, Indian)
    price: Number, // Price of the dish
    discountedPrice: Number, // Discounted price if applicable
    availableStock: Number, // Total stock available for the dish
    averageRating: Number, // Average customer rating
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", RestaurantMenuSchema);
