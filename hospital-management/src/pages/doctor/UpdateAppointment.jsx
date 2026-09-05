
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const UpdateAppointment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    appointment_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "",
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
      const body = {};

      if (formData.appointment_date) {
        body.appointment_date = formData.appointment_date;
      }

      if (formData.appointment_time) {
        body.appointment_time = formData.appointment_time;
      }

      if (formData.status) {
        body.status = formData.status;
      }

      await api.patch(
        `/api/appointments/${formData.appointment_id}`,
        body
      );

      setSuccess("Appointment updated successfully.");

    } catch (err) {
      setError(
        err.message || "Failed to update appointment."
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

            <h1>Update Appointment</h1>

            <p>
              Modify the date, time, or status of an
              existing appointment.
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

        {/* Update Form */}
        <div className="card form-card">

          <div className="dashboard-section-header">
            <div>
              <h2>Appointment Details</h2>

              <p>
                Enter an appointment ID and update the
                information you want to change.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Appointment ID */}
            <div className="form-group">
              <label htmlFor="appointment_id">
                Appointment ID
              </label>

              <input
                id="appointment_id"
                type="number"
                name="appointment_id"
                placeholder="Enter appointment ID"
                value={formData.appointment_id}
                onChange={handleChange}
                min="1"
                required
              />

              <small>
                Enter the ID of the appointment you want
                to update.
              </small>
            </div>

            {/* Date & Time */}
            <div className="form-row">

              <div className="form-group">
                <label htmlFor="appointment_date">
                  New Date
                </label>

                <input
                  id="appointment_date"
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointment_time">
                  New Time
                </label>

                <input
                  id="appointment_time"
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Status */}
            <div className="form-group">
              <label htmlFor="status">
                Appointment Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">
                  Keep current status
                </option>

                <option value="scheduled">
                  Scheduled
                </option>

                <option value="completed">
                  Completed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Updating Appointment..."
                  : "Update Appointment"}
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

export default UpdateAppointment;