
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setError("");

        const [
          usersData,
          patientsData,
          appointmentsData,
          transactionsData,
        ] = await Promise.all([
          api.get("/api/users"),
          api.get("/api/patients"),
          api.get("/api/appointments"),
          api.get("/api/transactions"),
        ]);

        if (isMounted) {
          setUsers(
            Array.isArray(usersData)
              ? usersData
              : usersData?.users || []
          );

          setPatients(
            Array.isArray(patientsData)
              ? patientsData
              : patientsData?.patients || []
          );

          setAppointments(
            Array.isArray(appointmentsData)
              ? appointmentsData
              : appointmentsData?.appointments || []
          );

          setTransactions(
            Array.isArray(transactionsData)
              ? transactionsData
              : transactionsData?.transactions || []
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load admin dashboard."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const scheduledAppointments = useMemo(
    () =>
      appointments.filter(
        (item) => item.status === "scheduled"
      ).length,
    [appointments]
  );

  const completedTransactions = useMemo(
    () =>
      transactions.filter(
        (item) => item.status === "completed"
      ).length,
    [transactions]
  );

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Welcome Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              ADMINISTRATION PORTAL
            </span>

            <h1>Hospital Management Overview 👋</h1>

            <p>
              Monitor users, patients, appointments, and
              transactions across the hospital system.
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
            <p>Loading system overview...</p>
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
            <div className="dashboard-grid">

              <DashboardCard
                title="Total Users"
                value={users.length}
                description="Registered users"
                icon="♙"
              />

              <DashboardCard
                title="Patients"
                value={patients.length}
                description="Registered patients"
                icon="♙"
              />

              <DashboardCard
                title="Scheduled Appointments"
                value={scheduledAppointments}
                description="Upcoming appointments"
                icon="◷"
              />

              <DashboardCard
                title="Completed Transactions"
                value={completedTransactions}
                description="Successfully completed"
                icon="✓"
              />

            </div>

            {/* System Overview */}
            <div className="dashboard-info-section">

              <div className="dashboard-section-header">
                <div>
                  <h2>System Overview</h2>
                  <p>
                    Current statistics across the hospital
                    management system.
                  </p>
                </div>
              </div>

              <div className="dashboard-info-grid">

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Total Users
                  </span>

                  <strong>{users.length}</strong>

                  <span className="info-description">
                    All registered users
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Patients
                  </span>

                  <strong>{patients.length}</strong>

                  <span className="info-description">
                    Registered patients
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Appointments
                  </span>

                  <strong>{appointments.length}</strong>

                  <span className="info-description">
                    Total appointments
                  </span>
                </div>

                <div className="dashboard-info-item">
                  <span className="info-label">
                    Transactions
                  </span>

                  <strong>{transactions.length}</strong>

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

export default AdminDashboard;
