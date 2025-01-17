import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../store/auth";
import { Form, Button, Container, Alert } from "react-bootstrap";

const AuthLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap(); // Assuming loginUser is a Redux thunk
      setAlertMessage({ type: "success", text: "Login successful! Redirecting..." });
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (error) {
      setAlertMessage({ type: "danger", text: error.message || "Login failed. Please try again." });
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Login</h1>
      {alertMessage.text && (
        <Alert variant={alertMessage.type} className="text-center">
          {alertMessage.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>

      <div className="text-center mt-4">
        <p>
          Forgot Password?{" "}
          <Link to="/auth/forgot-password" className="text-primary">
            Click here
          </Link>
        </p>
        <p>
          Don't have an account?{" "}
          <Link to="/auth/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default AuthLogin;
