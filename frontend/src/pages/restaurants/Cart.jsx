import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, fetchCartItems, updateCartItemQty } from "../../store/restaurant/cart-slice";
import {  useNavigate } from "react-router-dom";


const RestaurantCart = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, isLoading, error, totalPrice } = useSelector((state) => state.cart);
  const { id: userId } = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  const handleUpdateQty = (menuItemId, newQty) => {
    if (newQty > 0) {
      dispatch(updateCartItemQty({ userId, menuItemId, quantity: newQty }));
    }
  };

  const handleDeleteItem = (menuItemId) => {
    dispatch(deleteCartItem({ userId, menuItemId }));
  };

  const handlePlaceOrder = () => {
    navigate("/restaurants/checkout");
  };

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!cart?.length) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.map(({ menuItemId, quantity, _id }) => (
        <div key={_id} className="cart-item">
          <div className="cart-item-image">
            <img
              src={menuItemId.image || "https://via.placeholder.com/150"}
              alt={menuItemId.name || "Menu Item"}
              className="cart-item-img"
            />
          </div>
          <div className="cart-item-details">
            <h3>{menuItemId.name}</h3>
            <p>{menuItemId.description}</p>
            <p>
              Price: <strong>${menuItemId.discountedPrice.toFixed(2)}</strong>
            </p>
            <p>Quantity: {quantity}</p>
          </div>
          <div className="cart-item-actions">
            <button
              className="btn-update"
              onClick={() => handleUpdateQty(menuItemId._id, quantity + 1)}
            >
              +
            </button>
            <button
              className="btn-update"
              onClick={() => handleUpdateQty(menuItemId._id, quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <button
              className="btn-remove"
              onClick={() => handleDeleteItem(menuItemId._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      </div>
      <button className="btn btn-primary place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
    </div>
  );
};

export default RestaurantCart;
