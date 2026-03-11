import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from "../../hooks/useAuth"

export default function QuanLyMonHoc() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Toán cao cấp 1', code: 'TOAN101', credits: 3, semester: 1, teacher: 'Trần Văn X' },
    { id: 2, name: 'Vật lý đại cương', code: 'VLY101', credits: 4, semester: 1, teacher: 'Lê Thị Y' },
    { id: 3, name: 'Hóa học đại cương', code: 'HOA101', credits: 3, semester: 1, teacher: 'Phạm Z' },
    { id: 4, name: 'Lập trình C++', code: 'LTCP201', credits: 3, semester: 2, teacher: 'Nguyễn A' },
  ])

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id))
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Quản lý môn học
          </h1>
          <p className="text-slate-600">Thêm, sửa, xóa các môn học trong hệ thống</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
          <Plus size={20} />
          Thêm môn học
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 relative">
        <Search size={20} className="absolute left-4 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm môn học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Mã môn</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tên môn</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Số tín chỉ</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Học kỳ</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Giáo viên</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-sm font-semibold text-indigo-600">{subject.code}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium">{subject.name}</td>
                  <td className="py-3 px-4 text-center text-sm text-slate-600">{subject.credits}</td>
                  <td className="py-3 px-4 text-center text-sm text-slate-600">{subject.semester}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{subject.teacher}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-indigo-600">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id)}
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
          <div className="text-center py-8">
            <p className="text-slate-500">Không tìm thấy môn học nào</p>
          </div>
        )}
        <div className="mt-4 text-sm text-slate-600 text-right">
          Tổng: {filteredSubjects.length} môn học
        </div>
      </div>
    </DashboardLayout>
  )
}
