const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const authRoutes=require("./routes/auth/auth-routes");
const menuitemRoutes=require("./routes/admin/MenuItem-Routes");
const adminOrdersRoutes=require("./routes/admin/order.routes");

const cartRoutes=require("./routes/restaurant/cart-routes");
const orderRoutes=require("./routes/restaurant/order-routes");
const addressRoutes=require("./routes/restaurant/address-routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/admin/menuitem", menuitemRoutes);
app.use("/api/admin/orders", adminOrdersRoutes);

app.use("/api/restaurant/cart",cartRoutes);
app.use("/api/restaurant/orders",orderRoutes);
app.use("/api/restaurant/addresses",addressRoutes);





app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
