import React from "react";
import { Navbar, Container, Nav, Badge, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/auth";
import { Outlet, useNavigate } from "react-router-dom";

const RestaurantLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalCartItems } = useSelector((state) => state.cart);
  const userName = useSelector((state) => state.auth.user?.userName);

  // Handlers
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand onClick={() => handleNavigate("/restaurants/home")}>Restaurant</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => handleNavigate("/restaurants/home")}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavigate("/restaurants/cart")}>Cart <Badge bg="secondary">{totalCartItems || 0}</Badge></Nav.Link>
              <Nav.Link onClick={() => handleNavigate("/restaurants/orders")}>Orders</Nav.Link>
            </Nav>

            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="profile-dropdown">
                {userName || "User"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleNavigate("/restaurants/profile")}>My Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Outlet />
      </Container>
    </div>
  );
};

export default RestaurantLayout;
