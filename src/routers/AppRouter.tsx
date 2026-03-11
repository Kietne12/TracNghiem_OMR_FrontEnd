import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Auth Pages
import Login from "../pages/auth/Login"

// Student Pages
import StudentDashboard from "../pages/sinhvien/Dashboard"
import StudentResults from "../pages/sinhvien/KetQuaThi"
import StudentExam from "../pages/sinhvien/LamBaiThi"

// Teacher Pages
import TeacherDashboard from "../pages/giangvien/Dashboard"
import TeacherCreateExam from "../pages/giangvien/TaoKyThi"
import TeacherGrade from "../pages/giangvien/ChamBai"
import TeacherQuestionBank from "../pages/giangvien/NganHangCauHoi"

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
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/sinhvien/dashboard" element={<StudentDashboard />} />
        <Route path="/sinhvien/ketqua" element={<StudentResults />} />
        <Route path="/sinhvien/lam-bai" element={<StudentExam />} />

        {/* Teacher Routes */}
        <Route path="/giangvien/dashboard" element={<TeacherDashboard />} />
        <Route path="/giangvien/tao-ky-thi" element={<TeacherCreateExam />} />
        <Route path="/giangvien/cham-bai" element={<TeacherGrade />} />
        <Route path="/giangvien/ngan-hang-cau-hoi" element={<TeacherQuestionBank />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/he-thong" element={<AdminSystem />} />
        <Route path="/admin/mon-hoc" element={<AdminSubjects />} />
        <Route path="/admin/tai-khoan" element={<AdminAccounts />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}