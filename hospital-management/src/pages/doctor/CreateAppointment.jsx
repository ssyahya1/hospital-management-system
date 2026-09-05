
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const CreateAppointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/api/appointments", {
        patient_id: Number(formData.patient_id),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
      });

      setSuccess("Appointment created successfully.");

      setFormData({
        patient_id: "",
        appointment_date: "",
        appointment_time: "",
      });
    } catch (err) {
      setError(
        err.message || "Failed to create appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              APPOINTMENT MANAGEMENT
            </span>

            <h1>Create Appointment</h1>

            <p>
              Schedule a new appointment for a registered
              patient.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Appointment Form */}
        <div className="card form-card">

          <div className="dashboard-section-header">
            <div>
              <h2>Appointment Details</h2>

              <p>
                Enter the patient's information and
                preferred appointment schedule.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="patient_id">
                Patient ID
              </label>

              <input
                id="patient_id"
                type="number"
                name="patient_id"
                placeholder="Enter patient ID"
                value={formData.patient_id}
                onChange={handleChange}
                min="1"
                required
              />

              <small>
                Enter the ID of an existing registered patient.
              </small>
            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="appointment_date">
                  Appointment Date
                </label>

                <input
                  id="appointment_date"
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment_time">
                  Appointment Time
                </label>

                <input
                  id="appointment_time"
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Creating Appointment..."
                  : "Create Appointment"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  navigate("/doctor/appointments")
                }
                disabled={loading}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreateAppointment;

