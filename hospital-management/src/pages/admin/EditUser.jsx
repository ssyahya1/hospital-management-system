
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "patient",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setError("");

        const data = await api.get("/api/users");

        const users = Array.isArray(data)
          ? data
          : data?.users || [];

        const user = users.find(
          (item) => String(item.id) === String(id)
        );

        if (!user) {
          setError("User not found.");
          return;
        }

        setFormData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "patient",
        });
      } catch (err) {
        setError(
          err.message || "Failed to load user."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setSaving(true);

    try {
      const data = await api.put(
        `/api/users/${id}`,
        formData
      );

      setMessage(
        data?.message || "User updated successfully."
      );
    } catch (err) {
      setError(
        err.message || "Failed to update user."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-container">
          <div className="admin-form-loading">
            <div className="admin-loading-spinner"></div>
            <p>Loading user information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Header */}
        <div className="page-header admin-form-header">

          <div>
            <span className="dashboard-eyebrow">
              USER MANAGEMENT
            </span>

            <h1>Edit User</h1>

            <p>
              Update the account information and role
              for this hospital user.
            </p>
          </div>

          <button
            type="button"
            className="admin-back-button"
            onClick={() => navigate("/admin/users")}
          >
            <span>←</span>
            Back to Users
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error admin-form-alert">
            {error}
          </div>
        )}

        {/* Form */}
        {!error && (
          <div className="admin-form-card">

            <div className="admin-form-card-header">
              <div className="admin-form-icon">
                ✎
              </div>

              <div>
                <h2>Account Information</h2>
                <p>
                  Make changes to the user's account below.
                </p>
              </div>
            </div>

            <form
              className="admin-user-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}
              <div className="admin-form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  autoComplete="name"
                  required
                />
              </div>

              {/* Email */}
              <div className="admin-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Role */}
              <div className="admin-form-group">
                <label htmlFor="role">
                  User Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="patient">
                    Patient
                  </option>

                  <option value="doctor">
                    Doctor
                  </option>

                  <option value="admin">
                    Administrator
                  </option>
                </select>
              </div>

              {/* Messages */}
              {message && (
                <div className="admin-form-success">
                  <span>✓</span>
                  {message}
                </div>
              )}

              {error && (
                <div className="admin-form-error">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="admin-form-actions">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() =>
                    navigate("/admin/users")
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default EditUser;
