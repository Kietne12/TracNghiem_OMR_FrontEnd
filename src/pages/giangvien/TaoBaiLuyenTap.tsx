import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Edit2, Trash2, ClipboardList, Filter, Search } from 'lucide-react'
import { useState } from 'react'

interface PracticeAssignment {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string
  totalQuestions: number
  difficulty: { easy: number; normal: number; hard: number }
  allowRetake: boolean
  canViewAnswers: boolean
  chapters: string[]
  studentCount: number
  createdAt: string
}

export default function TaoBaiLuyenTap() {
  const [selectedSemester, setSelectedSemester] = useState('1')
  const [selectedYear, setSelectedYear] = useState('2025-2026')
  const [selectedClass, setSelectedClass] = useState('lop1')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const classes = [
    { id: 'lop1', name: 'Lớp 10A1 - Toán cao cấp 1', studentCount: 45 },
    { id: 'lop2', name: 'Lớp 10A2 - Toán cao cấp 1', studentCount: 42 },
    { id: 'lop3', name: 'Lớp 10B1 - Vật lý đại cương', studentCount: 48 },
  ]

  const [assignments, setAssignments] = useState<PracticeAssignment[]>([
    {
      id: 1,
      name: 'Bài tập Chương 1: Hàm số và giới hạn',
      description: 'Bài tập ôn tập lý thuyết về hàm số và giới hạn',
      startDate: '15/03/2026',
      endDate: '22/03/2026',
      totalQuestions: 30,
      difficulty: { easy: 10, normal: 15, hard: 5 },
      allowRetake: true,
      canViewAnswers: true,
      chapters: ['ch1'],
      studentCount: 42,
      createdAt: '10/03/2026',
    },
    {
      id: 2,
      name: 'Quiz Chương 2: Đạo hàm',
      description: 'Kiểm tra nhanh về kiến thức chương 2',
      startDate: '18/03/2026',
      endDate: '25/03/2026',
      totalQuestions: 20,
      difficulty: { easy: 5, normal: 10, hard: 5 },
      allowRetake: false,
      canViewAnswers: false,
      chapters: ['ch2'],
      studentCount: 42,
      createdAt: '12/03/2026',
    },
  ])

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    totalQuestions: 25,
    chapters: ['ch1', 'ch2'],
    easyCount: 8,
    normalCount: 12,
    hardCount: 5,
    allowRetake: true,
    canViewAnswers: true,
  })

  const chapters = [
    { id: 'ch1', name: 'Chương 1: Hàm số và giới hạn' },
    { id: 'ch2', name: 'Chương 2: Đạo hàm' },
    { id: 'ch3', name: 'Chương 3: Tích phân' },
    { id: 'ch4', name: 'Chương 4: Phương trình vi phân' },
  ]

  const semesters = [
    { id: '1', name: 'Kỳ 1' },
    { id: '2', name: 'Kỳ 2' },
  ]

  const academicYears = [
    { id: '2025-2026', name: 'Năm học 2025-2026' },
    { id: '2024-2025', name: 'Năm học 2024-2025' },
    { id: '2023-2024', name: 'Năm học 2023-2024' },
  ]

  const filteredAssignments = assignments.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()

    const newAssignment: PracticeAssignment = {
      id: Math.max(...assignments.map((a) => a.id), 0) + 1,
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalQuestions: formData.totalQuestions,
      difficulty: {
        easy: formData.easyCount,
        normal: formData.normalCount,
        hard: formData.hardCount,
      },
      allowRetake: formData.allowRetake,
      canViewAnswers: formData.canViewAnswers,
      chapters: formData.chapters,
      studentCount: 42,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    }

    setAssignments([...assignments, newAssignment])
    setShowCreateForm(false)
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      totalQuestions: 25,
      chapters: ['ch1', 'ch2'],
      easyCount: 8,
      normalCount: 12,
      hardCount: 5,
      allowRetake: true,
      canViewAnswers: true,
    })
  }

  const handleDeleteAssignment = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      setAssignments(assignments.filter((a) => a.id !== id))
    }
  }

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo bài luyện tập
          </h1>
          <p className="text-slate-600">Quản lý các bài tập ôn luyện cho sinh viên</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <Plus size={20} />
          Tạo bài tập
        </button>
      </div>

      {/* Semester and Year Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Kỳ học
          </label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {semesters.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Năm học
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Class Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          <Filter size={16} className="inline mr-2" />
          Chọn lớp
        </label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{assignment.name}</h3>
                  <p className="text-sm text-slate-600">{assignment.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Chỉnh sửa">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Difficulty Badges */}
              <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                  Dễ: {assignment.difficulty.easy}
                </span>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                  TB: {assignment.difficulty.normal}
                </span>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                  Khó: {assignment.difficulty.hard}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex justify-between">
                  <span>📅 {assignment.startDate} - {assignment.endDate}</span>
                  <span>❓ {assignment.totalQuestions} câu</span>
                </div>
              </div>

              {/* Options */}
              <div className="flex gap-4 text-xs text-slate-600">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={assignment.allowRetake} readOnly />
                  Cho làm lại
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={assignment.canViewAnswers} readOnly />
                  Xem đáp án
                </label>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-8 text-center">
            <ClipboardList size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 mb-4">Chưa có bài tập nào</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Tạo bài tập đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800">Tạo bài luyện tập mới</h2>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên bài tập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Bài tập Chương 1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả về bài tập..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tổng số câu hỏi
                </label>
                <input
                  type="number"
                  value={formData.totalQuestions}
                  onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Chương
                </label>
                <div className="space-y-2">
                  {chapters.map((ch) => (
                    <label key={ch.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.chapters.includes(ch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, chapters: [...formData.chapters, ch.id] })
                          } else {
                            setFormData({ ...formData, chapters: formData.chapters.filter((c) => c !== ch.id) })
                          }
                        }}
                      />
                      <span className="text-sm text-slate-700">{ch.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Phân bổ độ khó
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-600">Dễ: {formData.easyCount}</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={formData.easyCount}
                      onChange={(e) => setFormData({ ...formData, easyCount: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Bình thường: {formData.normalCount}</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={formData.normalCount}
                      onChange={(e) => setFormData({ ...formData, normalCount: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-600">Khó: {formData.hardCount}</label>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={formData.hardCount}
                      onChange={(e) => setFormData({ ...formData, hardCount: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.allowRetake}
                    onChange={(e) => setFormData({ ...formData, allowRetake: e.target.checked })}
                  />
                  <span className="text-sm text-slate-700">Cho học sinh làm lại</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.canViewAnswers}
                    onChange={(e) => setFormData({ ...formData, canViewAnswers: e.target.checked })}
                  />
                  <span className="text-sm text-slate-700">Cho xem đáp án</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Tạo bài tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
