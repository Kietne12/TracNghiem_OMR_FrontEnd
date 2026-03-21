import DashboardLayout from "../../layout/DashboardLayout"
import { AlertCircle, Clock, FileText, BookOpen, Loader2 } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect, useMemo, useState } from "react"
import api from "../../services/api"

export default function DanhSachBaiLuyenTap() {

    interface PracticeItem {
        id: number
        ten_bai: string
        so_cau: number
        thoi_gian_lam_bai: number
    }

    interface PracticeHistoryStatItem {
        bai_luyen_tap_id: number
        tong_diem: number | null
    }

    const { subjectId } = useParams()
    const navigate = useNavigate()
    const { account } = useAuth()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [practices, setPractices] = useState<PracticeItem[]>([])
    const [historyStats, setHistoryStats] = useState<PracticeHistoryStatItem[]>([])

    useEffect(() => {
        let mounted = true

        const loadData = async () => {
            setLoading(true)
            setError("")
            try {
                const requests: Promise<any>[] = [
                    api.get("/api/practice", { params: { lop_id: subjectId } }),
                ]

                if (account?.user_id) {
                    requests.push(api.get(`/api/practice/thong-ke/student/${account.user_id}`))
                }

                const [practiceRes, historyRes] = await Promise.all(requests)

                if (!mounted) return

                const practiceData = practiceRes.data?.success && Array.isArray(practiceRes.data?.data)
                    ? practiceRes.data.data
                    : []

                const historyData = historyRes?.data?.success && Array.isArray(historyRes?.data?.data)
                    ? historyRes.data.data
                    : []

                setPractices(practiceData)
                setHistoryStats(historyData)
            } catch (err: any) {
                if (!mounted) return
                setError(err?.response?.data?.message || "Không thể tải bài luyện tập")
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
        const map = new Map<number, { attempts: number; lastScore: number | null }>()

        historyStats.forEach((item) => {
            const key = Number(item.bai_luyen_tap_id)
            const current = map.get(key) || { attempts: 0, lastScore: null }
            map.set(key, {
                attempts: current.attempts + 1,
                lastScore: current.lastScore === null && typeof item.tong_diem === "number"
                    ? item.tong_diem
                    : current.lastScore,
            })
        })

        return map
    }, [historyStats])

    return (

        <DashboardLayout role="SINH VIÊN">

            {/* Header */}

            <div className="mb-6">

                <button
                    onClick={() => navigate("/sinhvien/luyen-tap")}
                    className="mb-4 text-indigo-600"
                >
                    ← Quay lại
                </button>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Danh sách bài luyện tập
                </h1>

            </div>


            {/* Không có bài */}

            {loading && (
                <div className="py-12 flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin" size={18} />
                    Đang tải bài luyện tập...
                </div>
            )}

            {!loading && error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
                    <AlertCircle size={18} className="mt-0.5" />
                    <div>{error}</div>
                </div>
            )}

            {!loading && !error && practices.length === 0 && (

                <div className="text-slate-500">
                    Chưa có bài luyện tập cho môn này
                </div>

            )}


            {/* Danh sách bài */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {!loading && !error && practices.map((practice) => {
                    const history = historyMap.get(practice.id)
                    const attempts = history?.attempts || 0
                    const lastScore = history?.lastScore

                    return (

                    <div
                        key={practice.id}
                        className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
                    >

                        <div className="flex items-center gap-3 mb-4">

                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
                                <BookOpen size={20} />
                            </div>

                            <h2 className="text-lg font-semibold text-slate-800">
                                {practice.ten_bai}
                            </h2>

                        </div>


                        <div className="space-y-2 text-sm text-slate-600 mb-4">

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                Thời gian: {practice.thoi_gian_lam_bai} phút
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                Số câu: {practice.so_cau}
                            </div>

                            <div>
                                Số lần làm: {attempts}
                            </div>

                        </div>


                        {typeof lastScore === "number" && (

                            <div className="mb-3 text-green-600 font-semibold">

                                Điểm gần nhất: {lastScore}

                            </div>

                        )}


                        <button
                            onClick={() => navigate(`/sinhvien/luyen-tap/lam-bai/${practice.id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >

                            Luyện tập

                        </button>

                    </div>

                )})}

            </div>

        </DashboardLayout>

    )
}