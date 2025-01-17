import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, fetchOrderDetails, updateOrderStatus } from "../../store/adminorder";
import { Modal, Button } from "react-bootstrap";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error, selectedOrder } = useSelector((state) => state.adminOrder);

  const [showModal, setShowModal] = useState(false);

  // Fetch all orders on component mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Handle order status update
  const handleStatusUpdate = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  // Handle fetching and displaying order details
  const handleOrderDetails = async (orderId) => {
    await dispatch(fetchOrderDetails(orderId));
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => setShowModal(false);

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Admin Orders</h2>
      {orders && orders.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Details</th>
              <th>City</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Payment Type</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleOrderDetails(order._id)}
                  >
                    Details
                  </button>
                </td>
                <td>{order.deliveryDetails?.city}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.menuItemId}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.paymentType}</td>
                <td>{order.paymentStatus}</td>
                <td>
                  {order.status === "pending" && (
                    <div>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleStatusUpdate(order._id, "delivered")}
                      >
                        Mark as Delivered
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleStatusUpdate(order._id, "canceled")}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                  {order.status === "delivered" && (
                    <span className="text-success">Delivered</span>
                  )}
                  {order.status === "canceled" && (
                    <span className="text-danger">Canceled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}

      {/* Modal for Order Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <div>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>City:</strong> {selectedOrder.deliveryDetails?.city}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Payment Type:</strong> {selectedOrder.paymentType}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {selectedOrder.items.map((item) => (
                  <li key={item.menuItemId}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", marginRight: "10px" }}
                    />
                    {item.name} (x{item.quantity}) - ${item.price}
                  </li>
                ))}
              </ul>
              <p><strong>Transaction ID:</strong> {selectedOrder.paymentDetails?.transactionId}</p>
            </div>
          ) : (
            <p>Loading order details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminOrders;
