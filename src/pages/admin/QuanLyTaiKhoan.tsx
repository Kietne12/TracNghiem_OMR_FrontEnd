import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Pencil, Trash2, Search, Lock, Unlock, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function QuanLyTaiKhoan() {

  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [lockId, setLockId] = useState<number | null>(null)
  const [toast, setToast] = useState("")

  const [accounts, setAccounts] = useState<any[]>([])

  // 🔥 FETCH DATA
  const fetchAccounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/accounts")
      const data = await res.json()
      setAccounts(data)
    } catch (err) {
      console.error("Lỗi load accounts:", err)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  // 🔥 MAP ROLE NAME
  const getRoleName = (role: string) => {
    if (role === "admin") return "Admin"
    if (role === "giangvien") return "Giáo viên"
    if (role === "sinhvien") return "Sinh viên"
    return role
  }

  // 🔍 FILTER
  const filteredAccounts = accounts.filter((a) => {

    const name = a.ho_ten || ""
    const email = a.email || ""

    const matchSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())

    const role = a.tai_khoan?.role || ""

    const matchRole = roleFilter === "" || role === roleFilter

    return matchSearch && matchRole
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 1500)
  }

  // 🔒 LOCK / UNLOCK
  const handleLock = async () => {
    if (lockId === null) return

    await fetch(`http://localhost:5000/api/admin/accounts/lock/${lockId}`, {
      method: "PUT",
    })

    setLockId(null)
    showToast("Cập nhật trạng thái thành công")
    fetchAccounts()
  }

  // 🗑 DELETE
  const handleDelete = async () => {
    if (deleteId === null) return

    await fetch(`http://localhost:5000/api/admin/accounts/${deleteId}`, {
      method: "DELETE",
    })

    setDeleteId(null)
    showToast("Xóa tài khoản thành công")
    fetchAccounts()
  }

  return (
    <DashboardLayout role="ADMIN">

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Quản lý tài khoản
          </h1>
          <p className="text-slate-600">
            Quản lý tài khoản người dùng trong hệ thống
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/accounts/create")}
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Tạo tài khoản
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo email hoặc tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3"
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="giangvien">Giáo viên</option>
          <option value="sinhvien">Sinh viên</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 text-slate-700 text-sm">
              <th className="text-left py-3 px-4">Người dùng</th>
              <th className="text-left py-3 px-4">Username</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-center py-3 px-4">Vai trò</th>
              <th className="text-center py-3 px-4">Trạng thái</th>
              <th className="text-center py-3 px-4">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {filteredAccounts.map((account) => {

              const role = account.tai_khoan?.role || ""
              const isActive = account.trang_thai

              return (
                <tr key={account.id} className="border-b hover:bg-slate-50 transition">

                  <td className="py-3 px-4">
                    {account.ho_ten}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {account.tai_khoan?.username}
                  </td>

                  <td className="py-3 px-4 text-indigo-600">
                    {account.email}
                  </td>

                  <td className="text-center">
                    <span className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">
                      {getRoleName(role)}
                    </span>
                  </td>

                  <td className="text-center">
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                      {isActive ? "Hoạt động" : "Khóa"}
                    </span>
                  </td>

                  <td className="text-center">
                    <div className="flex justify-center gap-2">

                      {/* EDIT */}
                      <button
                        title="Sửa tài khoản"
                        onClick={() => navigate(`/admin/accounts/edit/${account.id}`)}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* LOCK */}
                      <button
                        title="Khóa / Mở khóa"
                        disabled={role === "admin"}
                        onClick={() => setLockId(account.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg"
                      >
                        {isActive
                          ? <Lock size={18} className="text-red-500" />
                          : <Unlock size={18} className="text-green-500" />}
                      </button>

                      {/* DELETE */}
                      {role !== "admin" && (
                        <button
                          title="Xóa tài khoản"
                          onClick={() => setDeleteId(account.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Lock */}
      {lockId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="font-semibold text-lg mb-2">Xác nhận</h2>
            <p className="text-slate-600 mb-6">
              Bạn có chắc muốn thay đổi trạng thái tài khoản này?
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setLockId(null)} className="px-4 py-2 border rounded-lg">
                Hủy
              </button>
              <button onClick={handleLock} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="font-semibold text-lg mb-2">Xác nhận xóa</h2>
            <p className="text-slate-600 mb-6">
              Bạn có chắc muốn xóa tài khoản này không?
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border rounded-lg">
                Hủy
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

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