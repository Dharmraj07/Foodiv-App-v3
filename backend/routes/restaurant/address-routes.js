const express = require("express");
const {
  addAddress,
  fetchAllAddresses,
  editAddress,
  deleteAddress,
} = require("../../controllers/restaurant/address-controller");

const router = express.Router();

// Routes
router.post("/add", addAddress); // Add a new address
router.get("/get/:userId", fetchAllAddresses); // Fetch all addresses for a user
router.put("/update/:userId/:addressId", editAddress); // Edit an address
router.delete("/delete/:userId/:addressId", deleteAddress); // Delete an address

module.exports = router;
