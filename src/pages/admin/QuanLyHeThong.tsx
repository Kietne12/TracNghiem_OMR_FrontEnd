import DashboardLayout from "../../layout/DashboardLayout"
import { Settings } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from "../../hooks/useAuth"

export default function QuanLyHeThong() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    userRegistration: true,
    forcePasswordChange: false,
  })

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings]
    })
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Quản lý hệ thống
        </h1>
        <p className="text-slate-600">Cấu hình và quản lý các thiết lập hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <Settings size={24} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Cài đặt chung</h2>
            </div>

            <div className="space-y-4">
              {/* Maintenance Mode */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Chế độ bảo trì</p>
                  <p className="text-sm text-slate-600">Tắt tạm thời hệ thống để bảo trì</p>
                </div>
                <button
                  onClick={() => handleToggle('maintenanceMode')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.maintenanceMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Thông báo qua email</p>
                  <p className="text-sm text-slate-600">Gửi thông báo email tới người dùng</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    settings.emailNotifications ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>

              {/* User Registration */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Đăng ký người dùng mới</p>
                  <p className="text-sm text-slate-600">Cho phép người dùng tự đăng ký tài khoản</p>
                </div>
                <button
                  onClick={() => handleToggle('userRegistration')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    settings.userRegistration ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.userRegistration ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>

              {/* Force Password Change */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-800">Buộc thay đổi mật khẩu</p>
                  <p className="text-sm text-slate-600">Yêu cầu người dùng thay đổi mật khẩu</p>
                </div>
                <button
                  onClick={() => handleToggle('forcePasswordChange')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                    settings.forcePasswordChange ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                      settings.forcePasswordChange ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          {/* System Limits */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200">
              Giới hạn hệ thống
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Thời gian thi tối đa (phút)
                </label>
                <input
                  type="number"
                  defaultValue="300"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Số câu hỏi tối đa trên bài thi
                </label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Độ bền tệp tải lên (MB)
                </label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          {/* System Info */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Thông tin hệ thống</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-600">Phiên bản</p>
                <p className="font-semibold text-slate-800">1.0.0</p>
              </div>
              <div>
                <p className="text-slate-600">Build</p>
                <p className="font-semibold text-slate-800">2026031101</p>
              </div>
              <div>
                <p className="text-slate-600">Cơ sở dữ liệu</p>
                <p className="font-semibold text-slate-800">PostgreSQL 13</p>
              </div>
              <div>
                <p className="text-slate-600">Lần cập nhật</p>
                <p className="font-semibold text-slate-800">11/03/2026</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
              Sao lưu dữ liệu
            </button>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition">
              Xóa cache
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition">
              Cập nhật hệ thống
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
