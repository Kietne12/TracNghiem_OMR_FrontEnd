import DashboardLayout from "../../layout/DashboardLayout"
import { useParams, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../../services/api"

export default function ChiTietBaiThi() {

    interface AnswerItem {
        questionNumber: number
        questionId: number
        questionContent: string
        options: {
            A: string
            B: string
            C: string
            D: string
        }
        selectedAnswer: string | null
        correctAnswer: string | null
        isCorrect: boolean
    }

    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [exam, setExam] = useState({
        name: "",
        score: 0,
        correct: 0,
        total: 0,
    })
    const [questions, setQuestions] = useState<AnswerItem[]>([])

    useEffect(() => {
        let mounted = true

        const loadDetail = async () => {
            setLoading(true)
            setError("")

            try {
                const res = await api.get(`/api/exams/history/attempt/${id}`)
                const examData = res.data?.exam
                const submission = res.data?.submission
                const answers = Array.isArray(res.data?.answers) ? res.data.answers : []

                if (!mounted) return

                setExam({
                    name: examData?.name || "Bài thi",
                    score: Number(submission?.score || 0),
                    correct: Number(submission?.correctAnswers || 0),
                    total: Number(submission?.totalQuestions || 0),
                })
                setQuestions(answers)
            } catch (err: any) {
                if (!mounted) return
                setError(err?.response?.data?.message || "Không tải được chi tiết bài thi")
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadDetail()

        return () => {
            mounted = false
        }
    }, [id])

    const wrong = exam.total - exam.correct
    const percent = exam.total > 0 ? ((exam.correct / exam.total) * 100).toFixed(0) : "0"

    /* Pagination */

    const questionsPerPage = 5
    const [page, setPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage))

    const start = (page - 1) * questionsPerPage
    const end = start + questionsPerPage

    const currentQuestions = questions.slice(start, end)

    const renderOption = (label: "A" | "B" | "C" | "D", text: string, q: AnswerItem) => {
        const isSelected = q.selectedAnswer === label
        const isCorrect = q.correctAnswer === label

        return (
            <div
                key={label}
                className={`p-3 rounded-lg border ${
                    isCorrect
                        ? "border-green-500 bg-green-50"
                        : isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-slate-200"
                }`}
            >
                {`${label}. ${text || "--"}`}
            </div>
        )
    }

    if (loading) {
        return (
            <DashboardLayout role="SINH VIÊN">
                <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin" size={18} />
                    Đang tải chi tiết bài thi...
                </div>
            </DashboardLayout>
        )
    }

    if (error) {
        return (
            <DashboardLayout role="SINH VIÊN">
                <div className="max-w-5xl mx-auto rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
                    <AlertCircle size={18} className="mt-0.5" />
                    <div>{error}</div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout role="SINH VIÊN">

            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800 mb-2">
                            Chi tiết bài thi
                        </h1>

                        <p className="text-slate-600">
                            {exam.name} (ID: {id})
                        </p>

                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-100"
                    >
                        <ArrowLeft size={18} />
                        Quay lại
                    </button>

                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                    <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                        <p className="text-sm text-slate-500">Điểm</p>
                        <p className="text-3xl font-bold text-indigo-600">
                            {exam.score}/10
                        </p>
                    </div>

                    <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                        <CheckCircle className="mx-auto text-green-500 mb-2" />
                        <p className="text-xl font-bold">{exam.correct}</p>
                        <p className="text-sm text-slate-500">Câu đúng</p>
                    </div>

                    <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                        <XCircle className="mx-auto text-red-500 mb-2" />
                        <p className="text-xl font-bold">{wrong}</p>
                        <p className="text-sm text-slate-500">Câu sai</p>
                    </div>

                    <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                        <p className="text-xl font-bold">{percent}%</p>
                        <p className="text-sm text-slate-500">Tỷ lệ đúng</p>
                    </div>

                </div>

                {/* Questions */}
                <div className="space-y-4">

                    {currentQuestions.map((q) => (

                        <div key={q.questionId} className="bg-white border rounded-lg p-6 shadow-sm">

                            <p className="font-semibold mb-4">
                                Câu {q.questionNumber}: {q.questionContent}
                            </p>

                            <div className="space-y-2">
                                {renderOption("A", q.options.A, q)}
                                {renderOption("B", q.options.B, q)}
                                {renderOption("C", q.options.C, q)}
                                {renderOption("D", q.options.D, q)}

                            </div>

                            <div className="mt-4 text-sm">

                                <p>
                                    Bạn chọn: <span className="font-semibold">{q.selectedAnswer || "Chưa chọn"}</span>
                                </p>

                                <p className="text-green-600">
                                    Đáp án đúng: {q.correctAnswer || "--"}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        ←
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (

                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1 rounded border
                ${p === page
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white"}
              `}
                        >
                            {p}
                        </button>

                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        →
                    </button>

                </div>

            </div>

        </DashboardLayout>
    )
}