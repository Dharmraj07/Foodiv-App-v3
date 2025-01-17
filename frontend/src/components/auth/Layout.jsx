import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

function AuthLayout() {
  return (
    <Container fluid className="min-vh-100 d-flex p-0">
      <Row className="flex-grow-1 w-100">
        {/* Left section */}
        <Col 
          lg={6} 
          className="d-none d-lg-flex align-items-center justify-content-center bg-dark text-light px-4"
        >
          <div className="text-center">
            <h1 className="display-4 fw-bold">
              Welcome to ECommerce Shopping
            </h1>
          </div>
        </Col>
        {/* Right section */}
        <Col 
          xs={12} 
          lg={6} 
          className="d-flex align-items-center justify-content-center bg-light px-4 py-5"
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default AuthLayout;
