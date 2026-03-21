import DashboardLayout from "../../layout/DashboardLayout"
import { useState, useEffect } from "react"
import { Save, Database, Trash2, CheckCircle, UploadCloud, Download, Loader2 } from "lucide-react"

export default function QuanLyHeThong() {

  const API = "http://localhost:5000/api/admin/system"

  const [settings, setSettings] = useState({
    examTime: 0,
    maxQuestions: 0,
    maxUpload: 0,
    maxLoginAttempts: 0,
    sessionTimeout: 0,
    forcePasswordChange: false
  })

  const [backupHistory, setBackupHistory] = useState<any[]>([])
  const [toast, setToast] = useState("")
  const [loading, setLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const [restoreFile, setRestoreFile] = useState<File | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadSettings()
    loadBackup()
  }, [])

  const loadSettings = async () => {
    const res = await fetch(`${API}/settings`)
    const data = await res.json()

    setSettings({
      examTime: data?.thoi_gian_thi || 0,
      maxQuestions: data?.so_cau_toi_da || 0,
      maxUpload: data?.dung_luong_upload || 0,
      maxLoginAttempts: data?.so_lan_dang_nhap || 0,
      sessionTimeout: data?.thoi_gian_phien || 0,
      forcePasswordChange: data?.bat_doi_mat_khau || false
    })
  }

  const loadBackup = async () => {
    const res = await fetch(`${API}/backup`)
    const data = await res.json()
    setBackupHistory(data || [])
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setSettings({ ...settings, [name]: Number(value) })
  }

  const handleSave = async () => {
    setLoading(true)

    await fetch(`${API}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thoi_gian_thi: settings.examTime,
        so_cau_toi_da: settings.maxQuestions,
        dung_luong_upload: settings.maxUpload,
        so_lan_dang_nhap: settings.maxLoginAttempts,
        thoi_gian_phien: settings.sessionTimeout,
        bat_doi_mat_khau: settings.forcePasswordChange
      })
    })

    setLoading(false)
    showToast("Lưu thành công")
  }

  // BACKUP
  const handleBackup = async () => {
    setBackupLoading(true)

    const res = await fetch(`${API}/backup`, { method: "POST" })
    const blob = await res.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "backup.sql"
    a.click()

    setBackupLoading(false)
    showToast("Backup thành công")
    loadBackup()
  }

  // DOWNLOAD OLD BACKUP
  const handleDownload = (fileName: string) => {
    window.open(`${API}/backup/download/${fileName}`)
  }

  // RESTORE
  const handleSelectFile = (e: any) => {
    const file = e.target.files[0]
    if (!file) return

    setRestoreFile(file)
    setShowModal(true)
  }

  const confirmRestore = async () => {
    if (!restoreFile) return

    const formData = new FormData()
    formData.append("file", restoreFile)

    setRestoreLoading(true)
    setProgress(0)

    // progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 300)

    await fetch(`${API}/restore`, {
      method: "POST",
      body: formData
    })

    clearInterval(interval)
    setProgress(100)

    setTimeout(() => {
      setRestoreLoading(false)
      setShowModal(false)
      setRestoreFile(null)
      setProgress(0)
      showToast("Restore thành công")
    }, 500)
  }
  const handleClearCache = async () => {
    await fetch(`${API}/cache`, { method: "DELETE" })
    showToast("Đã xóa cache")
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 1500)
  }

  return (
    <DashboardLayout role="ADMIN">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-indigo-600">Quản lý hệ thống</h1>
        <p className="text-gray-500">Cấu hình và vận hành hệ thống</p>
      </div>

      {/* SETTINGS */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">⚙️ Cài đặt hệ thống</h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="font-medium">Thời gian làm bài (giây)</label>
            <input type="number" name="examTime" value={settings.examTime}
              onChange={handleChange} className="border mt-1 p-2 w-full rounded" />
          </div>

          <div>
            <label className="font-medium">Số câu tối đa</label>
            <input type="number" name="maxQuestions" value={settings.maxQuestions}
              onChange={handleChange} className="border mt-1 p-2 w-full rounded" />
          </div>

          <div>
            <label className="font-medium">Dung lượng upload (MB)</label>
            <input type="number" name="maxUpload" value={settings.maxUpload}
              onChange={handleChange} className="border mt-1 p-2 w-full rounded" />
          </div>

          <div>
            <label className="font-medium">Số lần đăng nhập sai</label>
            <input type="number" name="maxLoginAttempts" value={settings.maxLoginAttempts}
              onChange={handleChange} className="border mt-1 p-2 w-full rounded" />
          </div>

          <div>
            <label className="font-medium">Thời gian phiên (phút)</label>
            <input type="number" name="sessionTimeout" value={settings.sessionTimeout}
              onChange={handleChange} className="border mt-1 p-2 w-full rounded" />
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={settings.forcePasswordChange}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  forcePasswordChange: e.target.checked
                })
              }
            />
            <span className="ml-2">Bắt buộc đổi mật khẩu</span>
          </div>

        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>

      {/* BACKUP */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">💾 Sao lưu dữ liệu</h2>

        <button
          onClick={handleBackup}
          disabled={backupLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded flex items-center gap-2 mb-4 disabled:opacity-50"
        >
          <Database size={16} className="text-white" />
          {backupLoading ? "Đang sao lưu..." : "Tạo backup"}
        </button>

        <table className="w-full text-sm border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Version</th>
              <th className="p-2 text-left">Dung lượng</th>
              <th className="p-2 text-left">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {backupHistory.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="p-2 font-medium">{b.ten_file}</td>
                <td className="p-2">{b.dung_luong}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDownload(b.ten_file)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download size={14} /> Tải
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RESTORE */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">📥 Khôi phục dữ liệu</h2>

        <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded flex items-center gap-2 w-fit cursor-pointer">
          <UploadCloud size={16} />
          Chọn file
          <input type="file" hidden onChange={handleSelectFile} />
        </label>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h3 className="font-semibold mb-2">Xác nhận restore</h3>
            <p className="text-sm mb-3">File: {restoreFile?.name}</p>
            {restoreLoading && (
              <>
                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-200 h-2 rounded mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* SPINNER */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Loader2 className="animate-spin" size={14} />
                  Đang khôi phục... {progress}%
                </div>
              </>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="border px-3 py-1 rounded">
                Hủy
              </button>
              <button
                onClick={confirmRestore}
                disabled={restoreLoading}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 flex items-center gap-2"
              >
                <>
                  {restoreLoading && <Loader2 className="animate-spin" size={14} />}
                  {restoreLoading ? "Đang restore..." : "Xác nhận"}
                </>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CACHE */}
      <div className="bg-white p-6 rounded-xl shadow">
        <button
          onClick={handleClearCache}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          <Trash2 size={16} />
          Xóa cache
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}

    </DashboardLayout>
  )
}