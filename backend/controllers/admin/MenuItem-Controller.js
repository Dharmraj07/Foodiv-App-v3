 const { cloudinary } = require("../../config/cloudinaryConfig");
const MenuItem = require("../../models/MenuItem");


const fetchAllMenuItems = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      cuisine, 
      sort, 
      page = 1, 
      limit = 6 
    } = req.query;

    const query = {};

    // Add search condition
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add cuisine filter
    if (cuisine) {
      query.cuisine = cuisine;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    const sortOrder = sort === "low-to-high" ? { price: 1 } : sort === "high-to-low" ? { price: -1 } : {};

    // Fetch filtered, sorted, and paginated data
    const listOfMenuItems = await MenuItem.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(Number(limit));

    // Total count for pagination
    const totalItems = await MenuItem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: listOfMenuItems,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};



// // Fetch all menu items
// const fetchAllMenuItems = async (req, res) => {
//   try {
//     const listOfMenuItems = await MenuItem.find({});
//     res.status(200).json({
//       success: true,
//       data: listOfMenuItems,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred",
//     });
//   }
// };


// Helper function to upload images to Cloudinary
const uploadImageToCloudinary = async (filePath) => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(filePath);
    return secure_url;
  } catch (error) {
    throw new Error("Failed to upload image to Cloudinary");
  }
};

// Add a new menu item
const addMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      cuisine,
      price,
      discountedPrice,
      availableStock,
    } = req.body;

    const image = req.file ? await uploadImageToCloudinary(req.file.path) : null;

    const newMenuItem = new MenuItem({
      image,
      name,
      description,
      category,
      cuisine,
      price,
      discountedPrice,
      availableStock,
      
    });

    const savedMenuItem = await newMenuItem.save();

    res.status(201).json({
      success: true,
      data: savedMenuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the menu item",
    });
  }
};

// Edit a menu item
const editMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const {
      name,
      description,
      category,
      cuisine,
      price,
      discountedPrice,
      availableStock,
      
    } = req.body;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const image = req.file ? await uploadImageToCloudinary(req.file.path) : menuItem.image;

    menuItem.name = name ?? menuItem.name;
    menuItem.description = description ?? menuItem.description;
    menuItem.category = category ?? menuItem.category;
    menuItem.cuisine = cuisine ?? menuItem.cuisine;
    menuItem.price = price ?? menuItem.price;
    menuItem.discountedPrice = discountedPrice ?? menuItem.discountedPrice;
    menuItem.availableStock = availableStock ?? menuItem.availableStock;
    menuItem.image = image;

    const updatedMenuItem = await menuItem.save();

    res.status(200).json({
      success: true,
      data: updatedMenuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the menu item",
    });
  }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem)
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};



module.exports = {
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  fetchAllMenuItems,
};
