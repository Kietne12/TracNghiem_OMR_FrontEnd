import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Auth Pages
import Login from "../pages/auth/Login"
import RoleRedirect from "../pages/RoleRedirect"
import Unauthorized from "../pages/Unauthorized"

// Components
import PrivateRoute from "../components/PrivateRoute"

// Student Pages
import StudentDashboard from "../pages/sinhvien/Dashboard"
import StudentResults from "../pages/sinhvien/KetQuaThi"
import StudentExam from "../pages/sinhvien/LamBaiThi"

// Teacher Pages
import TeacherDashboard from "../pages/giangvien/Dashboard"
import TeacherCreateExam from "../pages/giangvien/TaoKyThi"
import TeacherGrade from "../pages/giangvien/ChamBai"
import TeacherQuestionBank from "../pages/giangvien/NganHangCauHoi"
import TeacherPracticeAssignment from "../pages/giangvien/TaoBaiLuyenTap"
import TeacherStatistics from "../pages/giangvien/ThongKeDiemThi"
import TeacherAttemptHistory from "../pages/giangvien/LichSuLamBai"

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard"
import AdminSystem from "../pages/admin/QuanLyHeThong"
import AdminSubjects from "../pages/admin/QuanLyMonHoc"
import AdminAccounts from "../pages/admin/QuanLyTaiKhoan"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student Routes - Protected by PrivateRoute */}
        <Route element={<PrivateRoute allowedRoles={["sinhvien"]} />}>
          <Route path="/sinhvien/dashboard" element={<StudentDashboard />} />
          <Route path="/sinhvien/ketqua" element={<StudentResults />} />
          <Route path="/sinhvien/lam-bai" element={<StudentExam />} />
        </Route>

        {/* Teacher Routes - Protected by PrivateRoute */}
        <Route element={<PrivateRoute allowedRoles={["giangvien"]} />}>
          <Route path="/giangvien/dashboard" element={<TeacherDashboard />} />
          <Route path="/giangvien/tao-ky-thi" element={<TeacherCreateExam />} />
          <Route path="/giangvien/cham-bai" element={<TeacherGrade />} />
          <Route path="/giangvien/ngan-hang-cau-hoi" element={<TeacherQuestionBank />} />
          <Route path="/giangvien/tao-bai-luyen-tap" element={<TeacherPracticeAssignment />} />
          <Route path="/giangvien/thong-ke-diem-thi" element={<TeacherStatistics />} />
          <Route path="/giangvien/lich-su-lam-bai" element={<TeacherAttemptHistory />} />
        </Route>

        {/* Admin Routes - Protected by PrivateRoute */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/he-thong" element={<AdminSystem />} />
          <Route path="/admin/mon-hoc" element={<AdminSubjects />} />
          <Route path="/admin/tai-khoan" element={<AdminAccounts />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}