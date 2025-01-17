import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword, resetPassword } from '../../store/auth';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const PasswordResetModule = () => {
  const dispatch = useDispatch();
  const [step, setStep] = useState('forgot'); // 'forgot' or 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleForgotSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      setSuccess(false);
      return;
    }

    dispatch(forgotPassword({ email }))
      .then(() => {
        setSuccess(true);
        setError('');
        setStep('reset');
      })
      .catch(() => {
        setError('Failed to send reset link. Please try again.');
        setSuccess(false);
      });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();

    if (!email || !otp || !newPassword) {
      setError('All fields are required');
      setSuccess(false);
      return;
    }

    dispatch(resetPassword({ email, otp, newPassword }))
      .then(() => {
        setSuccess(true);
        setError('');
        setEmail('');
        setOtp('');
        setNewPassword('');
      })
      .catch(() => {
        setError('Failed to reset password. Please try again.');
        setSuccess(false);
      });
  };

  return (
    <Container className="mt-5">
      {step === 'forgot' && (
        <>
          <h2 className="text-center mb-4">Forgot Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Password reset link sent successfully! Please check your email.
            </Alert>
          )}
          <Form onSubmit={handleForgotSubmit} className="p-4 border rounded shadow">
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send Reset Link
            </Button>
          </Form>
        </>
      )}

      {step === 'reset' && (
        <>
          <h2 className="text-center mb-4">Reset Password</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">
              Password has been reset successfully! You can now log in.
            </Alert>
          )}
          <Form onSubmit={handleResetSubmit} className="p-4 border rounded shadow">
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formOtp" className="mb-3">
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewPassword" className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Reset Password
            </Button>
          </Form>
        </>
      )}
    </Container>
  );
};

export default PasswordResetModule;
