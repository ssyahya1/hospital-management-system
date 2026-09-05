import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();

  const patientLinks = [
    { name: "Dashboard", path: "/patient", icon: "▦" },
    { name: "Profile", path: "/patient/profile", icon: "◉" },
    { name: "My Appointments", path: "/patient/appointments", icon: "▣" },
    { name: "My Transactions", path: "/patient/transactions", icon: "▤" },
  ];

  const doctorLinks = [
    { name: "Dashboard", path: "/doctor", icon: "▦" },
    { name: "My Appointments", path: "/doctor/appointments", icon: "▣" },
    { name: "Create Appointment", path: "/doctor/appointments/create", icon: "+" },
    { name: "Patient Information", path: "/doctor/patients", icon: "◉" },
    { name: "Update Appointment", path: "/doctor/appointments/update", icon: "✎" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin", icon: "▦" },
    { name: "Users", path: "/admin/users", icon: "♙" },
    { name: "Patients", path: "/admin/patients", icon: "◉" },
    { name: "Appointments", path: "/admin/appointments", icon: "▣" },
    { name: "Transactions", path: "/admin/transactions", icon: "▤" },
  ];

  let links = [];

  if (role === "patient") {
    links = patientLinks;
  } else if (role === "doctor") {
    links = doctorLinks;
  } else if (role === "admin") {
    links = adminLinks;
  }

  const roleName = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "User";

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">+</div>

        <div>
          <h2>HMS</h2>
          <span>Healthcare System</span>
        </div>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">
          <strong>{user?.name || "User"}</strong>
          <span>{roleName}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === `/${role}`}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-link-icon">
              {link.icon}
            </span>

            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-line" />
        <span>Hospital Management System</span>
      </div>
    </aside>
  );
};

export default Sidebar;