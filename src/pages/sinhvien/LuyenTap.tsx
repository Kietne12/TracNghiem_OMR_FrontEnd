import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layout/DashboardLayout"
import { BookOpen, Calendar, Brain, Loader2, AlertCircle } from "lucide-react"
import api from "../../services/api"

export default function LuyenTap() {

    interface LopHocItem {
        id: number
        ten_lop: string
        hoc_ky: string | null
        nam_hoc: string | null
    }

    interface PracticeItem {
        id: number
        lop_id: number
    }

    const navigate = useNavigate()

    const [year, setYear] = useState("")
    const [semester, setSemester] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [classes, setClasses] = useState<LopHocItem[]>([])
    const [practices, setPractices] = useState<PracticeItem[]>([])

    useEffect(() => {
        let mounted = true

        const loadData = async () => {
            setLoading(true)
            setError("")
            try {
                const [classesRes, practiceRes] = await Promise.all([
                    api.get("/api/exams/classes"),
                    api.get("/api/practice"),
                ])

                if (!mounted) return

                const classesData = Array.isArray(classesRes.data?.classes) ? classesRes.data.classes : []
                const practiceData = practiceRes.data?.success && Array.isArray(practiceRes.data?.data)
                    ? practiceRes.data.data
                    : []

                setClasses(classesData)
                setPractices(practiceData)

                const firstSemester = classesData.find((item: LopHocItem) => item.hoc_ky)?.hoc_ky || ""
                const firstYear = classesData.find((item: LopHocItem) => item.nam_hoc)?.nam_hoc || ""

                setSemester((prev) => prev || firstSemester)
                setYear((prev) => prev || firstYear)
            } catch (err: any) {
                if (!mounted) return
                setError(err?.response?.data?.message || "Không thể tải dữ liệu luyện tập")
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadData()

        return () => {
            mounted = false
        }
    }, [])

    const semesterOptions = useMemo(
        () => [...new Set(classes.map((item) => item.hoc_ky).filter(Boolean))] as string[],
        [classes]
    )

    const yearOptions = useMemo(
        () => [...new Set(classes.map((item) => item.nam_hoc).filter(Boolean))] as string[],
        [classes]
    )

    const practiceCountByClass = useMemo(() => {
        const map = new Map<number, number>()
        practices.forEach((item) => {
            map.set(item.lop_id, (map.get(item.lop_id) || 0) + 1)
        })
        return map
    }, [practices])

    const filteredClasses = useMemo(
        () => classes.filter((item) => {
            const matchYear = !year || item.nam_hoc === year
            const matchSemester = !semester || item.hoc_ky === semester
            return matchYear && matchSemester
        }),
        [classes, year, semester]
    )

    return (
        <DashboardLayout role="SINH VIÊN">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Brain className="text-indigo-600" />
                    Luyện tập
                </h1>

                <p className="text-slate-500">
                    Chọn môn học để luyện tập trắc nghiệm
                </p>

            </div>


            {/* Bộ lọc */}

            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 flex flex-wrap gap-4 items-center">

                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">
                        Năm học
                    </span>
                </div>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >

                    <option value="">Tất cả</option>
                    {yearOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}

                </select>


                <div className="flex items-center gap-2 text-slate-600 ml-4">
                    <span className="text-sm font-medium">
                        Học kỳ
                    </span>
                </div>

                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >

                    <option value="">Tất cả</option>
                    {semesterOptions.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}

                </select>

            </div>


            {/* Danh sách môn */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {loading && (
                    <div className="col-span-full py-12 flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="animate-spin" size={18} />
                        Đang tải danh sách lớp...
                    </div>
                )}

                {!loading && error && (
                    <div className="col-span-full rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
                        <AlertCircle size={18} className="mt-0.5" />
                        <div>{error}</div>
                    </div>
                )}

                {!loading && !error && filteredClasses.length === 0 && (
                    <div className="col-span-full text-slate-500">Không có lớp phù hợp bộ lọc.</div>
                )}

                {!loading && !error && filteredClasses.map((lop) => (

                    <div
                        key={lop.id}
                        onClick={() => navigate(`/sinhvien/luyen-tap/${lop.id}`)}
                        className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                    >

                        <div className="flex items-center gap-4 mb-4">

                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
                                <BookOpen size={24} />
                            </div>

                            <h2 className="font-semibold text-lg text-slate-800">
                                {lop.ten_lop}
                            </h2>

                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed">
                            {lop.hoc_ky ? `Học kỳ ${lop.hoc_ky}` : "Chưa có học kỳ"}
                            {lop.nam_hoc ? ` • ${lop.nam_hoc}` : ""}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                            {practiceCountByClass.get(lop.id) || 0} bài luyện tập
                        </p>

                        <div className="mt-6 text-indigo-600 text-sm font-medium">
                            Luyện tập →
                        </div>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    )
}