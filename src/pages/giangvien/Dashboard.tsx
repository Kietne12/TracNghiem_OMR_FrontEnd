import DashboardLayout from "../../layout/DashboardLayout"
import { Users, BookOpen, FileText, TrendingUp, Calendar, Clock } from 'lucide-react'

export default function TeacherDashboard() {
  const stats = {
    studentsCount: 125,
    examsCreated: 12,
    questionsBank: 456,
    avgClassScore: 7.6
  }

  const recentExams = [
    { id: 1, name: 'Toán cao cấp 1 - Giữa kỳ', date: '15/03/2026', submissions: 45, graded: 42 },
    { id: 2, name: 'Vật lý đại cương - Cuối kỳ', date: '12/03/2026', submissions: 48, graded: 48 },
    { id: 3, name: 'Hóa học - Quiz 1', date: '10/03/2026', submissions: 50, graded: 50 },
  ]

  const pendingGrading = [
    { id: 1, exam: 'Lập trình C++ - Bài kiểm tra', date: '16/03/2026', count: 3 },
    { id: 2, exam: 'Tiếng Anh - Listening', date: '14/03/2026', count: 5 },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          Xin chào, Giáo viên!
        </h1>
        <p className="text-slate-600">Quản lý các kỳ thi và học sinh của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Số học sinh</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.studentsCount}</p>
            </div>
            <Users size={32} className="text-indigo-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Kỳ thi tạo</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.examsCreated}</p>
            </div>
            <FileText size={32} className="text-cyan-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Câu hỏi</p>
              <p className="text-3xl font-bold text-green-600">{stats.questionsBank}</p>
            </div>
            <BookOpen size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Điểm trung bình lớp</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.avgClassScore}</p>
            </div>
            <TrendingUp size={32} className="text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={24} className="text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-800">Kỳ thi gần đây</h2>
          </div>
          <div className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800">{exam.name}</h3>
                  <span className="text-xs text-slate-500">{exam.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{exam.submissions} nộp bài</span>
                  <span>{exam.graded}/{exam.submissions} đã chấm</span>
                </div>
                <div className="mt-2 bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: `${(exam.graded / exam.submissions) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Grading */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={24} className="text-red-600" />
            <h2 className="text-xl font-bold text-slate-800">Chờ chấm điểm</h2>
          </div>
          <div className="space-y-4">
            {pendingGrading.length > 0 ? (
              pendingGrading.map((item) => (
                <div
                  key={item.id}
                  className="border-l-4 border-red-500 bg-red-50 rounded-lg p-4 hover:bg-red-100 transition cursor-pointer"
                >
                  <h3 className="font-semibold text-slate-800 mb-1">{item.exam}</h3>
                  <p className="text-sm text-slate-600 mb-3">{item.date}</p>
                  <div className="flex justify-between items-center">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      {item.count} bài chờ
                    </span>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                      Chấm ngay →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">Không có bài chờ chấm</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:shadow-lg text-white rounded-lg p-6 flex items-center gap-4 transition group">
          <FileText size={32} className="group-hover:scale-110 transition" />
          <div className="text-left">
            <p className="font-semibold text-sm">Tạo kỳ thi mới</p>
            <p className="text-indigo-200 text-xs">Tạo đề thi mới cho lớp</p>
          </div>
        </button>
        <button className="bg-gradient-to-br from-cyan-600 to-cyan-700 hover:shadow-lg text-white rounded-lg p-6 flex items-center gap-4 transition group">
          <BookOpen size={32} className="group-hover:scale-110 transition" />
          <div className="text-left">
            <p className="font-semibold text-sm">Ngân hàng câu hỏi</p>
            <p className="text-cyan-200 text-xs">Quản lý câu hỏi</p>
          </div>
        </button>
        <button className="bg-gradient-to-br from-green-600 to-green-700 hover:shadow-lg text-white rounded-lg p-6 flex items-center gap-4 transition group">
          <Users size={32} className="group-hover:scale-110 transition" />
          <div className="text-left">
            <p className="font-semibold text-sm">Quản lý học sinh</p>
            <p className="text-green-200 text-xs">Xem kết quả học sinh</p>
          </div>
        </button>
      </div>
    </DashboardLayout>
  )
}
