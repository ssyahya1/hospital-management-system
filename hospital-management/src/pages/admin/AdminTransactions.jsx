
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [patientsLoading, setPatientsLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    patient_id: "",
    amount: "",
    transaction_type: "",
    status: "pending",
  });

  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // LOAD TRANSACTIONS
  // =========================

  const loadTransactions = async () => {
    try {
      setError("");

      const data = await api.get("/api/transactions");

      setTransactions(
        Array.isArray(data)
          ? data
          : data?.transactions || []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PATIENTS
  // =========================

  const loadPatients = async () => {
    try {
      setPatientsLoading(true);

      const data = await api.get("/api/patients");

      setPatients(
        Array.isArray(data)
          ? data
          : data?.patients || []
      );
    } catch (err) {
      setError(
        err.message || "Failed to load patients."
      );
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
    loadPatients();
  }, []);

  // =========================
  // HANDLE FORM INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE TRANSACTION
  // =========================

  const handleCreateTransaction = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setCreating(true);

      if (!formData.patient_id) {
        setError("Please select a patient.");
        return;
      }

      if (!formData.amount) {
        setError("Please enter an amount.");
        return;
      }

      if (!formData.transaction_type) {
        setError("Please enter a transaction type.");
        return;
      }

      await api.post("/api/transactions", {
        patient_id: Number(formData.patient_id),
        amount: Number(formData.amount),
        transaction_type: formData.transaction_type,
        status: "pending",
      });

      setSuccess("Transaction created successfully.");

      setFormData({
        patient_id: "",
        amount: "",
        transaction_type: "",
        status: "pending",
      });

      setShowCreateForm(false);

      await loadTransactions();
    } catch (err) {
      setError(
        err.message || "Failed to create transaction."
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================
  // UPDATE TRANSACTION
  // =========================

  const handleUpdateTransaction = async (
    transactionId,
    newStatus
  ) => {
    try {
      setError("");
      setSuccess("");
      setUpdatingId(transactionId);

      await api.patch(
        `/api/transactions/${transactionId}`,
        {
          status: newStatus,
        }
      );

      setSuccess("Transaction updated successfully.");

      await loadTransactions();
    } catch (err) {
      setError(
        err.message || "Failed to update transaction."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = [
    {
      key: "id",
      label: "Transaction ID",
    },

    {
      key: "patient_name",
      label: "Patient",
      render: (transaction) =>
        transaction.patient_name ||
        `Patient #${transaction.patient_id}`,
    },

    {
      key: "amount",
      label: "Amount",
      render: (transaction) => (
        <strong>
          {transaction.amount != null
            ? `$${Number(transaction.amount).toFixed(2)}`
            : "-"}
        </strong>
      ),
    },

    {
      key: "transaction_type",
      label: "Type",
      render: (transaction) =>
        transaction.transaction_type || "-",
    },

    {
      key: "transaction_date",
      label: "Date",
      render: (transaction) =>
        transaction.transaction_date
          ? new Date(
              transaction.transaction_date
            ).toLocaleDateString()
          : "-",
    },

    {
      key: "status",
      label: "Status",
      render: (transaction) => (
        <span
          className={`status-badge status-${transaction.status}`}
        >
          {transaction.status}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (transaction) => {
        if (transaction.status !== "pending") {
          return <span>-</span>;
        }

        if (updatingId === transaction.id) {
          return <span>Updating...</span>;
        }

        return (
          <div className="table-actions">
            <button
              type="button"
              className="btn btn-success"
              onClick={() =>
                handleUpdateTransaction(
                  transaction.id,
                  "completed"
                )
              }
            >
              Mark completed
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                handleUpdateTransaction(
                  transaction.id,
                  "cancelled"
                )
              }
            >
              Cancel
            </button>
          </div>
        );
      },
    },
  ];

  // =========================
  // UI
  // =========================

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* PAGE HEADER */}
        <div className="page-header dashboard-welcome">

          <div>
            <span className="dashboard-eyebrow">
              TRANSACTION MANAGEMENT
            </span>

            <h1>Transactions</h1>

            <p>
              Create, monitor, and update hospital
              payment transactions.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setShowCreateForm(
                (previous) => !previous
              );
              setError("");
              setSuccess("");
            }}
          >
            {showCreateForm
              ? "Close Form"
              : "+ Create Transaction"}
          </button>

        </div>

        {/* SUCCESS */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* CREATE FORM */}
        {showCreateForm && (
          <div className="card">

            <div className="dashboard-section-header">
              <div>
                <h2>Create Transaction</h2>

                <p>
                  Create a new transaction for a
                  patient.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCreateTransaction}
              className="form-grid"
            >

              {/* PATIENT */}
              <div className="form-group">
                <label htmlFor="patient_id">
                  Patient
                </label>

                <select
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  disabled={patientsLoading || creating}
                  required
                >
                  <option value="">
                    {patientsLoading
                      ? "Loading patients..."
                      : "Select patient"}
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.name ||
                        patient.patient_name ||
                        `Patient #${patient.id}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* AMOUNT */}
              <div className="form-group">
                <label htmlFor="amount">
                  Amount
                </label>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  disabled={creating}
                  required
                />
              </div>

              {/* TRANSACTION TYPE */}
              <div className="form-group">
                <label htmlFor="transaction_type">
                  Transaction Type
                </label>

                <input
                  id="transaction_type"
                  name="transaction_type"
                  type="text"
                  value={
                    formData.transaction_type
                  }
                  onChange={handleChange}
                  placeholder="e.g. consultation, medicine, test"
                  disabled={creating}
                  required
                />
              </div>

              {/* STATUS */}
              <div className="form-group">
                <label>
                  Initial Status
                </label>

                <input
                  type="text"
                  value="pending"
                  disabled
                />
              </div>

              {/* SUBMIT */}
              <div className="form-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating
                    ? "Creating..."
                    : "Create Transaction"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowCreateForm(false)
                  }
                  disabled={creating}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* TRANSACTIONS TABLE */}
        <div className="card">

          <div className="dashboard-section-header">

            <div>
              <h2>Hospital Transactions</h2>

              <p>
                {loading
                  ? "Loading transactions..."
                  : `${transactions.length} transaction${
                      transactions.length !== 1
                        ? "s"
                        : ""
                    }`}
              </p>
            </div>

          </div>

          <DataTable
            columns={columns}
            data={transactions}
            loading={loading}
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminTransactions;
