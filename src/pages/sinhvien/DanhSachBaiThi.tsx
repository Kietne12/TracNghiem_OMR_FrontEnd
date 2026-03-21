import DashboardLayout from "../../layout/DashboardLayout"
import { AlertCircle, Calendar, Clock, FileText, Loader2 } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect, useMemo, useState } from "react"
import api from "../../services/api"

export default function DanhSachBaiThi() {

    interface KyThiItem {
        id: number
        ten_ky_thi: string
        thoi_gian_bat_dau: string | null
        thoi_gian_ket_thuc: string | null
        thoi_gian_lam_bai: number | null
        tong_so_cau?: number
    }

    interface HistoryItem {
        id: number
        ky_thi_id: number
        tong_diem: number | null
    }

    const { subjectId } = useParams()
    const navigate = useNavigate()
    const { account } = useAuth()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [exams, setExams] = useState<KyThiItem[]>([])
    const [history, setHistory] = useState<HistoryItem[]>([])

    useEffect(() => {
        let mounted = true

        const loadData = async () => {
            setLoading(true)
            setError("")

            try {
                const requests: Promise<any>[] = [
                    api.get("/api/exams", { params: { lop_id: subjectId } }),
                ]

                if (account?.user_id) {
                    requests.push(api.get(`/api/exams/history/student/${account.user_id}`))
                }

                const [examsRes, historyRes] = await Promise.all(requests)

                if (!mounted) return

                setExams(Array.isArray(examsRes.data?.exams) ? examsRes.data.exams : [])
                setHistory(Array.isArray(historyRes?.data?.history) ? historyRes.data.history : [])
            } catch (err: any) {
                if (!mounted) return
                setError(err?.response?.data?.message || "Không thể tải danh sách bài thi")
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadData()

        return () => {
            mounted = false
        }
    }, [subjectId, account?.user_id])

    const historyMap = useMemo(() => {
        const map = new Map<number, HistoryItem>()
        history.forEach((item) => {
            map.set(item.ky_thi_id, item)
        })
        return map
    }, [history])

    const getExamStatus = (exam: KyThiItem) => {
        if (historyMap.has(exam.id)) return "Đã làm"

        const now = Date.now()
        const start = exam.thoi_gian_bat_dau ? new Date(exam.thoi_gian_bat_dau).getTime() : NaN
        const end = exam.thoi_gian_ket_thuc ? new Date(exam.thoi_gian_ket_thuc).getTime() : NaN

        if (Number.isFinite(start) && now < start) return "Chưa đến giờ"
        if (Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end) {
            return "Đang diễn ra"
        }
        return "Đã kết thúc"
    }

    const formatDateTime = (value: string | null) => {
        if (!value) return "--"
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return "--"

        return {
            date: date.toLocaleDateString("vi-VN"),
            time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        }
    }

    const getButton = (exam: KyThiItem) => {
        const status = getExamStatus(exam)

        if (status === "Đang diễn ra") {
            return (
                <button
                    onClick={() => navigate(`/sinhvien/lam-bai/${exam.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    Làm bài
                </button>
            )
        }

        if (status === "Chưa đến giờ") {
            return (
                <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                >
                    Chưa đến giờ
                </button>
            )
        }

        if (status === "Đã làm") {
            return (
                <button
                    onClick={() => navigate("/sinhvien/lich-su")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Đã làm
                </button>
            )
        }

        return (
            <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
            >
                Đã kết thúc
            </button>
        )
    }

    return (
        <DashboardLayout role="SINH VIÊN">

            {/* Header */}
            <div className="mb-6">

                <button
                    onClick={() => navigate("/sinhvien/ky-thi")}
                    className="mb-4 text-indigo-600"
                >
                    ← Quay lại
                </button>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Danh sách bài thi
                </h1>

            </div>

            {/* Không có bài thi */}
            {loading && (
                <div className="py-12 flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin" size={18} />
                    Đang tải danh sách bài thi...
                </div>
            )}

            {!loading && error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
                    <AlertCircle size={18} className="mt-0.5" />
                    <div>{error}</div>
                </div>
            )}

            {!loading && !error && exams.length === 0 && (
                <div className="text-slate-500">
                    Không có kỳ thi hoặc kiểm tra nào
                </div>
            )}

            {/* Danh sách bài thi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {!loading && !error && exams.map((exam) => {
                    const dateTime = formatDateTime(exam.thoi_gian_bat_dau)
                    const status = getExamStatus(exam)
                    const score = historyMap.get(exam.id)?.tong_diem

                    return (

                    <div
                        key={exam.id}
                        className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
                    >

                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            {exam.ten_ky_thi}
                        </h2>

                        <div className="space-y-2 text-sm text-slate-600 mb-4">

                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {typeof dateTime === "string" ? dateTime : dateTime.date}
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {typeof dateTime === "string" ? "--" : dateTime.time}
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                Thời gian: {exam.thoi_gian_lam_bai || 0} phút
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                Số câu: {exam.tong_so_cau || 0}
                            </div>

                            <div>
                                Trạng thái: <span className="font-medium">{status}</span>
                            </div>

                        </div>

                        {typeof score === "number" && (
                            <div className="mb-3 text-green-600 font-semibold">
                                Điểm: {score}
                            </div>
                        )}

                        {getButton(exam)}

                    </div>

                )})}

            </div>

        </DashboardLayout>
    )
}