import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Edit2, Trash2, Search, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function QuanLyMonHoc() {

  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [subjects, setSubjects] = useState<any[]>([])

  // 🔥 FETCH DATA
  const fetchSubjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/subjects")
      const data = await res.json()

      const mapped = data.map((s: any) => ({
        id: s.id,
        code: "MH" + s.id, // 🔥 FAKE MÃ MÔN
        name: s.ten_mon_hoc || "",
        desc: s.mo_ta || ""
      }))

      setSubjects(mapped)

    } catch (err) {
      console.error("Lỗi fetch:", err)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  // 🔥 SEARCH (theo tên + mã)
  const filteredSubjects = subjects.filter((s) =>
    (s.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.code || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 🔥 DELETE
  const handleDelete = async () => {

    if (deleteId === null) return

    try {
      await fetch(`http://localhost:5000/api/admin/subjects/${deleteId}`, {
        method: "DELETE"
      })

      setDeleteId(null)
      setShowToast(true)

      fetchSubjects()

      setTimeout(() => setShowToast(false), 1500)

    } catch {
      alert("Xóa thất bại")
    }
  }

  return (
    <DashboardLayout role="ADMIN">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-start">

        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Quản lý môn học
          </h1>

          <p className="text-slate-600">
            Quản lý danh sách môn học trong hệ thống
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/subjects/create")}
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Thêm môn học
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-8">

        <div className="relative">
          <Search size={20} className="absolute left-4 top-3 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã môn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-700">
              <th className="text-left py-3 px-4">Mã môn</th>
              <th className="text-left py-3 px-4">Tên môn</th>
              <th className="text-left py-3 px-4">Mô tả</th>
              <th className="text-center py-3 px-4">Hành động</th>
            </tr>
          </thead>

          <tbody>

            {filteredSubjects.map(subject => (

              <tr key={subject.id} className="border-b hover:bg-slate-50">

                <td className="py-3 px-4 font-semibold text-indigo-600">
                  {subject.code}
                </td>

                <td className="py-3 px-4 font-semibold">
                  {subject.name}
                </td>

                <td className="py-3 px-4 text-slate-600">
                  {subject.desc}
                </td>

                <td className="text-center">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => navigate(`/admin/subjects/edit/${subject.id}`)}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => setDeleteId(subject.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            Không có môn học nào
          </div>
        )}

      </div>

      {/* DELETE MODAL */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="font-semibold mb-2">Xác nhận</h2>
            <p className="text-slate-600 mb-4">Bạn có chắc muốn xóa môn học này?</p>

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

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow flex items-center gap-2">
          <CheckCircle size={20} />
          Xóa thành công
        </div>
      )}

    </DashboardLayout>
  )
}