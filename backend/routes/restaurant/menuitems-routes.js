const express = require("express");

const {
  getFilteredMenuItems,
  getMenuItemsDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredMenuItems);
router.get("/get/:id", getMenuItemsDetails);

module.exports = router;