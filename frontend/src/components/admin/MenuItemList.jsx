import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenuItems, deleteMenuItem, editMenuItem } from '../../store/menuitem';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import EditMenuForm from './EditMenuForm'; // Import the EditForm component

const MenuItemList = () => {
  const dispatch = useDispatch();
  const { menuItems } = useSelector((state) => state.menu);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null); // For storing the selected menu item for editing

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      dispatch(deleteMenuItem(id));
    }
  };

  const handleEdit = (item) => {
    setSelectedMenuItem(item); // Set selected menu item to be edited
    setShowEditForm(true); // Show the edit form modal
  };

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Menu Items</h1>
      <Row>
        {menuItems.map((item) => (
          <Col key={item._id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.image} alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {item.name}
                  {item.discountedPrice && <Badge bg="success">On Sale</Badge>}
                </Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {item.description}
                </Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {item.category}
                </Card.Text>
                <Card.Text>
                  <strong>Cuisine:</strong> {item.cuisine}
                </Card.Text>
                <Card.Text>
                  <strong>Price:</strong> ${item.price}{' '}
                  {item.discountedPrice && (
                    <span className="text-success">
                      (Discounted: ${item.discountedPrice})
                    </span>
                  )}
                </Card.Text>
                <Card.Text>
                  <strong>Stock:</strong> {item.availableStock}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(item._id)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Menu Form Modal */}
      <EditMenuForm
        show={showEditForm}
        onClose={() => setShowEditForm(false)}
        menuItem={selectedMenuItem} // Pass selected menu item to the form
      />
    </Container>
  );
};

export default MenuItemList;
