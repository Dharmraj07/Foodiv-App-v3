import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersByUser } from '../../store/order';
import { Card, Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';

const RestaurantOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { id: userId } = useSelector((state) => state.auth.user);
  console.log(orders);

  useEffect(() => {
    dispatch(getAllOrdersByUser(userId));
  }, [dispatch, userId]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Orders</h2>
      {orders && orders.length > 0 ? (
        <Row>
          {orders.map((order) => (
            <Col key={order._id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    <strong>Order ID:</strong> {order._id}
                  </Card.Title>
                  <Card.Text>
                    <strong>Total Amount:</strong> ${order.totalAmount}
                  </Card.Text>
                  <Card.Text>
                    <strong>Status:</strong>{' '}
                    <Badge bg={order.status === 'Delivered' ? 'success' : 'warning'}>
                      {order.status}
                    </Badge>
                  </Card.Text>
                  <Card.Text>
                    <strong>Payment Type:</strong> {order.paymentType}
                  </Card.Text>
                  <Card.Text>
                    <strong>Payment Status:</strong>{' '}
                    <Badge bg={order.paymentStatus === 'Paid' ? 'success' : 'danger'}>
                      {order.paymentStatus}
                    </Badge>
                  </Card.Text>
                  <Card.Text>
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </Card.Text>
                  <strong>Ordered Items:</strong>
                  <ListGroup variant="flush" className="mt-3">
                    {order.items.map((item) => (
                      <ListGroup.Item key={item._id} className="d-flex align-items-center">
                        <div style={{ width: '50px', marginRight: '10px' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded"
                          />
                        </div>
                        <div>
                          <p className="mb-0">
                            {item.name} - ${item.price} x {item.quantity}
                          </p>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No orders found.</p>
      )}
    </Container>
  );
};

export default RestaurantOrders;
