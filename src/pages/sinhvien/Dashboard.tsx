import DashboardLayout from "../../layout/DashboardLayout"
import { BookOpen, CheckCircle, Clock, TrendingUp, Calendar, FileText } from 'lucide-react'
import { useAuth } from "../../hooks/useAuth"

export default function Dashboard() {
  const { account } = useAuth()
  const studentInfo = {
    name: 'Nguyễn Văn A',
    studentId: 'SV2026001',
    class: 'Lớp A1 - Khóa 2024',
    gpa: 3.8
  }

  const upcomingExams = [
    { id: 1, subject: 'Toán cao cấp 1', date: '15/03/2026', time: '08:00', duration: 90 },
    { id: 2, subject: 'Vật lý đại cương', date: '16/03/2026', time: '13:00', duration: 60 },
    { id: 3, subject: 'Lập trình C++', date: '18/03/2026', time: '10:00', duration: 120 },
  ]

  const recentResults = [
    { id: 1, subject: 'Tiếng Anh cơ bản', score: 8.5, date: '01/03/2026', maxScore: 10 },
    { id: 2, subject: 'Hóa học đại cương', score: 7.2, date: '28/02/2026', maxScore: 10 },
    { id: 3, subject: 'Sinh học phân tử', score: 8.1, date: '25/02/2026', maxScore: 10 },
  ]

  return (
    <DashboardLayout role="SINH VIÊN">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Xin chào, {studentInfo.name}!
        </h1>
        <p className="text-slate-600">Chào mừng bạn trở lại SmartQuiz</p>
      </div>

      {/* Student Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <p className="text-slate-600 text-sm mb-2">MSSV</p>
          <p className="text-2xl font-bold text-slate-800">{studentInfo.studentId}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <p className="text-slate-600 text-sm mb-2">Lớp học</p>
          <p className="text-lg font-semibold text-slate-800">{studentInfo.class}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <p className="text-slate-600 text-sm mb-2">GPA</p>
          <p className="text-2xl font-bold text-green-600">{studentInfo.gpa}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg shadow-sm p-6 text-white">
          <p className="text-cyan-100 text-sm mb-2">Số bài thi</p>
          <p className="text-3xl font-bold">{upcomingExams.length + recentResults.length}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Exams - 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={24} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-800">Kỳ thi sắp diễn ra</h2>
            </div>
            <div className="space-y-4">
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <div key={exam.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{exam.subject}</h3>
                        <div className="flex gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={16} /> {exam.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={16} /> {exam.time}
                          </span>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {exam.duration} phút
                      </span>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition font-medium text-sm">
                      Vào thi
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-center py-8">Không có kỳ thi sắp diễn ra</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-green-600" />
              <h3 className="font-bold text-slate-800">Thành tích</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Điểm trung bình</span>
                  <span className="font-semibold text-slate-800">7.9/10</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-2 rounded-full" style={{ width: '79%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600">Hoàn thành</span>
                  <span className="font-semibold text-slate-800">15/20</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Nhanh chóng</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-100 transition text-left">
                <FileText size={18} className="text-indigo-600" />
                <span className="font-medium text-slate-700">Xem kết quả</span>
              </button>
              <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-100 transition text-left">
                <BookOpen size={18} className="text-cyan-600" />
                <span className="font-medium text-slate-700">Tài liệu học</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle size={24} className="text-green-600" />
          <h2 className="text-xl font-bold text-slate-800">Kết quả thi gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Môn thi</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Ngày thi</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Điểm</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Xếp loại</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result) => (
                <tr key={result.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-800 font-medium">{result.subject}</td>
                  <td className="py-3 px-4 text-slate-600">{result.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-lg text-indigo-600">{result.score}/{result.maxScore}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {result.score >= 8.5 && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Giỏi</span>}
                    {result.score >= 7 && result.score < 8.5 && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Khá</span>}
                    {result.score < 7 && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">Trung bình</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}