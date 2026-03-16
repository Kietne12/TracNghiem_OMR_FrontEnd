import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Auth Pages
import Login from "../pages/auth/Login"
import RoleRedirect from "../pages/RoleRedirect"
import Unauthorized from "../pages/Unauthorized"

// Components
import PrivateRoute from "../components/PrivateRoute"

// Student Pages
import StudentDashboard from "../pages/sinhvien/Dashboard"
import StudentExamList from "../pages/sinhvien/DanhSachKyThi"
import DanhSachBaiThi from "../pages/sinhvien/DanhSachBaiThi"
import StudentResults from "../pages/sinhvien/KetQuaThi"
import StudentExam from "../pages/sinhvien/LamBaiThi"
import LichSuLamBai from "../pages/sinhvien/LichSuLamBai"
import LuyenTap from "../pages/sinhvien/LuyenTap"
import ChiTietBaiThi from "../pages/sinhvien/ChiTietBaiThi"
import DanhSachBaiLuyenTap from "../pages/sinhvien/DanhSachBaiLuyenTap"
import LamBaiLuyenTap from "../pages/sinhvien/LamBaiLuyenTap"
import KetQuaLuyenTap from "../pages/sinhvien/KetQuaLuyenTap"


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
import TaoTaiKhoan from "../pages/admin/TaoTaiKhoan"
import SuaTaiKhoan from "../pages/admin/SuaTaiKhoan"
import ThemMonHoc from "../pages/admin/ThemMonHoc"
import SuaMonHoc from "../pages/admin/SuaMonHoc"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Routes */}
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student Routes */}
        <Route element={<PrivateRoute allowedRoles={["sinhvien"]} />}>

          <Route path="/sinhvien/dashboard" element={<StudentDashboard />} />

          {/* Danh sách môn thi */}
          <Route path="/sinhvien/ky-thi" element={<StudentExamList />} />

          {/* Danh sách bài thi của môn */}
          <Route path="/sinhvien/ky-thi/:subjectId" element={<DanhSachBaiThi />} />
          <Route path="/sinhvien/ketqua" element={<StudentResults />} />
          <Route path="/sinhvien/lam-bai/:examId" element={<StudentExam />} />
          <Route path="/sinhvien/lich-su" element={<LichSuLamBai />} />

          {/* Luyện tập */}
          <Route path="/sinhvien/luyen-tap" element={<LuyenTap />} />
          <Route path="/sinhvien/chitiet-baithi/:id" element={<ChiTietBaiThi />} />
          <Route path="/sinhvien/luyen-tap/:subjectId" element={<DanhSachBaiLuyenTap />} />
          <Route path="/sinhvien/luyen-tap/lam-bai/:practiceId" element={<LamBaiLuyenTap />} />
          <Route path="/sinhvien/ketqua-luyen-tap" element={<KetQuaLuyenTap />} />


        </Route>

        {/* Teacher Routes */}
        <Route element={<PrivateRoute allowedRoles={["giangvien"]} />}>

          <Route path="/giangvien/dashboard" element={<TeacherDashboard />} />
          <Route path="/giangvien/tao-ky-thi" element={<TeacherCreateExam />} />
          <Route path="/giangvien/cham-bai" element={<TeacherGrade />} />
          <Route path="/giangvien/ngan-hang-cau-hoi" element={<TeacherQuestionBank />} />

        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* System */}
          <Route path="/admin/system" element={<AdminSystem />} />

          {/* Subjects */}
          <Route path="/admin/subjects" element={<AdminSubjects />} />
          <Route path="/admin/subjects/create" element={<ThemMonHoc />} />
          <Route path="/admin/subjects/edit/:id" element={<SuaMonHoc />} />

          {/* Accounts */}
          <Route path="/admin/accounts" element={<AdminAccounts />} />
          <Route path="/admin/accounts/create" element={<TaoTaiKhoan />} />
          <Route path="/admin/accounts/edit/:id" element={<SuaTaiKhoan />} />

        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}