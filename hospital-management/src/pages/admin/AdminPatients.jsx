
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setError("");

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
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const columns = [
    {
      key: "id",
      label: "Patient ID",
    },
    {
      key: "name",
      label: "Name",
      render: (patient) => (
        <strong>{patient.name}</strong>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">

        {/* Page Header */}
        <div className="page-header dashboard-welcome">
          <div>
            <span className="dashboard-eyebrow">
              PATIENT MANAGEMENT
            </span>

            <h1>Patients</h1>

            <p>
              View and monitor all registered patients
              in the hospital management system.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Patients Table */}
        <div className="card">

          <div className="dashboard-section-header">
            <div>
              <h2>Registered Patients</h2>

              <p>
                {loading
                  ? "Loading patients..."
                  : `${patients.length} registered patient${
                      patients.length !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={patients}
            loading={loading}
          />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPatients;