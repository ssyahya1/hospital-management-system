
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DataTable from "../../components/DataTable";
import api from "../../services/api";

const PatientInformation = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setError("");

        const data = await api.get("/api/patients");

        setPatients(data);
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

            <h1>Patient Information</h1>

            <p>
              View information about registered patients
              in the hospital system.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Patient Summary */}
        {!loading && !error && (
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-title">
                    Registered Patients
                  </p>

                  <h2 className="dashboard-card-value">
                    {patients.length}
                  </h2>
                </div>

                <div className="dashboard-card-icon">
                  ♙
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Patient Table */}
        <div className="card">

          <div className="dashboard-section-header">
            <div>
              <h2>Patient Records</h2>

              <p>
                {loading
                  ? "Loading patient records..."
                  : `${patients.length} registered patient${
                      patients.length !== 1
                        ? "s"
                        : ""
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

export default PatientInformation;