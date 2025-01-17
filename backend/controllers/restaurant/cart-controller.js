const Cart = require("../../models/Cart");
const MenuItem = require("../../models/MenuItem");

// // Add an item to the cart
// const addToCart = async (req, res) => {
//   try {
//     const { userId, menuItemId, quantity } = req.body;

//     // Check if the item exists
//     const menuItem = await MenuItem.findById(menuItemId);
//     if (!menuItem) {
//       return res.status(404).json({ message: "Menu item not found" });
//     }

//     // Find the cart for the user
//     let cart = await Cart.findOne({ customerId: userId });

//     // If the cart doesn't exist, create a new one
//     if (!cart) {
//       cart = new Cart({ customerId: userId, items: [] });
//     }

//     // Check if the item already exists in the cart
//     const existingItem = cart.items.find(item => item.menuItemId.toString() === menuItemId);
//     if (existingItem) {
//       // Update the quantity if the item already exists in the cart
//       existingItem.quantity += quantity;
//     } else {
//       // Add the item to the cart if it's not already there
//       cart.items.push({ menuItemId, quantity });
//     }

//     // Save the cart
//     await cart.save();
//     res.status(200).json({ message: "Item added to cart", cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const addToCart = async (req, res) => {
  try {
    const { userId, menuItemId, quantity } = req.body;

    // Check if the item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ customerId: userId });

    // If the cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ customerId: userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(item => item.menuItemId.toString() === menuItemId);
    if (existingItem) {
      // Update the quantity if the item already exists in the cart
      existingItem.quantity += quantity;
    } else {
      // Add the item to the cart if it's not already there
      cart.items.push({ menuItemId, quantity });
    }

    // Save the cart
    await cart.save();

    // Refetch the updated cart with populated menuItem details
    const updatedCart = await Cart.findOne({ customerId: userId }).populate("items.menuItemId");

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch items in the user's cart
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ customerId: userId }).populate("items.menuItemId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// // Update the quantity of an item in the cart
// const updateCartItemQty = async (req, res) => {
//   try {
//     const { userId, menuItemId, quantity } = req.body;

//     // Ensure the quantity is valid
//     if (quantity < 1) {
//       return res.status(400).json({ message: "Quantity must be at least 1" });
//     }

//     const cart = await Cart.findOne({ customerId: userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Find the item in the cart and update the quantity
//     const item = cart.items.find(item => item.menuItemId.toString() === menuItemId);

//     if (!item) {
//       return res.status(404).json({ message: "Item not found in cart" });
//     }

//     item.quantity = quantity;
//     await cart.save();

//     res.status(200).json({ message: "Cart item updated", cart });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, menuItemId, quantity } = req.body;

    // Ensure the quantity is valid
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ customerId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the item in the cart and update the quantity
    const item = cart.items.find(item => item.menuItemId.toString() === menuItemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    // Refetch the updated cart with populated menuItem details
    const updatedCart = await Cart.findOne({ customerId: userId }).populate("items.menuItemId");

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ customerId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item from the cart
    const itemIndex = cart.items.findIndex(item => item.menuItemId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    // Refetch the updated cart with populated menuItem details
    const updatedCart = await Cart.findOne({ customerId: userId }).populate("items.menuItemId");

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
