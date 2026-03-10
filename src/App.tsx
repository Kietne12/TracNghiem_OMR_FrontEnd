import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import AuthProvider from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/auth/Login"
import DashboardLayout from "./layout/DashboardLayout"
import DashboardPage from "./pages/Dashboard"
import Unauthorized from "./pages/Unauthorized"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin only */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
          </Route>

          {/* Giảng viên */}
          <Route element={<PrivateRoute allowedRoles={["admin", "giangvien"]} />}>
            <Route
              path="/giangvien/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
          </Route>

          {/* Sinh viên */}
          <Route element={<PrivateRoute allowedRoles={["admin", "sinhvien"]} />}>
            <Route
              path="/sinhvien/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
          </Route>

          {/* Tất cả user đã login */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              }
            />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
