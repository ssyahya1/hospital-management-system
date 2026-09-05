import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientTransactions from "./pages/patient/PatientTransactions";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import CreateAppointment from "./pages/doctor/CreateAppointment";
import UpdateAppointment from "./pages/doctor/UpdateAppointment";
import PatientInformation from "./pages/doctor/PatientInformation";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AddUser from "./pages/admin/AddUser";
import EditUser from "./pages/admin/EditUser";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/transactions"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientTransactions />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments/create"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <CreateAppointment />
              </ProtectedRoute>
            }
          />
           <Route
              path="/doctor/appointments/update"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <UpdateAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <PatientInformation />
                </ProtectedRoute>
              }
            />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          /><Route
              path="/admin/users/add"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AddUser />
                </ProtectedRoute>
              }
          /><Route
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />  
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminTransactions />
              </ProtectedRoute>
            }
          />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Unknown URL */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;