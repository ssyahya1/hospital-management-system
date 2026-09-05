
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DoctorDashboard = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const data = await api.get("/api/appointments");

        setAppointments(data.appointments);
      } catch (err) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "scheduled"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">DOCTOR PORTAL</span>

            <h1>
              Welcome back, Dr. {user?.name} 👋
            </h1>

            <p>
              Here's an overview of your appointment activity.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Dashboard */}
        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-grid">

              <DashboardCard
                title="Total Appointments"
                value={appointments.length}
                description="All your appointments"
                icon="▣"
              />

              <DashboardCard
                title="Scheduled"
                value={scheduledAppointments}
                description="Upcoming appointments"
                icon="◷"
              />

              <DashboardCard
                title="Completed"
                value={completedAppointments}
                description="Completed appointments"
                icon="✓"
              />

              <DashboardCard
                title="Cancelled"
                value={cancelledAppointments}
                description="Cancelled appointments"
                icon="×"
              />

            </div>

            {/* Overview */}
            <div className="dashboard-info-section">

              <div className="dashboard-section-header">
                <div>
                  <h2>Appointment Overview</h2>
                  <p>Your current appointment statistics</p>
                </div>
              </div>

              <div className="dashboard-info-grid">

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Total
                  </span>

                  <strong>
                    {appointments.length}
                  </strong>

                  <span className="info-description">
                    All appointments
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Scheduled
                  </span>

                  <strong>
                    {scheduledAppointments}
                  </strong>

                  <span className="info-description">
                    Upcoming visits
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Completed
                  </span>

                  <strong>
                    {completedAppointments}
                  </strong>

                  <span className="info-description">
                    Completed visits
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Cancelled
                  </span>

                  <strong>
                    {cancelledAppointments}
                  </strong>

                  <span className="info-description">
                    Cancelled visits
                  </span>
                </div>

              </div>
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;