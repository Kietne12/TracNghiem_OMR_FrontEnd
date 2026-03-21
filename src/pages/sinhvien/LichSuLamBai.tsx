import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, Calendar, CheckCircle, TrendingUp, FileText, Loader2, AlertCircle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import api from "../../services/api"

export default function LichSuLamBai() {

  interface HistoryItem {
    id: number
    ky_thi_id: number
    ten_ky_thi: string
    mon_hoc: string
    thoi_gian_bat_dau: string | null
    thoi_gian_lam_bai: number | null
    tong_diem: number | null
  }

  const navigate = useNavigate()
  const { account } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    let mounted = true

    const loadHistory = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await api.get(
          account?.user_id
            ? `/api/exams/history/student/${account.user_id}`
            : "/api/exams/history/student"
        )

        if (!mounted) return

        const data = Array.isArray(response.data?.history) ? response.data.history : []
        setHistory(data)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || "Không thể tải lịch sử làm bài")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadHistory()

    return () => {
      mounted = false
    }
  }, [account?.user_id])

  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("Tất cả")

  const subjects = ["Tất cả", ...new Set(history.map(i => i.mon_hoc))]

  const formatDateTime = (value: string | null) => {
    if (!value) return { date: "--", time: "--" }
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return { date: "--", time: "--" }

    return {
      date: d.toLocaleDateString("vi-VN"),
      time: d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const normalizedHistory = useMemo(
    () => history.map((item) => {
      const dateTime = formatDateTime(item.thoi_gian_bat_dau)
      return {
        ...item,
        subject: item.mon_hoc,
        exam: item.ten_ky_thi,
        date: dateTime.date,
        startTime: dateTime.time,
        duration: item.thoi_gian_lam_bai || 0,
        score: typeof item.tong_diem === "number" ? item.tong_diem : 0,
      }
    }),
    [history]
  )

  const filtered = normalizedHistory
    .filter(item =>
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.exam.toLowerCase().includes(search.toLowerCase())
    )
    .filter(item =>
      subjectFilter === "Tất cả" || item.subject === subjectFilter
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const total = normalizedHistory.length

  const avgScore =
    normalizedHistory.length > 0
      ? (
        normalizedHistory.reduce((sum, i) => sum + i.score, 0) / normalizedHistory.length
      ).toFixed(1)
      : 0

  const getScoreStyle = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 5) return "text-blue-600"
    return "text-red-600"
  }

  const getRank = (score: number) => {
    if (score >= 8.5) return "Giỏi"
    if (score >= 7) return "Khá"
    if (score >= 5) return "Trung bình"
    return "Chưa đạt"
  }

  return (
    <DashboardLayout role="SINH VIÊN">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Lịch sử làm bài
        </h1>
        <p className="text-slate-600">
          Xem lại các bài thi bạn đã tham gia
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Tổng bài thi</p>
              <p className="text-2xl font-bold text-indigo-600">{total}</p>
            </div>
            <FileText className="text-indigo-300" size={30} />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Điểm trung bình</p>
              <p className="text-2xl font-bold text-green-600">{avgScore}</p>
            </div>
            <TrendingUp className="text-green-300" size={30} />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Bài hoàn thành</p>
              <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
            <CheckCircle className="text-blue-300" size={30} />
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Tìm môn học hoặc bài thi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 flex-1"
        />

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2"
        >
          {subjects.map(sub => (
            <option key={sub}>{sub}</option>
          ))}
        </select>

      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-6">
          Danh sách bài thi
        </h2>

        {loading && (
          <div className="py-10 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            Đang tải lịch sử làm bài...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 ? (

          <div className="text-center py-10 text-slate-500">
            Bạn chưa có lịch sử làm bài
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b text-sm text-slate-700">
                  <th className="text-left py-3 px-4">Môn học</th>
                  <th className="text-left py-3 px-4">Bài thi</th>
                  <th className="text-left py-3 px-4">Ngày</th>
                  <th className="text-left py-3 px-4">Thời gian</th>
                  <th className="text-center py-3 px-4">Điểm</th>
                  <th className="text-center py-3 px-4">Xếp loại</th>
                  <th className="text-center py-3 px-4">Hành động</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((item) => (

                  <tr key={item.id} className="border-b hover:bg-slate-50">

                    <td className="py-3 px-4 font-medium">
                      {item.subject}
                    </td>

                    <td className="py-3 px-4">
                      {item.exam}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {item.date}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {item.startTime} ({item.duration} phút)
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold ${getScoreStyle(item.score)}`}>
                        {item.score}/10
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {getRank(item.score)}
                    </td>

                    <td className="py-3 px-4 text-center">

                      <button
                        onClick={() => navigate(`/sinhvien/chitiet-baithi/${item.id}`)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Xem chi tiết
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </DashboardLayout>
  )
}