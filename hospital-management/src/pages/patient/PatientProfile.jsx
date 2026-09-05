
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";

const PatientProfile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <p className="dashboard-eyebrow">PATIENT PORTAL</p>
            <h1>My Profile</h1>
            <p>View and manage your personal account information.</p>
          </div>
        </div>

        <div className="profile-summary">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div>
            <h2>{user?.name || "Patient"}</h2>
            <p>{user?.email || "No email available"}</p>
            <span className="status-badge status-completed">
              {user?.role || "patient"}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="dashboard-section-header">
            <div>
              <h2>Personal Information</h2>
              <p>Your registered account details.</p>
            </div>
          </div>

          <div className="profile-details">
            <div>
              <span className="info-label">Full Name</span>
              <strong>{user?.name || "-"}</strong>
            </div>

            <div>
              <span className="info-label">Email Address</span>
              <strong>{user?.email || "-"}</strong>
            </div>

            <div>
              <span className="info-label">Account Role</span>
              <strong>{user?.role || "-"}</strong>
            </div>

            <div>
              <span className="info-label">User ID</span>
              <strong>{user?.id || "-"}</strong>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
