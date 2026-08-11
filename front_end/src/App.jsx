import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Pages/Auth/LoginPage";
import MainLayout from "./components/MainLayout";
import SuperAdminDashboard from "./Pages/Dashboard/SuperAdminDashboard";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import EmployeeDashboard from "./Pages/Dashboard/EmployeeDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import ProfilePage from "./Pages/ProfilePage";
import UserList from "./Pages/Admin/EmployeeList";
import ChangePassword from "./Pages/Auth/ChangePassword";

const SESSION_DURATION = 199 * 60 * 60 * 1000;

const App = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const interval = setInterval(
      () => {
        const loginTime = localStorage.getItem("loginTime");

        if (!loginTime) return;

        const now = Date.now();
        const diff = now - Number(loginTime);

        if (diff >= SESSION_DURATION) {
          handleLogout();
        }
      },
      1 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRole="super_admin">
            <MainLayout userRole="super_admin">
              <SuperAdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout userRole="admin">
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/change-password"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout userRole="admin">
              <ChangePassword />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout userRole="admin">
              <UserList />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <MainLayout userRole="admin">
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="employee">
            <MainLayout userRole="employee">
              <EmployeeDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/change-password"
        element={
          <ProtectedRoute allowedRole="employee">
            <MainLayout userRole="employee">
              <ChangePassword />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRole="employee">
            <MainLayout userRole="employee">
              <ProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
