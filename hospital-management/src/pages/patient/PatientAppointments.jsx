
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setError("");

        const data = await api.get("/api/appointments/me");

        const appointmentData = Array.isArray(data)
          ? data
          : data.appointments || [];

        setAppointments(appointmentData);
      } catch (err) {
        setError(err.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const totalAppointments = appointments.length;

  const scheduledAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "scheduled"
      ).length,
    [appointments]
  );

  const completedAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "completed"
      ).length,
    [appointments]
  );

  const cancelledAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "cancelled"
      ).length,
    [appointments]
  );

  const columns = [
    {
      key: "appointment_date",
      label: "Date",
      render: (appointment) => {
        if (!appointment.appointment_date) return "-";

        return new Date(
          appointment.appointment_date
        ).toLocaleDateString();
      },
    },
    {
      key: "appointment_time",
      label: "Time",
    },
    {
      key: "doctor_name",
      label: "Doctor",
      render: (appointment) => appointment.doctor_name || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) => (
        <span className={`status-badge status-${appointment.status}`}>
          {appointment.status}
        </span>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <div>
            <p className="dashboard-eyebrow">PATIENT PORTAL</p>
            <h1>My Appointments</h1>
            <p>View and track all your healthcare appointments.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <DashboardCard
            title="Total Appointments"
            value={totalAppointments}
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
            description="Completed visits"
            icon="✓"
          />

          <DashboardCard
            title="Cancelled"
            value={cancelledAppointments}
            description="Cancelled appointments"
            icon="×"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="dashboard-section-header">
            <div>
              <h2>Appointment History</h2>
              <p>Your scheduled and previous appointments.</p>
            </div>

            <span className="section-count">
              {totalAppointments} appointment
              {totalAppointments !== 1 ? "s" : ""}
            </span>
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

export default PatientAppointments;
