import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth";
import './AdminLayout.css'; // Import custom CSS file for styles

function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logoutUser());
    // Add additional logout logic if needed
  };

  const adminSidebarMenuItems = [
    
    { id: "menuitems", label: "Menuitems", path: "/admin/menuitems" },
    { id: "orders", label: "Orders", path: "/admin/orders" },
  ];

  return (
    <div className="admin-layout">
      {/* Navbar */}
      <header className="navbar">
        <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
          ☰
        </button>
        <h1 className="brand">Admin Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Row Layout */}
      <div className="main-row">
        {/* Sidebar */}
        <aside className={`sidebar ${showSidebar ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2 className="brand">Admin</h2>
          </div>
          <ul>
            {adminSidebarMenuItems.map((item) => (
              <li key={item.id}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? "active" : ""}
                  onClick={() => setShowSidebar(false)} // Close sidebar after navigation
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
