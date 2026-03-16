import DashboardLayout from "../../layout/DashboardLayout"
import { CheckCircle, Clock, Download, Filter, Search, Eye } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from "../../hooks/useAuth"

interface StudentResult {
  id: number
  studentId: string
  studentName: string
  submitTime: string
  score: number | null
  totalQuestions: number
  correctAnswers: number
  totalTime: number
  status: 'Đã chấm' | 'Chờ chấm'
}

interface ExamInfo {
  id: number
  name: string
  submissions: number
  graded: number
  pending: number
  totalScore: number
}

export default function ChamBai() {
  const [selectedSemester, setSelectedSemester] = useState('1')
  const [selectedYear, setSelectedYear] = useState('2025-2026')
  const [selectedClass, setSelectedClass] = useState('lop1')
  const [currentExamId, setCurrentExamId] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const semesters = [
    { id: '1', name: 'Kỳ 1' },
    { id: '2', name: 'Kỳ 2' },
  ]

  const academicYears = [
    { id: '2025-2026', name: 'Năm học 2025-2026' },
    { id: '2024-2025', name: 'Năm học 2024-2025' },
    { id: '2023-2024', name: 'Năm học 2023-2024' },
  ]

  const classes = [
    { id: 'lop1', name: 'Lớp 10A1 - Toán cao cấp 1' },
    { id: 'lop2', name: 'Lớp 10A2 - Toán cao cấp 1' },
    { id: 'lop3', name: 'Lớp 10B1 - Vật lý đại cương' },
  ]

  const exams: ExamInfo[] = [
    {
      id: 1,
      name: 'Toán cao cấp 1 - Giữa kỳ',
      submissions: 45,
      graded: 42,
      pending: 3,
      totalScore: 10,
    },
    {
      id: 2,
      name: 'Toán cao cấp 1 - Quiz 1',
      submissions: 45,
      graded: 45,
      pending: 0,
      totalScore: 5,
    },
    {
      id: 3,
      name: 'Toán cao cấp 1 - Bài kiểm tra',
      submissions: 40,
      graded: 38,
      pending: 2,
      totalScore: 10,
    },
  ]

  const [submissions] = useState<StudentResult[]>([
    {
      id: 1,
      studentId: 'SV2026001',
      studentName: 'Nguyễn Văn A',
      submitTime: '15/03/2026 08:30',
      score: 8.5,
      totalQuestions: 50,
      correctAnswers: 42,
      totalTime: 45,
      status: 'Đã chấm',
    },
    {
      id: 2,
      studentId: 'SV2026002',
      studentName: 'Trần Thị B',
      submitTime: '15/03/2026 08:45',
      score: null,
      totalQuestions: 50,
      correctAnswers: 0,
      totalTime: 0,
      status: 'Chờ chấm',
    },
    {
      id: 3,
      studentId: 'SV2026003',
      studentName: 'Lê Văn C',
      submitTime: '15/03/2026 09:00',
      score: 7.2,
      totalQuestions: 50,
      correctAnswers: 36,
      totalTime: 52,
      status: 'Đã chấm',
    },
    {
      id: 4,
      studentId: 'SV2026004',
      studentName: 'Phạm Thị D',
      submitTime: '15/03/2026 09:15',
      score: null,
      totalQuestions: 50,
      correctAnswers: 0,
      totalTime: 0,
      status: 'Chờ chấm',
    },
    {
      id: 5,
      studentId: 'SV2026005',
      studentName: 'Hoàng Văn E',
      submitTime: '15/03/2026 09:30',
      score: 9.1,
      totalQuestions: 50,
      correctAnswers: 45,
      totalTime: 38,
      status: 'Đã chấm',
    },
  ])

  const currentExam = exams.find((e) => e.id === currentExamId)

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleExportExcel = () => {
    // Prepare CSV data
    const csvContent = [
      ['Mã sinh viên', 'Họ tên', 'Thời gian nộp', 'Số câu đúng', 'Điểm', 'Trạng thái'],
      ...filteredSubmissions.map((sub) => [
        sub.studentId,
        sub.studentName,
        sub.submitTime,
        sub.correctAnswers,
        sub.score || 'N/A',
        sub.status,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent))
    element.setAttribute('download', `${currentExam?.name}_ket_qua.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Xem kết quả thi
        </h1>
        <p className="text-slate-600">Xem thông tin chi tiết và xuất kết quả</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Exam Selection Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Chọn kỳ thi</h3>
          <div className="space-y-2">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setCurrentExamId(exam.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition ${
                  currentExamId === exam.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium text-slate-800 text-sm mb-1">{exam.name}</p>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>📊 Nộp: {exam.submissions}</p>
                  <p>✓ Chấm: {exam.graded}/{exam.submissions}</p>
                  {exam.pending > 0 && (
                    <p className="text-red-600 font-medium">⏳ Chờ: {exam.pending}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Exam Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <p className="text-slate-600 text-sm mb-1">Tổng nộp</p>
              <p className="text-3xl font-bold text-indigo-600">{currentExam?.submissions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <p className="text-slate-600 text-sm mb-1">Đã chấm</p>
              <p className="text-3xl font-bold text-green-600">{currentExam?.graded}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <p className="text-slate-600 text-sm mb-1">Chờ chấm</p>
              <p className="text-3xl font-bold text-red-600">{currentExam?.pending}</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã sinh viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>


          </div>

          {/* Export Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <Download size={20} />
              Xuất Excel
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Mã SV</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Họ tên</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Thời gian nộp</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Câu đúng</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Điểm</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Trạng thái</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{sub.studentId}</td>
                        <td className="px-6 py-4 text-sm text-slate-700">{sub.studentName}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            {sub.submitTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-semibold text-slate-700">
                          {sub.correctAnswers}/{sub.totalQuestions}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          {sub.score !== null ? (
                            <span className="font-bold text-lg text-indigo-600">{sub.score}</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          {sub.status === 'Đã chấm' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              <CheckCircle size={14} />
                              Đã chấm
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                              <Clock size={14} />
                              Chờ chấm
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-center">
                          <button
                            className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 justify-center"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                        Không tìm thấy kết quả phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
