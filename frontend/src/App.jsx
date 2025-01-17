import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/auth";
import { Route, Routes } from "react-router-dom";
import CheckAuth from "./components/common/check-auth";
import AuthRegister from "./pages/auth/AuthRegister";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthLayout from "./components/auth/Layout";
import AdminOrders from "./pages/admin/Orders";
import AdminMenuItem from "./pages/admin/MenuItems";
import AdminLayout from "./components/admin/Layout";
import RestaurantLayout from "./components/restaurants/Layout";
import RestaurantHome from "./pages/restaurants/Home";
import RestaurantCart from "./pages/restaurants/Cart";
import Profile from "./pages/restaurants/Profile";
import RestaurantCheckout from "./pages/restaurants/Checkout";
import RestaurantOrders from "./pages/restaurants/Orders";
import PasswordResetModule from "./pages/auth/ForgotPassword";

const App = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<PasswordResetModule/>} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
        
          <Route path="menuitems" element={<AdminMenuItem />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
        <Route
          path="/restaurants"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <RestaurantLayout />
            </CheckAuth>
          }
        >
           <Route path="home" element={<RestaurantHome />} />
          <Route path="cart" element={<RestaurantCart />} />
          <Route path="profile" element={<Profile />} />


          <Route path="checkout" element={<RestaurantCheckout />} />
          <Route path="orders" element={<RestaurantOrders />} />


         {/* <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} /> */}
        </Route>

        {/* <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </div>
  );
};

export default App;
