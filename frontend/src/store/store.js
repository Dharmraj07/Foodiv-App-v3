import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import menuItemReducer from './menuitem';
import cartReducer from "./restaurant/cart-slice"
import addressReducer from "./address";
import orderReducer from "./order"
import adminOrderReducer from "./adminorder";

const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuItemReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    adminOrder: adminOrderReducer,
  },
});

export default store;
