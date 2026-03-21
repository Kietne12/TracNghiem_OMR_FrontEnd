import DashboardLayout from "../../layout/DashboardLayout"
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  Brain,
  AlertCircle,
  Loader2
} from "lucide-react"

import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import api from "../../services/api"

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
  const { account } = useAuth()
  const navigate = useNavigate()

  interface LopHocItem {
    id: number
    ten_lop: string
    hoc_ky: string | null
    nam_hoc: string | null
  }

  interface KyThiItem {
    id: number
    ten_ky_thi: string
    lop_id: number | null
    thoi_gian_bat_dau: string | null
    thoi_gian_ket_thuc: string | null
    thoi_gian_lam_bai: number | null
    trang_thai: string | null
  }

  interface LichSuLuyenTapItem {
    lich_su_bai_id: number
    ten_bai: string
    tong_diem: number | null
    thoi_gian_nop: string | null
  }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [classes, setClasses] = useState<LopHocItem[]>([])
  const [exams, setExams] = useState<KyThiItem[]>([])
  const [practiceHistory, setPracticeHistory] = useState<LichSuLuyenTapItem[]>([])

  const studentInfo = {
    name: account?.ho_ten || account?.username || "Sinh viên",
    studentId: account?.mssv || "--",
    class: "Đang cập nhật",
  }

  /* =========================
     Chọn học kỳ + năm học
  ========================== */

  const [semester, setSemester] = useState("")
  const [year, setYear] = useState("")

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      setLoading(true)
      setError("")

      try {
        const calls: Promise<any>[] = [
          api.get("/api/exams/classes"),
          api.get("/api/exams"),
        ]

        if (account?.user_id) {
          calls.push(api.get(`/api/practice/thong-ke/student/${account.user_id}`))
        }

        const results = await Promise.all(calls)

        const classesData = Array.isArray(results[0]?.data?.classes)
          ? results[0].data.classes
          : []

        const examsData = Array.isArray(results[1]?.data?.exams)
          ? results[1].data.exams
          : []

        const practiceData = results[2]?.data?.success && Array.isArray(results[2]?.data?.data)
          ? results[2].data.data
          : []

        if (!mounted) return

        setClasses(classesData)
        setExams(examsData)
        setPracticeHistory(practiceData)

        if (!semester && classesData.length > 0) {
          const firstSemester = classesData.find((c: LopHocItem) => c.hoc_ky)?.hoc_ky || ""
          setSemester(firstSemester)
        }

        if (!year && classesData.length > 0) {
          const firstYear = classesData.find((c: LopHocItem) => c.nam_hoc)?.nam_hoc || ""
          setYear(firstYear)
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || "Không thể tải dữ liệu dashboard")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [account?.user_id])

  /* =========================
     Điểm các môn đã học
  ========================== */

  const classesMap = useMemo(() => {
    const map = new Map<number, LopHocItem>()
    classes.forEach((item) => {
      map.set(item.id, item)
    })
    return map
  }, [classes])

  const semesterOptions = useMemo(
    () => [...new Set(classes.map((item) => item.hoc_ky).filter(Boolean))] as string[],
    [classes]
  )

  const yearOptions = useMemo(
    () => [...new Set(classes.map((item) => item.nam_hoc).filter(Boolean))] as string[],
    [classes]
  )

  const filteredExams = exams.filter((exam) => {
    if (!exam.lop_id) return false
    const classInfo = classesMap.get(exam.lop_id)
    if (!classInfo) return false

    const matchSemester = !semester || classInfo.hoc_ky === semester
    const matchYear = !year || classInfo.nam_hoc === year
    return matchSemester && matchYear
  })

  const getExamTimeMeta = (exam: KyThiItem) => {
    if (!exam.thoi_gian_bat_dau) {
      return { status: "Không rõ", startTime: NaN, endTime: NaN }
    }

    const startTime = new Date(exam.thoi_gian_bat_dau).getTime()
    if (Number.isNaN(startTime)) {
      return { status: "Không rõ", startTime: NaN, endTime: NaN }
    }

    const endByField = exam.thoi_gian_ket_thuc
      ? new Date(exam.thoi_gian_ket_thuc).getTime()
      : NaN

    const endByDuration = startTime + (Number(exam.thoi_gian_lam_bai || 0) * 60 * 1000)
    const endTime = Number.isFinite(endByField) ? endByField : endByDuration

    const now = Date.now()
    if (now < startTime) {
      return { status: "Sắp diễn ra", startTime, endTime }
    }

    if (Number.isFinite(endTime) && now <= endTime) {
      return { status: "Đang diễn ra", startTime, endTime }
    }

    return { status: "Đã kết thúc", startTime, endTime }
  }

  const sortedUpcomingExams = [...filteredExams]
    .filter((exam) => getExamTimeMeta(exam).status === "Sắp diễn ra")
    .sort(
      (a, b) =>
        getExamTimeMeta(a).startTime - getExamTimeMeta(b).startTime
    )

  const recentExams = [...filteredExams]
    .filter((exam) => Boolean(exam.thoi_gian_bat_dau))
    .sort(
      (a, b) =>
        getExamTimeMeta(b).startTime - getExamTimeMeta(a).startTime
    )
    .slice(0, 3)

  const chartData = practiceHistory
    .filter((item) => typeof item.tong_diem === "number")
    .slice(0, 8)
    .map((item) => ({
      subject: item.ten_bai,
      score: Number(item.tong_diem ?? 0),
    }))

  const resolvedClassText = useMemo(() => {
    if (filteredExams.length === 0) return "Chưa có lớp theo bộ lọc"
    const firstExam = filteredExams[0]
    const classInfo = firstExam.lop_id ? classesMap.get(firstExam.lop_id) : null
    if (!classInfo) return "Chưa có dữ liệu lớp"
    const hk = classInfo.hoc_ky ? `HK ${classInfo.hoc_ky}` : ""
    const namHoc = classInfo.nam_hoc ? ` - ${classInfo.nam_hoc}` : ""
    return `${classInfo.ten_lop}${hk ? ` (${hk}${namHoc})` : namHoc}`
  }, [filteredExams, classesMap])

  /* =========================
     Điểm trung bình tất cả môn
  ========================== */

  const scoredPractices = practiceHistory.filter((item) => typeof item.tong_diem === "number")

  const avgScore =
    scoredPractices.length > 0
      ? (
        scoredPractices.reduce((sum, s) => sum + Number(s.tong_diem ?? 0), 0) /
        scoredPractices.length
      ).toFixed(2)
      : "0.00"

  /* =========================
     Tiến độ học tập
  ========================== */

  const totalSubjects = practiceHistory.length || 1
  const completedSubjects = scoredPractices.length

  const progress =
    ((completedSubjects / totalSubjects) * 100).toFixed(1)

  /* =========================
     Kỳ thi
  ========================== */

  const upcomingCards = sortedUpcomingExams.slice(0, 3)

  const formatExamDate = (date: string | null) => {
    if (!date) return "--"
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) return "--"

    return `${d.toLocaleDateString("vi-VN")} - ${d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`

  }

  const studentInfoWithClass = {
    ...studentInfo,
    class: resolvedClassText,
  }

  return (

    <DashboardLayout role="SINH VIÊN">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Xin chào, {studentInfoWithClass.name}!
        </h1>

        <p className="text-slate-600">
          Chào mừng bạn quay lại hệ thống thi trắc nghiệm
        </p>

      </div>

      {/* Student Info */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">MSSV</p>
          <p className="text-2xl font-bold">{studentInfoWithClass.studentId}</p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">Lớp học</p>
          <p className="text-lg font-semibold">{studentInfoWithClass.class}</p>
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

            {loading && (
              <div className="py-8 flex items-center justify-center text-slate-500 gap-2">
                <Loader2 className="animate-spin" size={18} />
                Đang tải kỳ thi...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {!loading && !error && upcomingCards.length === 0 && (
              <p className="text-slate-500">Chưa có kỳ thi theo học kỳ/năm học đã chọn.</p>
            )}

            {!loading && !error && upcomingCards.map(exam => (

              <div
                key={exam.id}
                className="border rounded-lg p-4 mb-4"
              >

                <h3 className="font-semibold">
                  {exam.ten_ky_thi}
                </h3>

                <p className="text-sm text-slate-600">
                  {formatExamDate(exam.thoi_gian_bat_dau)}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Thời lượng: {exam.thoi_gian_lam_bai || 0} phút
                </p>

                <button
                  disabled
                  className="mt-3 w-full bg-slate-300 text-slate-600 py-2 rounded-lg cursor-not-allowed"
                >
                  Chưa tới giờ thi
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
                {semesterOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <select
                className="border rounded p-2"
                value={year}
                onChange={e => setYear(e.target.value)}
              >
                <option value="">Chọn năm học</option>
                {yearOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

            </div>

            {chartData.length > 0 ? (

              <ResponsiveContainer width="100%" height={250}>

                <BarChart data={chartData}>

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
                Chưa có dữ liệu điểm luyện tập
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

            {recentExams.length > 0 ? (
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="border rounded-lg p-3">
                    <p className="font-semibold text-sm">{exam.ten_ky_thi}</p>
                    <p className="text-slate-600 text-xs mt-1">{formatExamDate(exam.thoi_gian_bat_dau)}</p>
                    <p className="mt-2 text-indigo-600 text-sm font-medium">{getExamTimeMeta(exam).status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Chưa có kỳ thi gần đây</p>
            )}

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
                {completedSubjects}/{practiceHistory.length} lượt
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