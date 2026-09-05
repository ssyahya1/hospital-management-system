
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import DashboardCard from "../../components/DashboardCard";
import api from "../../services/api";

const PatientTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setError("");

        const data = await api.get("/api/transactions/me");

        const transactionData = Array.isArray(data)
          ? data
          : data.transactions || [];

        setTransactions(transactionData);
      } catch (err) {
        setError(err.message || "Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const totalTransactions = transactions.length;

  const completedTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.status === "completed"
      ).length,
    [transactions]
  );

  const pendingTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.status === "pending"
      ).length,
    [transactions]
  );

  const totalAmount = useMemo(
    () =>
      transactions.reduce(
        (total, transaction) => total + Number(transaction.amount || 0),
        0
      ),
    [transactions]
  );

  const columns = [
    {
      key: "id",
      label: "Transaction ID",
    },
    {
      key: "amount",
      label: "Amount",
      render: (transaction) =>
        `$${Number(transaction.amount || 0).toFixed(2)}`,
    },
    {
      key: "transaction_date",
      label: "Date",
      render: (transaction) => {
        if (!transaction.transaction_date) return "-";

        return new Date(transaction.transaction_date).toLocaleDateString();
      },
    },
    {
      key: "status",
      label: "Status",
      render: (transaction) => (
        <span className={`status-badge status-${transaction.status}`}>
          {transaction.status}
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
            <h1>My Transactions</h1>
            <p>View and track your healthcare transaction history.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <DashboardCard
            title="Total Transactions"
            value={totalTransactions}
            description="All recorded transactions"
            icon="↔"
          />

          <DashboardCard
            title="Completed"
            value={completedTransactions}
            description="Successfully completed"
            icon="✓"
          />

          <DashboardCard
            title="Pending"
            value={pendingTransactions}
            description="Awaiting completion"
            icon="⏳"
          />

          <DashboardCard
            title="Total Amount"
            value={`$${totalAmount.toFixed(2)}`}
            description="Total transaction value"
            icon="$"
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <div className="dashboard-section-header">
            <div>
              <h2>Transaction History</h2>
              <p>Your recent healthcare transactions.</p>
            </div>

            <span className="section-count">
              {totalTransactions} transaction
              {totalTransactions !== 1 ? "s" : ""}
            </span>
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

export default PatientTransactions;
