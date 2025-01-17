import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import AddMenuForm from '../../components/admin/AddMenuForm';
import MenuItemList from '../../components/admin/MenuItemList';

const AdminMenuItem = () => {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <div className="admin-menu-item p-4">
      <h1 className="mb-4">Admin Menu Items</h1>
      <Button variant="primary" onClick={handleOpenForm}>
        Add Menu
      </Button>
      <AddMenuForm show={showForm} onClose={handleCloseForm} />
      <MenuItemList/> 
    </div>
  );
};

export default AdminMenuItem;
