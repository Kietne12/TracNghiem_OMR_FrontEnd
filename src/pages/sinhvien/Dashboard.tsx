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
import { useState } from "react"

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

  /* =========================
     Chọn học kỳ + năm học
  ========================== */

  const [semester, setSemester] = useState("")
  const [year, setYear] = useState("")

  /* =========================
     Điểm các môn đã học
  ========================== */

  const subjects = [
    { subject: "Toán cao cấp", score: 8.5, semester: "HK2", year: "2025-2026" },
    { subject: "Cấu trúc dữ liệu", score: 7.2, semester: "HK2", year: "2025-2026" },
    { subject: "Lập trình C++", score: 8.1, semester: "HK2", year: "2025-2026" }
  ]

  const filteredSubjects = subjects.filter(
    s => s.semester === semester && s.year === year
  )

  /* =========================
     Điểm trung bình tất cả môn
  ========================== */

  const avgScore =
    subjects.length > 0
      ? (
        subjects.reduce((sum, s) => sum + s.score, 0) /
        subjects.length
      ).toFixed(2)
      : "0"

  /* =========================
     Tiến độ học tập
  ========================== */

  const totalSubjects = 64
  const completedSubjects = subjects.length

  const progress =
    ((completedSubjects / totalSubjects) * 100).toFixed(1)

  /* =========================
     Kỳ thi
  ========================== */

  const exams = [
    {
      id: 1,
      subject: "Cấu trúc dữ liệu",
      date: "2026-03-15",
      time: "08:00",
      duration: 90
    },
    {
      id: 2,
      subject: "Toán cao cấp",
      date: "2026-03-16",
      time: "13:00",
      duration: 60
    }
  ]

  const nextExam = exams[0]

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
          Xin chào, {studentInfo.name}!
        </h1>

        <p className="text-slate-600">
          Chào mừng bạn quay lại hệ thống thi trắc nghiệm
        </p>

      </div>

      {/* Student Info */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

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

      </div>

      {/* Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">

          {/* Kỳ thi */}

          <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">

            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold">
                Kỳ thi sắp diễn ra
              </h2>
            </div>

            {exams.map(exam => (

              <div
                key={exam.id}
                className="border rounded-lg p-4 mb-4"
              >

                <h3 className="font-semibold">
                  {exam.subject}
                </h3>

                <p className="text-sm text-slate-600">
                  {exam.date} - {exam.time}
                </p>

                <button
                  onClick={() => navigate(`/sinhvien/lam-bai/${exam.id}`)}
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                >
                  Vào thi
                </button>

              </div>

            ))}

          </div>

          {/* Biểu đồ */}

          <div className="bg-white border rounded-lg p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-4">

              <TrendingUp size={22} className="text-green-600" />

              <h2 className="text-xl font-bold">
                Biểu đồ điểm
              </h2>

            </div>

            {/* Select */}

            <div className="flex gap-3 mb-4">

              <select
                className="border rounded p-2"
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                <option value="">Chọn học kỳ</option>
                <option value="HK1">HK1</option>
                <option value="HK2">HK2</option>
              </select>

              <select
                className="border rounded p-2"
                value={year}
                onChange={e => setYear(e.target.value)}
              >
                <option value="">Chọn năm học</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2024-2025">2024-2025</option>
              </select>

            </div>

            {filteredSubjects.length > 0 ? (

              <ResponsiveContainer width="100%" height={250}>

                <BarChart data={filteredSubjects}>

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

            ) : (

              <p className="text-slate-500">
                Hãy chọn học kỳ và năm học để xem biểu đồ
              </p>

            )}

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

          {/* Progress */}

          <div className="bg-white border rounded-lg p-6 shadow-sm">

            <h3 className="font-bold mb-4 flex items-center gap-2">

              <CheckCircle size={18} className="text-green-600" />

              Tiến độ học tập

            </h3>

            <div className="mb-2 flex justify-between text-sm">

              <span>Hoàn thành</span>

              <span>
                {completedSubjects}/{totalSubjects} môn
              </span>

            </div>

            <div className="w-full bg-slate-200 rounded-full h-3">

              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${progress}%` }}
              />

            </div>

            <p className="text-sm text-slate-500 mt-2">
              {progress}% chương trình
            </p>

          </div>

          {/* Quick */}

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