import DashboardLayout from "../../layout/DashboardLayout"
import { BarChart as BarChartIcon, Filter, Download, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface ExamStatistics {
  examId: number
  examName: string
  totalStudents: number
  averageScore: number
  passCount: number
  failCount: number
  easyQuestionStats: { correct: number; total: number; percentage: number }
  normalQuestionStats: { correct: number; total: number; percentage: number }
  hardQuestionStats: { correct: number; total: number; percentage: number }
  scoreDistribution: { score: string; count: number }[]
}

export default function ThongKeDiemThi() {
  const [selectedClass, setSelectedClass] = useState('lop1')
  const [selectedExam, setSelectedExam] = useState(1)

  const classes = [
    { id: 'lop1', name: 'Lớp 10A1 - Toán cao cấp 1' },
    { id: 'lop2', name: 'Lớp 10A2 - Toán cao cấp 1' },
    { id: 'lop3', name: 'Lớp 10B1 - Vật lý đại cương' },
  ]

  const exams = [
    { id: 1, name: 'Toán cao cấp 1 - Giữa kỳ', totalScore: 10 },
    { id: 2, name: 'Toán cao cấp 1 - Quiz 1', totalScore: 5 },
    { id: 3, name: 'Toán cao cấp 1 - Bài kiểm tra', totalScore: 10 },
  ]

  const [statistics] = useState<ExamStatistics>({
    examId: 1,
    examName: 'Toán cao cấp 1 - Giữa kỳ',
    totalStudents: 45,
    averageScore: 7.2,
    passCount: 41,
    failCount: 4,
    easyQuestionStats: { correct: 1890, total: 2250, percentage: 84 },
    normalQuestionStats: { correct: 1350, total: 2250, percentage: 60 },
    hardQuestionStats: { correct: 450, total: 1125, percentage: 40 },
    scoreDistribution: [
      { score: '8.0-10.0', count: 18 },
      { score: '7.0-7.9', count: 15 },
      { score: '6.0-6.9', count: 8 },
      { score: '5.0-5.9', count: 3 },
      { score: '< 5.0', count: 1 },
    ],
  })

  const handleExportExcel = () => {
    // Prepare CSV data
    const csvContent = [
      ['Thống kê điểm thi: ' + statistics.examName],
      [],
      ['Tổng số sinh viên', statistics.totalStudents],
      ['Điểm trung bình', statistics.averageScore],
      ['Số sinh viên đạt', statistics.passCount],
      ['Số sinh viên không đạt', statistics.failCount],
      [],
      ['Thống kê theo độ khó'],
      ['Độ khó', 'Câu đúng', 'Tổng câu', '% Đúng'],
      ['Dễ', statistics.easyQuestionStats.correct, statistics.easyQuestionStats.total, statistics.easyQuestionStats.percentage + '%'],
      ['Bình thường', statistics.normalQuestionStats.correct, statistics.normalQuestionStats.total, statistics.normalQuestionStats.percentage + '%'],
      ['Khó', statistics.hardQuestionStats.correct, statistics.hardQuestionStats.total, statistics.hardQuestionStats.percentage + '%'],
    ]
      .map((row) => row.join(','))
      .join('\n')

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent))
    element.setAttribute('download', `${statistics.examName}_thong_ke.csv`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Thống kê điểm thi
          </h1>
          <p className="text-slate-600">Phân tích kết quả thi theo độ khó của câu hỏi</p>
        </div>
        <button
          onClick={handleExportExcel}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <Download size={20} />
          Xuất Excel
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <BarChartIcon size={16} className="inline mr-2" />
            Chọn kỳ thi
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Tổng sinh viên</p>
          <p className="text-4xl font-bold text-indigo-600">{statistics.totalStudents}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Điểm trung bình</p>
          <p className="text-4xl font-bold text-cyan-600">{statistics.averageScore.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Đạt yêu cầu</p>
          <p className="text-4xl font-bold text-green-600">{statistics.passCount}</p>
          <p className="text-xs text-slate-600 mt-1">
            {((statistics.passCount / statistics.totalStudents) * 100).toFixed(1)}% lớp
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <p className="text-slate-600 text-sm mb-2">Không đạt</p>
          <p className="text-4xl font-bold text-red-600">{statistics.failCount}</p>
          <p className="text-xs text-slate-600 mt-1">
            {((statistics.failCount / statistics.totalStudents) * 100).toFixed(1)}% lớp
          </p>
        </div>
      </div>

      {/* Difficulty Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Easy Questions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-lg mb-2">Câu hỏi DỄ</h3>
            <p className="text-sm text-slate-600">Phần trăm học sinh trả lời đúng</p>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-center h-32 gap-1 bg-gradient-to-t from-green-50 to-transparent p-4 rounded-lg">
              <div
                className="w-12 bg-green-500 rounded-t flex items-end justify-center text-white font-bold"
                style={{ height: `${statistics.easyQuestionStats.percentage}%` }}
              >
                <span className="text-xs mb-2">{statistics.easyQuestionStats.percentage}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Câu đúng:</span>
              <span className="font-semibold text-slate-800">{statistics.easyQuestionStats.correct}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tổng câu:</span>
              <span className="font-semibold text-slate-800">{statistics.easyQuestionStats.total}</span>
            </div>
          </div>
        </div>

        {/* Normal Questions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-lg mb-2">Câu hỏi BÌNH THƯỜNG</h3>
            <p className="text-sm text-slate-600">Phần trăm học sinh trả lời đúng</p>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-center h-32 gap-1 bg-gradient-to-t from-yellow-50 to-transparent p-4 rounded-lg">
              <div
                className="w-12 bg-yellow-500 rounded-t flex items-end justify-center text-slate-800 font-bold"
                style={{ height: `${statistics.normalQuestionStats.percentage}%` }}
              >
                <span className="text-xs mb-2">{statistics.normalQuestionStats.percentage}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Câu đúng:</span>
              <span className="font-semibold text-slate-800">{statistics.normalQuestionStats.correct}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tổng câu:</span>
              <span className="font-semibold text-slate-800">{statistics.normalQuestionStats.total}</span>
            </div>
          </div>
        </div>

        {/* Hard Questions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800 text-lg mb-2">Câu hỏi KHÓ</h3>
            <p className="text-sm text-slate-600">Phần trăm học sinh trả lời đúng</p>
          </div>

          <div className="mb-6">
            <div className="flex items-end justify-center h-32 gap-1 bg-gradient-to-t from-red-50 to-transparent p-4 rounded-lg">
              <div
                className="w-12 bg-red-500 rounded-t flex items-end justify-center text-white font-bold"
                style={{ height: `${statistics.hardQuestionStats.percentage}%` }}
              >
                <span className="text-xs mb-2">{statistics.hardQuestionStats.percentage}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Câu đúng:</span>
              <span className="font-semibold text-slate-800">{statistics.hardQuestionStats.correct}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tổng câu:</span>
              <span className="font-semibold text-slate-800">{statistics.hardQuestionStats.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 text-lg mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-600" />
          Phân bố điểm theo khoảng
        </h3>

        <div className="space-y-4">
          {statistics.scoreDistribution.map((dist, idx) => (
            <div key={idx}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{dist.score}</span>
                <span className="text-sm font-semibold text-slate-800">
                  {dist.count} sinh viên ({((dist.count / statistics.totalStudents) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full"
                  style={{ width: `${(dist.count / Math.max(...statistics.scoreDistribution.map((d) => d.count))) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Notes */}
      <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h4 className="font-semibold text-blue-900 mb-3">📊 Phân tích</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            • Câu dễ: <strong>{statistics.easyQuestionStats.percentage}%</strong> sinh viên trả lời đúng - Lớp nắm vững kiến thức cơ bản
          </li>
          <li>
            • Câu bình thường: <strong>{statistics.normalQuestionStats.percentage}%</strong> sinh viên trả lời đúng - Mức độ hiểu biết ở mức trung bình
          </li>
          <li>
            • Câu khó: <strong>{statistics.hardQuestionStats.percentage}%</strong> sinh viên trả lời đúng - Cần ôn luyện thêm về các kiến thức nâng cao
          </li>
          <li>• Tỷ lệ đạt: <strong>{((statistics.passCount / statistics.totalStudents) * 100).toFixed(1)}%</strong> - {statistics.passCount} / {statistics.totalStudents} sinh viên</li>
        </ul>
      </div>
    </DashboardLayout>
  )
}
