import DashboardLayout from "../../layout/DashboardLayout"
import { CheckCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from "../../hooks/useAuth"

export default function ChamBai() {
  const { user } = useAuth()
  const [currentExamId, setCurrentExamId] = useState(1)

  const exams = [
    { id: 1, name: 'Toán cao cấp 1', submissions: 45, graded: 42, pending: 3 },
    { id: 2, name: 'Vật lý đại cương', submissions: 48, graded: 48, pending: 0 },
    { id: 3, name: 'Hóa học', submissions: 50, graded: 45, pending: 5 },
  ]

  const submissions = [
    { id: 1, studentId: 'SV2026001', studentName: 'Nguyễn Văn A', submitTime: '15/03/2026 08:30', score: 8.5, status: 'Đã chấm' },
    { id: 2, studentId: 'SV2026002', studentName: 'Trần Thị B', submitTime: '15/03/2026 08:45', score: null, status: 'Chờ chấm' },
    { id: 3, studentId: 'SV2026003', studentName: 'Lê Văn C', submitTime: '15/03/2026 09:00', score: 7.2, status: 'Đã chấm' },
    { id: 4, studentId: 'SV2026004', studentName: 'Phạm Thị D', submitTime: '15/03/2026 09:15', score: null, status: 'Chờ chấm' },
  ]

  const currentExam = exams.find(e => e.id === currentExamId)

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Chấm bài thi
        </h1>
        <p className="text-slate-600">Chấm điểm bài thi của học sinh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Exam Selection */}
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
                  <p>Nộp: {exam.submissions}</p>
                  <p>Chấm: {exam.graded}/{exam.submissions}</p>
                  {exam.pending > 0 && (
                    <p className="text-red-600 font-medium">Chờ: {exam.pending}</p>
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

          {/* Submissions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-indigo-600" />
              Danh sách bài nộp
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">MSSV</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tên sinh viên</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Thời gian nộp</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Điểm</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Trạng thái</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-sm text-slate-700 font-medium">{sub.studentId}</td>
                      <td className="py-3 px-4 text-sm text-slate-800 font-medium">{sub.studentName}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{sub.submitTime}</td>
                      <td className="py-3 px-4 text-center">
                        {sub.score !== null ? (
                          <span className="font-bold text-lg text-indigo-600">{sub.score}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {sub.status === 'Đã chấm' ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center gap-1">
                            <CheckCircle size={14} />
                            {sub.status}
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center gap-1">
                            <Clock size={14} />
                            {sub.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                          Chấm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
