
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    loadTransactions();
  }, []);

  const columns = [
    {
      key: "id",
      label: "Transaction ID",
    },
    {
      key: "patient_id",
      label: "Patient ID",
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
  ];

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              TRANSACTION MANAGEMENT
            </span>

            <h1>Transactions</h1>

            <p>
              Monitor payment transactions and their
              current status across the hospital system.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Transactions Table */}
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