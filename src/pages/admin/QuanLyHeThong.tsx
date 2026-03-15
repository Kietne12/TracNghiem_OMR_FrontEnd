import DashboardLayout from "../../layout/DashboardLayout"
import { Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function QuanLyHeThong() {

  const [toast, setToast] = useState("")

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    userRegistration: true,
    forcePasswordChange: false,
  })

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(""), 1500)
  }

  const handleToggle = (key: string) => {

    const updated = {
      ...settings,
      [key]: !settings[key as keyof typeof settings]
    }

    setSettings(updated)

    console.log("Auto save:", updated)

    showToast("Cập nhật cài đặt thành công")
  }

  const handleBackup = () => {

    console.log("Backup database")

    showToast("Đang sao lưu dữ liệu...")

    setTimeout(() => {
      showToast("Sao lưu dữ liệu thành công")
    }, 1200)
  }

  const handleClearCache = () => {

    console.log("Clear cache")

    showToast("Đã xóa cache hệ thống")
  }

  const handleUpdateSystem = () => {

    console.log("Update system")

    showToast("Hệ thống đã được cập nhật")
  }

  return (
    <DashboardLayout role="ADMIN">

      {/* Header */}
      <div className="mb-8 -mt-1 flex justify-between items-start">

        <div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Quản lý hệ thống
          </h1>

          <p className="text-slate-600">
            Cấu hình và quản lý các thiết lập hệ thống
          </p>

        </div>

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">


          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">

              <Settings size={24} className="text-indigo-600" />

              <h2 className="text-xl font-bold text-slate-800">
                Cài đặt chung
              </h2>

            </div>


            <div className="space-y-4">


              {/* Maintenance */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">

                <div>
                  <p className="font-medium text-slate-800">
                    Chế độ bảo trì
                  </p>

                  <p className="text-sm text-slate-600">
                    Tạm thời khóa hệ thống để bảo trì
                  </p>
                </div>

                <button
                  onClick={() => handleToggle("maintenanceMode")}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition
                  ${settings.maintenanceMode ? "bg-red-500" : "bg-slate-300"}`}
                >

                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition
                    ${settings.maintenanceMode ? "translate-x-7" : "translate-x-1"}`}
                  />

                </button>

              </div>


              {/* Email */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">

                <div>

                  <p className="font-medium text-slate-800">
                    Thông báo email
                  </p>

                  <p className="text-sm text-slate-600">
                    Gửi email thông báo cho người dùng
                  </p>

                </div>

                <button
                  onClick={() => handleToggle("emailNotifications")}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition
                  ${settings.emailNotifications ? "bg-green-500" : "bg-slate-300"}`}
                >

                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition
                    ${settings.emailNotifications ? "translate-x-7" : "translate-x-1"}`}
                  />

                </button>

              </div>


              {/* Register */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">

                <div>

                  <p className="font-medium text-slate-800">
                    Cho phép đăng ký
                  </p>

                  <p className="text-sm text-slate-600">
                    Người dùng có thể tự tạo tài khoản
                  </p>

                </div>

                <button
                  onClick={() => handleToggle("userRegistration")}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition
                  ${settings.userRegistration ? "bg-green-500" : "bg-slate-300"}`}
                >

                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition
                    ${settings.userRegistration ? "translate-x-7" : "translate-x-1"}`}
                  />

                </button>

              </div>


              {/* Force Password */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">

                <div>

                  <p className="font-medium text-slate-800">
                    Buộc đổi mật khẩu
                  </p>

                  <p className="text-sm text-slate-600">
                    Người dùng phải đổi mật khẩu sau khi đăng nhập
                  </p>

                </div>

                <button
                  onClick={() => handleToggle("forcePasswordChange")}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition
                  ${settings.forcePasswordChange ? "bg-green-500" : "bg-slate-300"}`}
                >

                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition
                    ${settings.forcePasswordChange ? "translate-x-7" : "translate-x-1"}`}
                  />

                </button>

              </div>

            </div>

          </div>



          {/* System Limits */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

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
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Số câu hỏi tối đa
                </label>

                <input
                  type="number"
                  defaultValue="500"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kích thước upload tối đa (MB)
                </label>

                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />

              </div>

            </div>

          </div>

        </div>



        {/* RIGHT */}
        <div className="space-y-6">


          {/* System Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

            <h3 className="font-bold text-slate-800 mb-4">
              Thông tin hệ thống
            </h3>

            <div className="space-y-3 text-sm">

              <div>
                <p className="text-slate-500">Phiên bản</p>
                <p className="font-semibold text-slate-800">1.0.0</p>
              </div>

              <div>
                <p className="text-slate-500">Build</p>
                <p className="font-semibold text-slate-800">2026031101</p>
              </div>

              <div>
                <p className="text-slate-500">Database</p>
                <p className="font-semibold text-slate-800">PostgreSQL 13</p>
              </div>

              <div>
                <p className="text-slate-500">Cập nhật gần nhất</p>
                <p className="font-semibold text-slate-800">11/03/2026</p>
              </div>

            </div>

          </div>



          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-3">

            <button
              onClick={handleBackup}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
            >
              Sao lưu dữ liệu
            </button>

            <button
              onClick={handleClearCache}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium"
            >
              Xóa cache
            </button>

            <button
              onClick={handleUpdateSystem}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
            >
              Cập nhật hệ thống
            </button>

          </div>

        </div>

      </div>


      {/* Toast */}
      {toast && (

        <div className="fixed top-6 right-6 z-50">

          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">

            <CheckCircle size={20} />

            {toast}

          </div>

        </div>

      )}

    </DashboardLayout>
  )
}