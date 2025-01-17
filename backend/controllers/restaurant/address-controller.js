const Address = require("../../models/Address");

// Add a new address
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    // Validate required fields
    if (!userId || !address || !city || !pincode || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields (userId, address, city, pincode, phone) must be provided.",
      });
    }

    // Create and save new address
    const newAddress = await Address.create({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });

    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add address.",
    });
  }
};

// Fetch all addresses for a user
const fetchAllAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const addresses = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses.",
    });
  }
};

// Edit an address
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const updates = req.body;

    // Validate parameters
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and address ID are required.",
      });
    }

    // Update address
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      updates,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update address.",
    });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    // Validate parameters
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User ID and address ID are required.",
      });
    }

    // Delete address
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting address:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete address.",
    });
  }
};

module.exports = {
  addAddress,
  fetchAllAddresses,
  editAddress,
  deleteAddress,
};
