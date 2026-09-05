
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadUsers = async () => {
    try {
      setError("");

      const data = await api.get("/api/users");

      setUsers(
        Array.isArray(data)
          ? data
          : data?.users || []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusChange = async (user) => {
    const isActive = user.is_active;

    const action = isActive
      ? "deactivate"
      : "reactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);
      setError("");

      await api.put(
        `/api/users/${user.id}/${action}`
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.message ||
          `Failed to ${action} user.`
      );
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: "id",
      label: "User ID",
    },

    {
      key: "name",
      label: "Name",
      render: (user) => (
        <strong>{user.name}</strong>
      ),
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span className="status-badge">
          {user.role}
        </span>
      ),
    },

    {
      key: "is_active",
      label: "Status",
      render: (user) => (
        <span
          className={
            user.is_active
              ? "user-active-badge"
              : "user-inactive-badge"
          }
        >
          <span className="user-status-dot"></span>

          {user.is_active
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },

    {
      key: "created_at",
      label: "Created",
      render: (user) =>
        user.created_at
          ? new Date(
              user.created_at
            ).toLocaleDateString()
          : "-",
    },

    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="admin-user-actions">

          <button
            type="button"
            className="admin-edit-user-button"
            onClick={() =>
              navigate(
                `/admin/users/edit/${user.id}`
              )
            }
          >
            Edit
          </button>

          <button
            type="button"
            className={
              user.is_active
                ? "admin-deactivate-button"
                : "admin-reactivate-button"
            }
            onClick={() =>
              handleStatusChange(user)
            }
            disabled={actionLoading === user.id}
          >
            {actionLoading === user.id
              ? "..."
              : user.is_active
                ? "Deactivate"
                : "Reactivate"}
          </button>

        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header dashboard-welcome">

          <div className="admin-users-heading">

            <span className="dashboard-eyebrow">
              USER MANAGEMENT
            </span>

            <h1>Users</h1>

            <p>
              Manage hospital staff, patients, and
              administrator accounts.
            </p>

          </div>

          <button
            type="button"
            className="admin-add-user-button"
            onClick={() =>
              navigate("/admin/users/add")
            }
          >
            <span className="admin-add-user-icon">
              +
            </span>

            <span>
              Add User
            </span>
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="card">

          <div className="dashboard-section-header">

            <div>
              <h2>Registered Users</h2>

              <p>
                {loading
                  ? "Loading users..."
                  : `${users.length} registered user${
                      users.length !== 1
                        ? "s"
                        : ""
                    }`}
              </p>
            </div>

          </div>

          <DataTable
            columns={columns}
            data={users}
            loading={loading}
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
