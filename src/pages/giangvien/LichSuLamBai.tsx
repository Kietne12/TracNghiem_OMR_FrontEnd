import DashboardLayout from "../../layout/DashboardLayout"
import { Filter, Search, Calendar, Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface StudentAttempt {
  id: number
  studentId: string
  studentName: string
  testName: string
  testType: 'exam' | 'practice' | 'quiz'
  attemptNumber: number
  startTime: string
  endTime: string
  totalTime: number
  correctAnswers: number
  totalQuestions: number
  score: number
  status: 'Hoàn thành' | 'Chưa hoàn thành'
}

export default function LichSuLamBai() {
  const [selectedClass, setSelectedClass] = useState('lop1')
  const [selectedTest, setSelectedTest] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const classes = [
    { id: 'lop1', name: 'Lớp 10A1 - Toán cao cấp 1' },
    { id: 'lop2', name: 'Lớp 10A2 - Toán cao cấp 1' },
    { id: 'lop3', name: 'Lớp 10B1 - Vật lý đại cương' },
  ]

  const tests = [
    { id: 'all', name: 'Tất cả' },
    { id: 'test1', name: 'Toán cao cấp 1 - Giữa kỳ' },
    { id: 'test2', name: 'Toán cao cấp 1 - Quiz 1' },
    { id: 'practice1', name: 'Bài tập Chương 1' },
    { id: 'practice2', name: 'Bài tập Chương 2' },
  ]

  const [attempts] = useState<StudentAttempt[]>([
    {
      id: 1,
      studentId: 'SV2026001',
      studentName: 'Nguyễn Văn A',
      testName: 'Toán cao cấp 1 - Giữa kỳ',
      testType: 'exam',
      attemptNumber: 1,
      startTime: '15/03/2026 08:30',
      endTime: '15/03/2026 09:15',
      totalTime: 45,
      correctAnswers: 42,
      totalQuestions: 50,
      score: 8.5,
      status: 'Hoàn thành',
    },
    {
      id: 2,
      studentId: 'SV2026001',
      studentName: 'Nguyễn Văn A',
      testName: 'Bài tập Chương 1',
      testType: 'practice',
      attemptNumber: 1,
      startTime: '14/03/2026 10:00',
      endTime: '14/03/2026 10:25',
      totalTime: 25,
      correctAnswers: 28,
      totalQuestions: 30,
      score: 9.3,
      status: 'Hoàn thành',
    },
    {
      id: 3,
      studentId: 'SV2026001',
      studentName: 'Nguyễn Văn A',
      testName: 'Bài tập Chương 1',
      testType: 'practice',
      attemptNumber: 2,
      startTime: '16/03/2026 14:00',
      endTime: '16/03/2026 14:20',
      totalTime: 20,
      correctAnswers: 30,
      totalQuestions: 30,
      score: 10.0,
      status: 'Hoàn thành',
    },
    {
      id: 4,
      studentId: 'SV2026002',
      studentName: 'Trần Thị B',
      testName: 'Toán cao cấp 1 - Giữa kỳ',
      testType: 'exam',
      attemptNumber: 1,
      startTime: '15/03/2026 08:45',
      endTime: '15/03/2026 10:00',
      totalTime: 75,
      correctAnswers: 38,
      totalQuestions: 50,
      score: 7.6,
      status: 'Hoàn thành',
    },
    {
      id: 5,
      studentId: 'SV2026002',
      studentName: 'Trần Thị B',
      testName: 'Toán cao cấp 1 - Quiz 1',
      testType: 'quiz',
      attemptNumber: 1,
      startTime: '16/03/2026 09:00',
      endTime: '16/03/2026 09:10',
      totalTime: 10,
      correctAnswers: 8,
      totalQuestions: 20,
      score: 4.0,
      status: 'Hoàn thành',
    },
    {
      id: 6,
      studentId: 'SV2026003',
      studentName: 'Lê Văn C',
      testName: 'Bài tập Chương 2',
      testType: 'practice',
      attemptNumber: 1,
      startTime: '16/03/2026 13:00',
      endTime: '',
      totalTime: 0,
      correctAnswers: 0,
      totalQuestions: 25,
      score: 0,
      status: 'Chưa hoàn thành',
    },
  ])

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch =
      attempt.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attempt.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTest = selectedTest === 'all' || attempt.testName === tests.find((t) => t.id === selectedTest)?.name
    const matchesStatus = statusFilter === 'all' || attempt.status === statusFilter
    return matchesSearch && matchesTest && matchesStatus
  })

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-800'
      case 'quiz':
        return 'bg-blue-100 text-blue-800'
      case 'practice':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getTestTypeLabel = (type: string) => {
    switch (type) {
      case 'exam':
        return '📝 Kỳ thi'
      case 'quiz':
        return '❓ Quiz'
      case 'practice':
        return '📚 Luyện tập'
      default:
        return 'Unknown'
    }
  }

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Lịch sử làm bài của học sinh
        </h1>
        <p className="text-slate-600">Xem chi tiết các lần làm bài của từng sinh viên</p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Chọn lớp
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Chọn bài kiểm tra/thi/luyện tập
          </label>
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <Filter size={16} className="inline mr-2" />
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Tất cả</option>
            <option value="Hoàn thành">✓ Hoàn thành</option>
            <option value="Chưa hoàn thành">⏳ Chưa hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
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

      {/* Attempts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Sinh viên</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Bài thi/tập</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Loại</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Lần</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Thời gian bắt đầu</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Thời gian làm</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Kết quả</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.length > 0 ? (
                filteredAttempts.map((attempt, idx) => (
                  <tr
                    key={attempt.id}
                    className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-800">{attempt.studentName}</p>
                        <p className="text-xs text-slate-600">{attempt.studentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{attempt.testName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTestTypeColor(attempt.testType)}`}>
                        {getTestTypeLabel(attempt.testType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-slate-800">
                      Lần {attempt.attemptNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {attempt.startTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {attempt.totalTime > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="font-semibold text-slate-800">{attempt.totalTime} phút</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {attempt.status === 'Hoàn thành' ? (
                        <div>
                          <p className="font-bold text-lg text-indigo-600">{attempt.score.toFixed(1)}</p>
                          <p className="text-xs text-slate-600">
                            {attempt.correctAnswers}/{attempt.totalQuestions} đúng
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {attempt.status === 'Hoàn thành' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle size={14} />
                          Hoàn thành
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          <Clock size={14} />
                          Chưa xong
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy lịch sử làm bài phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-900 mb-3">📊 Tóm tắt</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
          <div>
            <p className="text-blue-600 font-semibold">Tổng lần làm</p>
            <p className="text-2xl font-bold">{filteredAttempts.length}</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">Hoàn thành</p>
            <p className="text-2xl font-bold">{filteredAttempts.filter((a) => a.status === 'Hoàn thành').length}</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">Chưa hoàn thành</p>
            <p className="text-2xl font-bold">{filteredAttempts.filter((a) => a.status === 'Chưa hoàn thành').length}</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">Trung bình điểm</p>
            <p className="text-2xl font-bold">
              {(
                filteredAttempts
                  .filter((a) => a.status === 'Hoàn thành')
                  .reduce((sum, a) => sum + a.score, 0) / filteredAttempts.filter((a) => a.status === 'Hoàn thành').length
              ).toFixed(1) || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
