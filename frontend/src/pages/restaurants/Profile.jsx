import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import { addAddress, deleteAddress, fetchAddresses, editAddress } from '../../store/address';
import { changePassword, editUserProfile } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addresses } = useSelector((state) => state.address);
  const { userName, email, id } = useSelector((state) => state.auth.user);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [addressForm, setAddressForm] = useState({ address: '', city: '', pincode: '', phone: '', notes: '' });
  const [editingAddress, setEditingAddress] = useState(null);
  const [editedUserProfile, setEditedUserProfile] = useState({ userName: '', email: '' });

  useEffect(() => {
    dispatch(fetchAddresses(id)); // Fetch addresses when the profile is loaded
  }, [dispatch, id]);

  // Handle adding new address
  const handleAddAddress = () => {
    dispatch(addAddress({ userId: id, ...addressForm }));
    setShowAddressModal(false); // Close modal after adding
    setAddressForm({ address: '', city: '', pincode: '', phone: '', notes: '' }); // Reset form
  };

  // Handle editing an address
  const handleEditAddress = () => {
    if (editingAddress) {
      dispatch(editAddress({ addressId: editingAddress._id, updatedAddress: addressForm }));
      setShowAddressModal(false); // Close modal after editing
      setAddressForm({ address: '', city: '', pincode: '', phone: '', notes: '' }); // Reset form
    }
  };

  // Handle password change
  const handlePasswordChange = () => {
    dispatch(changePassword({ userId: id, oldPassword, newPassword }));
    setShowPasswordModal(false); // Close modal after changing password
  };

  // Handle updating profile
  const handleProfileUpdate = () => {
    dispatch(editUserProfile({ userId: id, ...editedUserProfile }));
    setShowEditProfileModal(false); // Close modal after updating profile
  };

  return (
    <Container className="my-4">
      {/* Profile Section */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{userName}'s Profile</Card.Title>
          <Card.Text>Email: {email}</Card.Text>
          <Button variant="primary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
          <Button variant="secondary" className="ms-2" onClick={() => setShowEditProfileModal(true)}>Edit Profile</Button>
        </Card.Body>
      </Card>

      {/* Address Section */}
      <Card>
        <Card.Body>
          <Card.Title>Addresses</Card.Title>
          {addresses.length > 0 ? (
            <ListGroup variant="flush">
              {addresses.map((address) => (
                <ListGroup.Item key={address._id} className="d-flex justify-content-between">
                  <div>
                    <h5>{address.address}</h5>
                    <p>{address.city}, {address.pincode}</p>
                    <p>{address.phone}</p>
                    <p>{address.notes}</p>
                  </div>
                  <div>
                    <Button
                      variant="warning"
                      onClick={() => {
                        setEditingAddress(address);
                        setAddressForm({
                          address: address.address,
                          city: address.city,
                          pincode: address.pincode,
                          phone: address.phone,
                          notes: address.notes,
                        });
                        setShowAddressModal(true); // Open modal for editing
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="ms-2"
                      onClick={() => dispatch(deleteAddress(address._id))}
                    >
                      Delete
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No addresses available. Please add one.</p>
          )}
          <Button variant="success" onClick={() => setShowAddressModal(true)}>
            Add Address
          </Button>
        </Card.Body>
      </Card>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePasswordChange}>
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                value={editedUserProfile.userName}
                onChange={(e) => setEditedUserProfile({ ...editedUserProfile, userName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editedUserProfile.email}
                onChange={(e) => setEditedUserProfile({ ...editedUserProfile, email: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditProfileModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleProfileUpdate}>
            Update Profile
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Address Form Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAddress ? 'Edit Address' : 'Add Address'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="pincode">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="notes">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                type="text"
                value={addressForm.notes}
                onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={editingAddress ? handleEditAddress : handleAddAddress}
          >
            {editingAddress ? 'Update Address' : 'Add Address'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
