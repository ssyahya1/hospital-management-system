
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setError("");

        const data = await api.get("/api/appointments");

        setAppointments(
          Array.isArray(data)
            ? data
            : data?.appointments || []
        );
      } catch (err) {
        setError(
          err.message || "Failed to load appointments."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const columns = [
    {
      key: "id",
      label: "Appointment ID",
    },
    {
      key: "patient_id",
      label: "Patient ID",
    },
    {
      key: "appointment_date",
      label: "Date",
    },
    {
      key: "appointment_time",
      label: "Time",
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) => (
        <span
          className={`status-badge status-${appointment.status}`}
        >
          {appointment.status}
        </span>
      ),
    },
  ];

  const scheduledCount = appointments.filter(
    (appointment) => appointment.status === "scheduled"
  ).length;

  const completedCount = appointments.filter(
    (appointment) => appointment.status === "completed"
  ).length;

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              APPOINTMENT MANAGEMENT
            </span>

            <h1>My Appointments</h1>

            <p>
              View and manage your scheduled and
              completed patient appointments.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Appointment Summary */}
        {!loading && !error && (
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-title">
                    Total Appointments
                  </p>

                  <h2 className="dashboard-card-value">
                    {appointments.length}
                  </h2>
                </div>

                <div className="dashboard-card-icon">
                  ▣
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-title">
                    Scheduled
                  </p>

                  <h2 className="dashboard-card-value">
                    {scheduledCount}
                  </h2>
                </div>

                <div className="dashboard-card-icon">
                  ◷
                </div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-title">
                    Completed
                  </p>

                  <h2 className="dashboard-card-value">
                    {completedCount}
                  </h2>
                </div>

                <div className="dashboard-card-icon">
                  ✓
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Appointments Table */}
        <div className="card">

          <div className="dashboard-section-header">
            <div>
              <h2>Appointment Schedule</h2>

              <p>
                {loading
                  ? "Loading appointments..."
                  : `${appointments.length} appointment${
                      appointments.length !== 1
                        ? "s"
                        : ""
                    }`}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={appointments}
            loading={loading}
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;