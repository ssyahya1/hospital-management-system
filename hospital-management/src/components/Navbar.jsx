import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleName = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <div className="navbar-page-icon">+</div>

        <div className="navbar-title-group">
          <h2>Hospital Management System</h2>
          <span>Healthcare Management Portal</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="navbar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{roleName}</span>
          </div>
        </div>

        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;