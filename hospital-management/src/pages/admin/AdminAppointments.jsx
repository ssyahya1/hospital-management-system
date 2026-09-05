
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminAppointments = () => {
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
      key: "doctor_id",
      label: "Doctor ID",
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

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              APPOINTMENT MANAGEMENT
            </span>

            <h1>Appointments</h1>

            <p>
              Monitor all scheduled, completed, and
              cancelled appointments across the hospital.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Appointments Table */}
        <div className="card">

          <div className="dashboard-section-header">
            <div>
              <h2>Hospital Appointments</h2>

              <p>
                {loading
                  ? "Loading appointments..."
                  : `${appointments.length} appointment${
                      appointments.length !== 1 ? "s" : ""
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

export default AdminAppointments;