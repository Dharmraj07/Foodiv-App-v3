import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { fetchAddresses } from "../../store/address";
import { createOrder, capturePayment } from "../../store/order";

const RestaurantCheckout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, cartId } = useSelector((state) => state.cart);
  const { id: userId } = useSelector((state) => state.auth.user);
  const { addresses } = useSelector((state) => state.address);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentType, setPaymentType] = useState("cod");

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.menuItemId.discountedPrice * item.quantity,
    0
  );

  useEffect(() => {
    if (userId) dispatch(fetchAddresses(userId));
  }, [dispatch, userId]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    const orderPayload = {
      cartId,
      customerId: userId,
      cartItems: cart.map((item) => ({
        menuItemId: item.menuItemId._id,
        quantity: item.quantity,
      })),
      deliveryDetails: selectedAddress,
      paymentType,
    };

    try {
      const response = await dispatch(createOrder(orderPayload)).unwrap();
      console.log(response);
      const orderId=response.order._id;
      console.log(orderId);

      if (paymentType === "online") {
        const { razorpayOrderId } = response;
        // const orderId=response.orders;
        console.log(orderId);
        
        const options = {
          key: "rzp_test_G6C8R7xJPRwRxh",
          amount: totalPrice * 100,
          currency: "INR",
          name: "Restaurant Checkout",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: async (paymentResponse) => {
            const paymentPayload = {
              orderId,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            };
            await dispatch(capturePayment(paymentPayload)).unwrap();
            alert("Payment successful!");
            navigate("/restaurants/orders");
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        alert("Order placed successfully!");
        navigate("/restaurants/orders");
      }
    } catch (error) {
      console.error("Error placing the order:", error);
      alert("Failed to place the order.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Checkout</h2>

      {/* Cart Section */}
      <Row className="mb-4">
        <Col>
          <h3>Your Cart</h3>
          {cart.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price (₹)</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.menuItemId._id}>
                    <td>{item.menuItemId.name}</td>
                    <td>{item.menuItemId.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.menuItemId.discountedPrice.toFixed(2)}</td>
                    <td>
                      {(item.menuItemId.discountedPrice * item.quantity).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <h4>Total Price: ₹{totalPrice.toFixed(2)}</h4>
        </Col>
      </Row>

      {/* Address Section */}
      <Row className="mb-4">
        <Col>
          <h3>Delivery Address</h3>
          {addresses.length > 0 ? (
            <Form>
              {addresses.map((address) => (
                <Form.Check
                  type="radio"
                  id={`address-${address._id}`}
                  key={address._id}
                  name="deliveryAddress"
                  label={`${address.address}, ${address.city}, ${address.pincode} - Phone: ${address.phone}`}
                  onChange={() => setSelectedAddress(address)}
                />
              ))}
            </Form>
          ) : (
            <p>No addresses found. Please add one in your profile.</p>
          )}
        </Col>
      </Row>

      {/* Payment Section */}
      <Row className="mb-4">
        <Col>
          <h3>Payment Method</h3>
          <Form>
            <Form.Check
              type="radio"
              id="cod"
              name="paymentType"
              label="Cash on Delivery"
              checked={paymentType === "cod"}
              onChange={() => setPaymentType("cod")}
            />
            <Form.Check
              type="radio"
              id="online"
              name="paymentType"
              label="Online Payment"
              checked={paymentType === "online"}
              onChange={() => setPaymentType("online")}
            />
          </Form>
        </Col>
      </Row>

      {/* Place Order Button */}
      <Row>
        <Col className="text-end">
          <Button variant="primary" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantCheckout;
