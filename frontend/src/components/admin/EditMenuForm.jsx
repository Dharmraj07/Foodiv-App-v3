import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { editMenuItem } from '../../store/menuitem';

const EditMenuForm = ({ show, onClose, menuItem }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    image: menuItem?.image || '',
    name: menuItem?.name || '',
    description: menuItem?.description || '',
    category: menuItem?.category || '',
    cuisine: menuItem?.cuisine || '',
    price: menuItem?.price || '',
    discountedPrice: menuItem?.discountedPrice || '',
    availableStock: menuItem?.availableStock || '',
  });

  const categories = ['Appetizers', 'Main Courses', 'Desserts'];
  const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican'];

  useEffect(() => {
    if (menuItem) {
      setFormData({
        image: menuItem.image,
        name: menuItem.name,
        description: menuItem.description,
        category: menuItem.category,
        cuisine: menuItem.cuisine,
        price: menuItem.price,
        discountedPrice: menuItem.discountedPrice,
        availableStock: menuItem.availableStock,
      });
    }
  }, [menuItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editMenuItem({ id: menuItem._id, updatedData: formData }));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Menu Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="cuisine">
            <Form.Label>Cuisine</Form.Label>
            <Form.Control
              as="select"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a cuisine</option>
              {cuisines.map((cuisine, index) => (
                <option key={index} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="discountedPrice">
            <Form.Label>Discounted Price</Form.Label>
            <Form.Control
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="availableStock">
            <Form.Label>Available Stock</Form.Label>
            <Form.Control
              type="number"
              name="availableStock"
              value={formData.availableStock}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleFileChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Menu Item
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditMenuForm;
