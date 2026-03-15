import DashboardLayout from "../../layout/DashboardLayout"
import { CheckCircle, XCircle, Award, Clock } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

export default function KetQuaThi() {

  const location = useLocation()
  const navigate = useNavigate()

  const result = location.state || null

  if (!result) {
    return (
      <DashboardLayout role="SINH VIÊN">
        <div className="text-center mt-20">

          <h2 className="text-2xl font-bold text-slate-700">
            Không có dữ liệu bài thi
          </h2>

          <button
            onClick={() => navigate("/sinhvien/ky-thi")}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Quay lại danh sách kỳ thi
          </button>

        </div>
      </DashboardLayout>
    )
  }

  const wrong = result.total - result.correct
  const percent = ((result.correct / result.total) * 100).toFixed(0)

  const getRank = () => {
    const score = Number(result.score)

    if (score >= 8.5) return "Giỏi"
    if (score >= 7) return "Khá"
    if (score >= 5) return "Trung bình"
    return "Chưa đạt"
  }

  // format thời gian làm bài
  let timeDisplay = "--"

  if (result.timeUsed !== undefined) {

    const minutes = Math.floor(result.timeUsed / 60)
    const seconds = result.timeUsed % 60

    timeDisplay = `${minutes}p ${seconds}s`
  }

  return (
    <DashboardLayout role="SINH VIÊN">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Kết quả bài thi
          </h1>

          <p className="text-slate-600">
            {result.examName}
          </p>

        </div>

        {/* Score Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 text-center mb-8">

          <div className="text-6xl font-bold text-indigo-600 mb-4">
            {result.score}/10
          </div>

          <p className="text-slate-600 text-lg">
            Điểm số
          </p>

          <p className="text-sm text-slate-500 mt-2">
            Xếp loại: <span className="font-semibold">{getRank()}</span>
          </p>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

          <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={28} />
            <p className="text-2xl font-bold">{result.correct}</p>
            <p className="text-sm text-slate-500">Câu đúng</p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
            <XCircle className="mx-auto text-red-500 mb-2" size={28} />
            <p className="text-2xl font-bold">{wrong}</p>
            <p className="text-sm text-slate-500">Câu sai</p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
            <Award className="mx-auto text-indigo-500 mb-2" size={28} />
            <p className="text-2xl font-bold">{percent}%</p>
            <p className="text-sm text-slate-500">Tỷ lệ đúng</p>
          </div>

          <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
            <Clock className="mx-auto text-cyan-500 mb-2" size={28} />
            <p className="text-2xl font-bold">
              {timeDisplay}
            </p>
            <p className="text-sm text-slate-500">Thời gian</p>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">

          <button
            onClick={() => navigate("/sinhvien/ky-thi")}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Quay lại danh sách kỳ thi
          </button>

          <button
            onClick={() => navigate("/sinhvien/dashboard")}
            className="px-6 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg"
          >
            Về trang chủ
          </button>

        </div>

      </div>

    </DashboardLayout>
  )
}