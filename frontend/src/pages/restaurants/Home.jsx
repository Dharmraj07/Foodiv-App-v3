import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Row, Col, Container, Form, Pagination } from 'react-bootstrap';
import { fetchMenuItems } from '../../store/menuitem';
import { addToCart, fetchCartItems } from '../../store/restaurant/cart-slice';

const RestaurantHome = () => {
  const dispatch = useDispatch();

  // Accessing menu and cart state from Redux store
  const { menuItems } = useSelector((state) => state.menu);
  const { totalItems, totalPages, currentPage } = useSelector(
    (state) => state.menu.pagination
  );
  const { cart } = useSelector((state) => state.cart);
  const { id } = useSelector((state) => state.auth.user);

  // State for search, category, and sort
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(currentPage || 1);

  // Debounced search term state
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce effect for search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer); // Cleanup timeout on every render
  }, [search]);

  // Fetch menu items and cart on component mount or when filters change
  useEffect(() => {
    dispatch(fetchMenuItems({ search: debouncedSearch, category, sort, page }));
    dispatch(fetchCartItems(id));
  }, [dispatch, debouncedSearch, category, sort, id, page]);

  // Handle adding items to the cart
  const handleAddToCart = (item) => {
    dispatch(addToCart({ menuItemId: item._id, quantity: 1, userId: id }));
  };

  // Handle search change
  const handleSearchChange = (e) => setSearch(e.target.value);

  // Handle category filter change
  const handleCategoryChange = (e) => setCategory(e.target.value);

  // Handle sort order change
  const handleSortChange = (e) => setSort(e.target.value);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Menu</h2>

      {/* Filter Controls */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            as="select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="Desserts">Desserts</option>
            <option value="Main Courses">Main Course</option>
            <option value="Appetizers">Appetizers</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Control as="select" value={sort} onChange={handleSortChange}>
            <option value="">Sort by</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </Form.Control>
        </Col>
      </Row>

      {/* Menu Items */}
      <Row>
        {menuItems.map((item) => (
          <Col key={item._id} md={4} sm={6} className="mb-4">
            <Card className="shadow-sm rounded">
              <Card.Img
                variant="top"
                src={item.image}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-success fw-bold">
                      ${item.discountedPrice}
                    </span>
                    <span
                      className="text-muted ms-2"
                      style={{ textDecoration: 'line-through' }}
                    >
                      ${item.price}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => handleAddToCart(item)}
                    className="btn-sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
            />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === page}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(page < totalPages ? page + 1 : page)}
            />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default RestaurantHome;
