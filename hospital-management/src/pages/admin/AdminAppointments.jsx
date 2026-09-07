
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
  });

  const [editData, setEditData] = useState({
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    status: "scheduled",
  });

  // =========================================
  // LOAD DATA
  // =========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentsData, patientsData, usersData] =
        await Promise.all([
          api.get("/api/appointments"),
          api.get("/api/patients"),
          api.get("/api/users"),
        ]);

      const appointmentList = Array.isArray(appointmentsData)
        ? appointmentsData
        : appointmentsData?.appointments || [];

      const patientList = Array.isArray(patientsData)
        ? patientsData
        : patientsData?.patients || [];

      const allUsers = Array.isArray(usersData)
        ? usersData
        : usersData?.users || [];

      setAppointments(appointmentList);
      setPatients(patientList);

      setDoctors(
        allUsers.filter(
          (user) =>
            user.role === "doctor" &&
            user.is_active !== false
        )
      );
    } catch (err) {
      console.error(
        "Failed to load appointment data:",
        err
      );

      setError(
        err.message || "Failed to load appointment data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================================
  // CREATE FORM
  // =========================================

  const openCreateForm = () => {
    setError("");
    setSuccess("");

    setShowEditForm(false);
    setSelectedAppointment(null);

    setFormData({
      patient_id: "",
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
    });

    setShowCreateForm(true);
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);

    setFormData({
      patient_id: "",
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
    });
  };

  const handleCreateChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateAppointment = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.post("/api/appointments", {
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
      });

      setSuccess(
        "Appointment created successfully."
      );

      closeCreateForm();

      await loadData();
    } catch (err) {
      console.error(
        "Create appointment error:",
        err
      );

      setError(
        err.message ||
          "Failed to create appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // EDIT FORM
  // =========================================

  const openEditForm = (appointment) => {
    setError("");
    setSuccess("");

    // Close create form
    setShowCreateForm(false);

    // Store selected appointment
    setSelectedAppointment({
      ...appointment,
    });

    // Prepare edit values
    setEditData({
      doctor_id:
        appointment.doctor_id !== undefined &&
        appointment.doctor_id !== null
          ? String(appointment.doctor_id)
          : "",

      appointment_date:
        appointment.appointment_date
          ? String(
              appointment.appointment_date
            ).slice(0, 10)
          : "",

      appointment_time:
        appointment.appointment_time
          ? String(
              appointment.appointment_time
            ).slice(0, 5)
          : "",

      status:
        appointment.status || "scheduled",
    });

    // Show edit form
    setShowEditForm(true);

    // Wait until React renders the form,
    // then scroll to it.
    setTimeout(() => {
      const editForm =
        document.getElementById(
          "appointment-edit-form"
        );

      if (editForm) {
        editForm.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  const closeEditForm = () => {
    if (saving) {
      return;
    }

    setShowEditForm(false);
    setSelectedAppointment(null);

    setEditData({
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
      status: "scheduled",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdateAppointment = async (event) => {
    event.preventDefault();

    if (!selectedAppointment) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/api/appointments/${selectedAppointment.id}`,
        {
          doctor_id: Number(editData.doctor_id),
          appointment_date:
            editData.appointment_date,
          appointment_time:
            editData.appointment_time,
          status: editData.status,
        }
      );

      setSuccess(
        "Appointment updated successfully."
      );

      setShowEditForm(false);
      setSelectedAppointment(null);

      setEditData({
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        status: "scheduled",
      });

      await loadData();
    } catch (err) {
      console.error(
        "Update appointment error:",
        err
      );

      setError(
        err.message ||
          "Failed to update appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CANCEL APPOINTMENT
  // =========================================

  const handleCancelAppointment = async (
    appointmentId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/api/appointments/${appointmentId}`,
        {
          status: "cancelled",
        }
      );

      setSuccess(
        "Appointment cancelled successfully."
      );

      if (
        selectedAppointment?.id === appointmentId
      ) {
        setShowEditForm(false);
        setSelectedAppointment(null);
      }

      await loadData();
    } catch (err) {
      console.error(
        "Cancel appointment error:",
        err
      );

      setError(
        err.message ||
          "Failed to cancel appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // TABLE COLUMNS
  // =========================================

  const columns = [
    {
      key: "id",
      label: "ID",
    },

    {
      key: "patient_name",
      label: "Patient",
      render: (appointment) => (
        <strong>
          {appointment.patient_name || "Unknown"}
        </strong>
      ),
    },

    {
      key: "doctor_name",
      label: "Doctor",
      render: (appointment) =>
        appointment.doctor_name || "Unknown",
    },

    {
      key: "appointment_date",
      label: "Date",
      render: (appointment) =>
        appointment.appointment_date
          ? new Date(
              appointment.appointment_date
            ).toLocaleDateString()
          : "-",
    },

    {
      key: "appointment_time",
      label: "Time",
      render: (appointment) =>
        appointment.appointment_time
          ? String(
              appointment.appointment_time
            ).slice(0, 5)
          : "-",
    },

    {
      key: "status",
      label: "Status",
      render: (appointment) => (
        <span
          className={`status-badge status-${
            appointment.status || "scheduled"
          }`}
        >
          {appointment.status || "scheduled"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (appointment) => (
        <div className="table-actions">
          <button
            type="button"
            className="btn btn-small btn-warning"
            onClick={() =>
              openEditForm(appointment)
            }
            disabled={saving}
          >
            Edit
          </button>

          {appointment.status === "scheduled" && (
            <button
              type="button"
              className="btn btn-small btn-danger"
              onClick={() =>
                handleCancelAppointment(
                  appointment.id
                )
              }
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  // =========================================
  // RENDER
  // =========================================

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* PAGE HEADER */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              APPOINTMENT MANAGEMENT
            </span>

            <h1>Appointments</h1>

            <p>
              Create, manage and monitor hospital
              appointments.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={openCreateForm}
            disabled={saving}
          >
            + Create Appointment
          </button>
        </div>

        {/* ALERTS */}
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

        {/* =========================================
            CREATE FORM
        ========================================= */}

        {showCreateForm && (
          <div
            className="card appointment-form-card"
            style={{
              display: "block",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <h2>Create Appointment</h2>

            <form
              onSubmit={handleCreateAppointment}
            >
              <div className="appointment-form-group">
                <label htmlFor="patient_id">
                  Patient
                </label>

                <select
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleCreateChange}
                  required
                  disabled={saving}
                >
                  <option value="">
                    Select Patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="appointment-form-group">
                <label htmlFor="doctor_id">
                  Doctor
                </label>

                <select
                  id="doctor_id"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleCreateChange}
                  required
                  disabled={saving}
                >
                  <option value="">
                    Select Doctor
                  </option>

                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="appointment-form-row">
                <div className="appointment-form-group">
                  <label htmlFor="appointment_date">
                    Date
                  </label>

                  <input
                    id="appointment_date"
                    type="date"
                    name="appointment_date"
                    value={
                      formData.appointment_date
                    }
                    onChange={handleCreateChange}
                    required
                    disabled={saving}
                  />
                </div>

                <div className="appointment-form-group">
                  <label htmlFor="appointment_time">
                    Time
                  </label>

                  <input
                    id="appointment_time"
                    type="time"
                    name="appointment_time"
                    value={
                      formData.appointment_time
                    }
                    onChange={handleCreateChange}
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="appointment-form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Creating..."
                    : "Create Appointment"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCreateForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================
            EDIT FORM
        ========================================= */}

        {showEditForm &&
          selectedAppointment && (
            <div
              id="appointment-edit-form"
              className="card appointment-edit-card"
              style={{
                display: "block",
                width: "100%",
                boxSizing: "border-box",
                visibility: "visible",
                opacity: 1,
                position: "relative",
                zIndex: 10,
                marginBottom: "25px",
              }}
            >
              <div className="appointment-edit-header">
                <div>
                  <span className="dashboard-eyebrow">
                    APPOINTMENT MANAGEMENT
                  </span>

                  <h2>Edit Appointment</h2>

                  <p>
                    Appointment #
                    {selectedAppointment.id}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditForm}
                  disabled={saving}
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={
                  handleUpdateAppointment
                }
              >
                {/* PATIENT */}
                <div className="appointment-form-group">
                  <label htmlFor="edit_patient">
                    Patient
                  </label>

                  <input
                    id="edit_patient"
                    type="text"
                    value={
                      selectedAppointment.patient_name ||
                      `Patient ID ${selectedAppointment.patient_id}`
                    }
                    disabled
                    readOnly
                  />
                </div>

                {/* DOCTOR */}
                <div className="appointment-form-group">
                  <label htmlFor="edit_doctor_id">
                    Doctor
                  </label>

                  <select
                    id="edit_doctor_id"
                    name="doctor_id"
                    value={editData.doctor_id}
                    onChange={handleEditChange}
                    required
                    disabled={saving}
                  >
                    <option value="">
                      Select Doctor
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DATE + TIME */}
                <div className="appointment-form-row">
                  <div className="appointment-form-group">
                    <label htmlFor="edit_appointment_date">
                      Date
                    </label>

                    <input
                      id="edit_appointment_date"
                      type="date"
                      name="appointment_date"
                      value={
                        editData.appointment_date
                      }
                      onChange={handleEditChange}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="appointment-form-group">
                    <label htmlFor="edit_appointment_time">
                      Time
                    </label>

                    <input
                      id="edit_appointment_time"
                      type="time"
                      name="appointment_time"
                      value={
                        editData.appointment_time
                      }
                      onChange={handleEditChange}
                      required
                      disabled={saving}
                    />
                  </div>
                </div>

                {/* STATUS */}
                <div className="appointment-form-group">
                  <label htmlFor="edit_status">
                    Status
                  </label>

                  <select
                    id="edit_status"
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                    required
                    disabled={saving}
                  >
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

                {/* ACTIONS */}
                <div className="appointment-form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        {/* =========================================
            APPOINTMENT TABLE
        ========================================= */}

        <div className="card">
          <div className="dashboard-section-header">
            <div>
              <h2>All Appointments</h2>

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

export default AdminAppointments;
