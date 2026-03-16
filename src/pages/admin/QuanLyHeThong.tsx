import DashboardLayout from "../../layout/DashboardLayout"
import { useState } from "react"
import {
  Settings,
  Shield,
  Database,
  CheckCircle,
  Download,
  Upload,
  Trash2,
  Clock,
  HardDrive,
} from "lucide-react"

export default function QuanLyHeThong() {

  const [activeTab, setActiveTab] = useState("settings")
  const [toast, setToast] = useState("")
  const [progress, setProgress] = useState(0)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 1500)
  }

  const [settings, setSettings] = useState({
    examTime: 300,
    maxQuestions: 500,
    maxUpload: 50,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    forcePasswordChange: false
  })

  const [backupHistory] = useState([
    { id: 1, time: "24/02/2026 02:30", size: "120MB" },
    { id: 2, time: "20/02/2026 02:30", size: "118MB" },
    { id: 3, time: "15/02/2026 02:30", size: "115MB" }
  ])

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setSettings({
      ...settings,
      [name]: value
    })
  }

  const togglePasswordChange = () => {
    setSettings({
      ...settings,
      forcePasswordChange: !settings.forcePasswordChange
    })
  }

  const handleBackup = () => {

    setProgress(0)

    showToast("Đang sao lưu dữ liệu...")

    let value = 0

    const interval = setInterval(() => {

      value += 20

      setProgress(value)

      if (value >= 100) {
        clearInterval(interval)
        showToast("Sao lưu hoàn tất")
      }

    }, 500)

  }

  const handleDownload = () => {
    showToast("Đang tải bản sao lưu")
  }

  const handleRestore = () => {
    showToast("Khôi phục dữ liệu thành công")
  }

  const handleClearCache = () => {
    showToast("Đã xóa cache hệ thống")
  }

  return (
    <DashboardLayout role="ADMIN">

      <div className="mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
          Cấu hình hệ thống
        </h1>

        <p className="text-slate-600 mt-2">
          Quản lý thiết lập và dữ liệu hệ thống
        </p>

      </div>


      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

        <div className="flex border-b border-slate-200">

          <Tab
            icon={<Settings size={18} />}
            label="Cài đặt"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />

          <Tab
            icon={<Shield size={18} />}
            label="Bảo mật"
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
          />

          <Tab
            icon={<Database size={18} />}
            label="Sao lưu dữ liệu"
            active={activeTab === "backup"}
            onClick={() => setActiveTab("backup")}
          />

        </div>


        <div className="p-8">


          {/* SETTINGS */}
          {activeTab === "settings" && (

            <div className="space-y-6">

              <Input label="Thời gian thi tối đa (phút)" name="examTime" value={settings.examTime} onChange={handleChange} />

              <Input label="Số câu hỏi tối đa" name="maxQuestions" value={settings.maxQuestions} onChange={handleChange} />

              <Input label="Kích thước upload tối đa (MB)" name="maxUpload" value={settings.maxUpload} onChange={handleChange} />

            </div>

          )}


          {/* SECURITY */}
          {activeTab === "security" && (

            <div className="space-y-6">

              <Input label="Số lần đăng nhập thất bại tối đa" name="maxLoginAttempts" value={settings.maxLoginAttempts} onChange={handleChange} />

              <Input label="Thời gian hết phiên đăng nhập (phút)" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} />

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl">

                <div>
                  <p className="font-medium">Buộc đổi mật khẩu</p>
                  <p className="text-sm text-slate-500">
                    Người dùng phải đổi mật khẩu sau khi đăng nhập
                  </p>
                </div>

                <button
                  onClick={togglePasswordChange}
                  className={`relative inline-flex h-8 w-14 rounded-full transition
                  ${settings.forcePasswordChange ? "bg-green-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition
                    ${settings.forcePasswordChange ? "translate-x-7" : "translate-x-1"}`}
                  />
                </button>

              </div>

            </div>

          )}


          {/* BACKUP */}
          {activeTab === "backup" && (

            <div className="space-y-8">

              {/* Backup actions */}
              <div className="flex flex-wrap gap-4">

                <button
                  onClick={handleBackup}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
                >
                  <Database size={16} />
                  Sao lưu ngay
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg"
                >
                  <Download size={16} />
                  Tải xuống
                </button>

                <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer">

                  <Upload size={16} />

                  Khôi phục dữ liệu

                  <input type="file" className="hidden" onChange={handleRestore} />

                </label>

                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                >
                  <Trash2 size={16} />
                  Xóa cache
                </button>

              </div>


              {/* Progress */}
              {progress > 0 && (

                <div>

                  <p className="text-sm text-slate-600 mb-2">
                    Tiến trình sao lưu
                  </p>

                  <div className="w-full bg-slate-200 rounded-full h-3">

                    <div
                      className="bg-indigo-600 h-3 rounded-full transition"
                      style={{ width: `${progress}%` }}
                    />

                  </div>

                </div>

              )}


              {/* Backup History */}
              <div>

                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock size={18} />
                  Lịch sử sao lưu
                </h3>

                <div className="border rounded-xl overflow-hidden">

                  <table className="w-full text-sm">

                    <thead className="bg-slate-100">

                      <tr>

                        <th className="text-left px-4 py-3">Thời gian</th>
                        <th className="text-left px-4 py-3">Dung lượng</th>
                        <th className="text-left px-4 py-3">Hành động</th>

                      </tr>

                    </thead>

                    <tbody>

                      {backupHistory.map((item) => (

                        <tr key={item.id} className="border-t">

                          <td className="px-4 py-3 flex items-center gap-2">
                            <Clock size={14} />
                            {item.time}
                          </td>

                          <td className="px-4 py-3 flex items-center gap-2">
                            <HardDrive size={14} />
                            {item.size}
                          </td>

                          <td className="px-4 py-3">

                            <button className="flex items-center gap-1 text-indigo-600 hover:underline">
                              <Download size={14} />
                              Tải
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          )}

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



/* TAB */
function Tab({ icon, label, active, onClick }: any) {

  return (

    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition
      ${active
          ? "border-indigo-600 text-indigo-600"
          : "border-transparent text-slate-600 hover:text-indigo-600"
        }`}
    >
      {icon}
      {label}
    </button>

  )

}



/* INPUT */
function Input({ label, name, value, onChange }: any) {

  return (

    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
      />

    </div>

  )

}