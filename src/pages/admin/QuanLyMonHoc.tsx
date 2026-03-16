import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Edit2, Trash2, Search, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function QuanLyMonHoc() {

  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)

  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Toán cao cấp 1",
      code: "TOAN101",
      credits: 3,
      semester: 1,
      year: "2025-2026",
      teacher: "Trần Văn X"
    },
    {
      id: 2,
      name: "Vật lý đại cương",
      code: "VLY101",
      credits: 4,
      semester: 1,
      year: "2025-2026",
      teacher: "Lê Thị Y"
    },
    {
      id: 3,
      name: "Hóa học đại cương",
      code: "HOA101",
      credits: 3,
      semester: 2,
      year: "2024-2025",
      teacher: "Phạm Z"
    },
    {
      id: 4,
      name: "Lập trình C++",
      code: "LTCP201",
      credits: 3,
      semester: 2,
      year: "2025-2026",
      teacher: "Nguyễn A"
    },
  ])

  const filteredSubjects = subjects.filter((s) => {

    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())

    const semesterString = `HK${s.semester} ${s.year}`

    const matchSemester =
      semesterFilter === "" || semesterString === semesterFilter

    return matchSearch && matchSemester
  })

  const handleDelete = () => {

    if (deleteId === null) return

    setSubjects(subjects.filter(s => s.id !== deleteId))
    setDeleteId(null)

    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 1500)
  }

  return (
    <DashboardLayout role="ADMIN">

      {/* Header */}
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
          className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md"
        >
          <Plus size={20} />
          Thêm môn học
        </button>

      </div>


      {/* Search + Filter */}
      <div className="mb-8 flex gap-4">

        <div className="relative flex-1">

          <Search size={20} className="absolute left-4 top-3 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã môn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

        </div>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-3"
        >

          <option value="">Tất cả học kỳ</option>
          <option value="HK1 2025-2026">HK1 2025-2026</option>
          <option value="HK2 2025-2026">HK2 2025-2026</option>
          <option value="HK1 2024-2025">HK1 2024-2025</option>
          <option value="HK2 2024-2025">HK2 2024-2025</option>

        </select>

      </div>


      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200">

                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Mã môn
                </th>

                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Tên môn
                </th>

                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                  Tín chỉ
                </th>

                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                  Học kỳ
                </th>

                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                  Giảng viên
                </th>

                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                  Hành động
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredSubjects.map(subject => (

                <tr
                  key={subject.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >

                  <td className="py-3 px-4 text-indigo-600 font-semibold">
                    {subject.code}
                  </td>

                  <td className="py-3 px-4 font-medium text-slate-800">
                    {subject.name}
                  </td>

                  <td className="text-center text-slate-600">
                    {subject.credits}
                  </td>

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${subject.semester === 1
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-cyan-100 text-cyan-700"
                        }`}
                    >
                      HK{subject.semester} {subject.year}
                    </span>

                  </td>

                  <td className="py-3 px-4">

                    <div className="flex items-center gap-2">

                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {subject.teacher.charAt(0)}
                      </div>

                      {subject.teacher}

                    </div>

                  </td>

                  <td className="text-center">

                    <div className="flex justify-center gap-2">

                      {/* Edit */}
                      <button
                        title="Sửa môn học"
                        onClick={() => navigate(`/admin/subjects/edit/${subject.id}`)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-indigo-600"
                      >
                        <Edit2 size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        title="Xóa môn học"
                        onClick={() => setDeleteId(subject.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {filteredSubjects.length === 0 && (

          <div className="text-center py-10">
            <p className="text-slate-500">
              Không tìm thấy môn học nào
            </p>
          </div>

        )}

        <div className="mt-4 text-sm text-slate-600 text-right">
          Tổng: {filteredSubjects.length} môn học
        </div>

      </div>


      {/* Delete Modal */}
      {deleteId !== null && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">

            <h2 className="text-lg font-semibold mb-2">
              Xác nhận xóa
            </h2>

            <p className="text-slate-600 mb-6">
              Bạn có chắc muốn xóa môn học này không?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
              >
                Hủy
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Xóa
              </button>

            </div>

          </div>

        </div>

      )}


      {/* Toast */}
      {showToast && (

        <div className="fixed top-6 right-6 z-50">

          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">

            <CheckCircle size={20} />

            Xóa môn học thành công

          </div>

        </div>

      )}

    </DashboardLayout>
  )
}