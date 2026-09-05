
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const [appointmentsData, transactionsData] = await Promise.all([
          api.get("/api/appointments/me"),
          api.get("/api/transactions/me"),
        ]);

        setAppointments(appointmentsData.appointments);
        setTransactions(transactionsData.transactions);
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

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending"
  ).length;

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">PATIENT PORTAL</span>

            <h1>Welcome back, {user?.name} 👋</h1>

            <p>
              Here's an overview of your healthcare activity.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Statistics */}
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
                description="Successfully completed"
                icon="✓"
              />

              <DashboardCard
                title="Pending Transactions"
                value={pendingTransactions}
                description="Awaiting completion"
                icon="¤"
              />

            </div>

            {/* Quick information */}
            <div className="dashboard-info-section">

              <div className="dashboard-section-header">
                <div>
                  <h2>Quick Overview</h2>
                  <p>Your current healthcare status</p>
                </div>
              </div>

              <div className="dashboard-info-grid">

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Appointments
                  </span>

                  <strong>
                    {appointments.length}
                  </strong>

                  <span className="info-description">
                    Total appointments
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Upcoming
                  </span>

                  <strong>
                    {scheduledAppointments}
                  </strong>

                  <span className="info-description">
                    Scheduled appointments
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
                    Transactions
                  </span>

                  <strong>
                    {transactions.length}
                  </strong>

                  <span className="info-description">
                    Total transactions
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

export default PatientDashboard;
