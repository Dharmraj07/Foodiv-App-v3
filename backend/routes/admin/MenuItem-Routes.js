const express = require("express");
const multer = require("multer");
const {
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
  fetchAllMenuItems,
} = require("../../controllers/admin/MenuItem-Controller");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Route to fetch all menu items
router.get("/get", fetchAllMenuItems);

// Route to add a new menu item with an image
router.post("/add", upload.single("image"), addMenuItem);

// Route to edit an existing menu item by ID
router.put("/edit/:id", editMenuItem);

// Route to delete a menu item by ID
router.delete("/delete/:id", deleteMenuItem);

module.exports = router;
