import DashboardLayout from "../../layout/DashboardLayout"
import { Users, FileText, BarChart3, Settings, TrendingUp, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const stats = {
    totalUsers: 350,
    teachers: 25,
    students: 325,
    exams: 48,
    avgScore: 7.2,
    systemHealth: 98
  }

  const recentActivities = [
    { id: 1, action: 'Giáo viên mới', user: 'Trần Văn X', time: '2 giờ trước' },
    { id: 2, action: 'Kỳ thi tạo', user: 'Lê Thị Y', time: '4 giờ trước' },
    { id: 3, action: 'Tài khoản khóa', user: 'Nguyễn Z', time: '1 ngày trước' },
    { id: 4, action: 'Lớp mới tạo', user: 'Phạm A', time: '2 ngày trước' },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          Bảng điều khiển Admin
        </h1>
        <p className="text-slate-600">Quản lý toàn hệ thống OMR Exam</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm">Tổng người dùng</p>
            <Users size={24} className="text-indigo-200" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm">Giáo viên</p>
            <FileText size={24} className="text-cyan-200" />
          </div>
          <p className="text-2xl font-bold text-cyan-600">{stats.teachers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm">Sinh viên</p>
            <Users size={24} className="text-green-200" />
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.students}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm">Kỳ thi</p>
            <BarChart3 size={24} className="text-orange-200" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.exams}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm">Điểm TB</p>
            <TrendingUp size={24} className="text-emerald-200" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.avgScore}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm">Hệ thống</p>
            <Settings size={24} className="text-purple-200" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.systemHealth}%</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Status */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Trạng thái hệ thống</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-600">Hoạt động</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">API Server</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-600">Hoạt động</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Email Service</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-yellow-600">Cảnh báo</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Storage</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-600">Hoạt động</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                  <p className="text-xs text-slate-600">{activity.user}</p>
                </div>
                <p className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 flex gap-4">
        <AlertCircle size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-yellow-900 mb-1">Cảnh báo hệ thống</h3>
          <p className="text-sm text-yellow-800">Dịch vụ Email có độ trễ cao. Vui lòng kiểm tra cấu hình mail server trong 24 giờ tới.</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
