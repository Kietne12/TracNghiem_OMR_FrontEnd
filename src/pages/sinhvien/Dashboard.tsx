import DashboardLayout from "../../layout/DashboardLayout"
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  Brain
} from "lucide-react"

import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

export default function Dashboard() {

  const { user } = useAuth() as any
  const navigate = useNavigate()

  const studentInfo = {
    name: user?.name || "Sinh viên",
    studentId: user?.studentId || "SV2026001",
    class: user?.class || "Lớp A1 - Khóa 2024",
  }

  // Danh sách toàn bộ kỳ thi (giống trang DanhSachKyThi)
  const allExams = [
    {
      id: 1,
      subject: "Cấu trúc dữ liệu",
      status: "Đang diễn ra",
      date: "2026-03-15",
      time: "08:00",
      duration: 90
    },
    {
      id: 2,
      subject: "Toán cao cấp",
      status: "Sắp diễn ra",
      date: "2026-03-16",
      time: "13:00",
      duration: 60
    },
    {
      id: 3,
      subject: "Lập trình C++",
      status: "Đã kết thúc",
      date: "2026-03-18",
      time: "10:00",
      duration: 120
    }
  ]

  const upcomingExams = allExams.filter(
    exam => exam.status !== "Đã kết thúc"
  )

  const completedExams = allExams.filter(
    exam => exam.status === "Đã kết thúc"
  )

  const totalExams = allExams.length

  const progress =
    totalExams > 0
      ? ((completedExams.length / totalExams) * 100).toFixed(0)
      : 0

  // Kết quả gần đây
  const recentResults = [
    { subject: "Toán", score: 8.5 },
    { subject: "CTDL", score: 7.2 },
    { subject: "C++", score: 8.1 }
  ]

  const avgScore =
    recentResults.length > 0
      ? (
        recentResults.reduce((sum, r) => sum + r.score, 0) /
        recentResults.length
      ).toFixed(1)
      : "0"

  const nextExam = upcomingExams[0]

  const calculateCountdown = (date: string) => {

    const examDate = new Date(date)
    const now = new Date()

    const diff = examDate.getTime() - now.getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    return days > 0 ? `${days} ngày nữa` : "Sắp diễn ra"

  }

  return (
    <DashboardLayout role="SINH VIÊN">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Xin chào, Trần Văn B!
        </h1>

        <p className="text-slate-600">
          Chào mừng bạn quay lại hệ thống thi trắc nghiệm
        </p>

      </div>


      {/* Student Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">MSSV</p>
          <p className="text-2xl font-bold">{studentInfo.studentId}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">Lớp học</p>
          <p className="text-lg font-semibold">{studentInfo.class}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">Điểm trung bình</p>
          <p className="text-2xl font-bold text-green-600">{avgScore}/10</p>
        </div>

        {/* Card tổng bài thi đã sửa đúng */}
        <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg p-6 text-white">

          <p className="text-sm text-cyan-100 mb-2">
            Tổng bài thi
          </p>

          <p className="text-3xl font-bold">
            {totalExams}
          </p>

        </div>

      </div>


      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


        {/* Upcoming Exams */}
        <div className="lg:col-span-2">

          <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">

            <div className="flex items-center gap-2 mb-6">

              <Calendar className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold">
                Kỳ thi sắp diễn ra
              </h2>

            </div>

            <div className="space-y-4">

              {upcomingExams.map((exam) => (

                <div
                  key={exam.id}
                  className="border rounded-lg p-4 hover:bg-slate-50"
                >

                  <div className="flex justify-between mb-2">

                    <div>

                      <h3 className="font-semibold">
                        {exam.subject}
                      </h3>

                      <div className="flex gap-4 text-sm text-slate-600">

                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {exam.date}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {exam.time}
                        </span>

                      </div>

                    </div>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {exam.duration} phút
                    </span>

                  </div>

                  <button
                    onClick={() => navigate(`/sinhvien/lam-bai/${exam.id}`)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                  >
                    Vào thi
                  </button>

                </div>

              ))}

            </div>

          </div>


          {/* Biểu đồ điểm */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-6">

              <TrendingUp size={22} className="text-green-600" />

              <h2 className="text-xl font-bold">
                Biểu đồ điểm
              </h2>

            </div>

            <ResponsiveContainer width="100%" height={250}>

              <BarChart data={recentResults}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="subject" />

                <YAxis domain={[0, 10]} />

                <Tooltip />

                <Bar
                  dataKey="score"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Sidebar */}
        <div className="space-y-6">


          {/* Kỳ thi gần nhất */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">

            <h3 className="font-bold mb-4 flex items-center gap-2">

              <Clock size={18} className="text-indigo-600" />

              Kỳ thi gần nhất

            </h3>

            <p className="font-semibold text-lg">
              {nextExam.subject}
            </p>

            <p className="text-slate-600 text-sm">
              {nextExam.date} - {nextExam.time}
            </p>

            <p className="mt-2 text-indigo-600 font-medium">
              {calculateCountdown(nextExam.date)}
            </p>

          </div>


          {/* Progress học tập */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">

            <h3 className="font-bold mb-4 flex items-center gap-2">

              <CheckCircle size={18} className="text-green-600" />

              Tiến độ học tập

            </h3>

            <div className="mb-2 flex justify-between text-sm">

              <span>Hoàn thành</span>

              <span>
                {completedExams.length}/{totalExams}
              </span>

            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">

              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              />

            </div>

            <p className="text-sm text-slate-500 mt-2">
              {progress}% hoàn thành
            </p>

          </div>


          {/* Quick Actions */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">

            <h3 className="font-bold mb-4">
              Nhanh chóng
            </h3>

            <div className="space-y-2">

              <button
                onClick={() => navigate("/sinhvien/ky-thi")}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-100"
              >

                <FileText size={18} className="text-indigo-600" />

                Danh sách kỳ thi

              </button>

              <button
                onClick={() => navigate("/sinhvien/luyen-tap")}
                className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-slate-100"
              >

                <Brain size={18} className="text-cyan-600" />

                Luyện tập

              </button>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}