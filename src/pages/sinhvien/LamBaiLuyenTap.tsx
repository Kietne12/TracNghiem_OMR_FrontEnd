import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, CheckCircle, Flag, Loader2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { startPractice, submitPractice } from "../../services/practiceService"

export default function LamBaiLuyenTap() {

    interface OptionItem {
        label: string
        text: string
        originalLabel: string
    }

    interface QuestionItem {
        id: number
        text: string
        options: OptionItem[]
        correct: string
    }

    const shuffleArray = <T,>(arr: T[]) => {
        const cloned = [...arr]
        for (let i = cloned.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[cloned[i], cloned[j]] = [cloned[j], cloned[i]]
        }
        return cloned
    }

    const toBoolean = (value: unknown, fallback = false) => {
        if (typeof value === "boolean") return value
        if (typeof value === "number") return value !== 0
        if (typeof value === "string") {
            const normalized = value.trim().toLowerCase()
            if (["true", "1", "yes", "on"].includes(normalized)) return true
            if (["false", "0", "no", "off", ""].includes(normalized)) return false
        }
        return fallback
    }

    const { practiceId } = useParams()
    const navigate = useNavigate()
    const { account } = useAuth()

    const [practice, setPractice] = useState({
        id: practiceId,
        name: "Luyện tập",
        duration: 15,
    })
    const [historyId, setHistoryId] = useState<number | null>(null)
    const [questions, setQuestions] = useState<QuestionItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [flagged, setFlagged] = useState<number[]>([])
    const [timeRemaining, setTimeRemaining] = useState(0)

    useEffect(() => {
        let mounted = true

        const loadPractice = async () => {
            setLoading(true)
            setError("")

            try {
                const response = await startPractice(Number(practiceId), account?.user_id)
                const payload = response?.data
                const practiceData = payload?.practice
                const history = payload?.history
                const rows = Array.isArray(payload?.questions) ? payload.questions : []
                const config = payload?.practice?.cau_hinh || {}
                const shouldShuffleQuestions = toBoolean(config?.tron_cau_hoi, false)
                const shouldShuffleAnswers = toBoolean(config?.tron_dap_an, false)

                const mappedQuestions: QuestionItem[] = rows.map((q: any) => {
                    const originalOptions = [
                        { label: "A", text: q.dap_an_a || "" },
                        { label: "B", text: q.dap_an_b || "" },
                        { label: "C", text: q.dap_an_c || "" },
                        { label: "D", text: q.dap_an_d || "" },
                    ]

                    const arranged = shouldShuffleAnswers
                        ? shuffleArray(originalOptions)
                        : originalOptions

                    const displayLabels = ["A", "B", "C", "D"]
                    const mappedOptions: OptionItem[] = arranged.map((opt, idx) => ({
                        label: displayLabels[idx],
                        text: opt.text,
                        originalLabel: opt.label,
                    }))

                    return {
                        id: q.id,
                        text: q.noi_dung,
                        options: mappedOptions,
                        correct: String(q.dap_an_dung || "").toUpperCase(),
                    }
                })

                const finalQuestions = shouldShuffleQuestions
                    ? shuffleArray(mappedQuestions)
                    : mappedQuestions

                if (!mounted) return

                const duration = Number(practiceData?.thoi_gian_lam_bai) || 15
                setPractice({
                    id: practiceData?.id || practiceId,
                    name: practiceData?.ten_bai || "Luyện tập",
                    duration,
                })
                setHistoryId(Number(history?.id) || null)
                setQuestions(finalQuestions)
                setTimeRemaining(duration * 60)
            } catch (err: any) {
                if (!mounted) return
                setError(err?.response?.data?.error || "Không thể tải bài luyện tập")
            } finally {
                if (mounted) setLoading(false)
            }
        }

        loadPractice()

        return () => {
            mounted = false
        }
    }, [practiceId, account?.user_id])

    useEffect(() => {
        if (loading || questions.length === 0 || timeRemaining <= 0) return

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    submitCurrentPractice()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [loading, questions.length])

    const handleSelectAnswer = (option: string) => {
        if (!questions[currentQuestion]) return

        setAnswers((prev) => ({
            ...prev,
            [questions[currentQuestion].id]: option,
        }))
    }

    const toggleFlag = () => {
        if (!questions[currentQuestion]) return

        const qId = questions[currentQuestion].id

        if (flagged.includes(qId)) {
            setFlagged(flagged.filter((id) => id !== qId))
        } else {
            setFlagged([...flagged, qId])
        }
    }

    const submitCurrentPractice = async () => {
        if (!historyId || submitting || questions.length === 0) return

        try {
            setSubmitting(true)
            const payloadAnswers = questions.map((q) => ({
                cau_hoi_id: q.id,
                dap_an_student: answers[q.id] || "",
            }))

            const response = await submitPractice(historyId, payloadAnswers)
            const data = response?.data

            navigate("/sinhvien/ketqua-luyen-tap", {
                state: {
                    score: String(data?.score ?? 0),
                    correct: data?.correctCount ?? 0,
                    total: data?.totalCount ?? questions.length,
                    questions,
                    answers,
                },
            })
        } catch (err: any) {
            setError(err?.response?.data?.error || "Nộp bài luyện tập thất bại")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout role="SINH VIÊN">
                <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin" size={18} />
                    Đang tải bài luyện tập...
                </div>
            </DashboardLayout>
        )
    }

    if (error && questions.length === 0) {
        return (
            <DashboardLayout role="SINH VIÊN">
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 flex items-start gap-2">
                    <AlertCircle size={18} className="mt-0.5" />
                    <div>{error}</div>
                </div>
            </DashboardLayout>
        )
    }

    if (questions.length === 0) {
        return (
            <DashboardLayout role="SINH VIÊN">
                <div className="text-slate-500">Bài luyện tập chưa có câu hỏi.</div>
            </DashboardLayout>
        )
    }

    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

    const current = questions[currentQuestion]

    return (

        <DashboardLayout role="SINH VIÊN">

            {/* Header */}

            <div className="bg-white border rounded-lg p-4 flex justify-between items-center mb-6">

                <h1 className="text-lg font-bold">
                    {practice.name}
                </h1>

                <div className="flex items-center gap-2 font-bold text-indigo-600">

                    <Clock size={20} />

                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}

                </div>

            </div>


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Question */}

                <div className="lg:col-span-3 bg-white border rounded-lg p-8">

                    <div className="flex justify-between mb-6">

                        <span className="font-semibold text-indigo-600">
                            Câu {currentQuestion + 1}/{questions.length}
                        </span>

                        <span className="text-slate-500">
                            {Object.keys(answers).length}/{questions.length} câu
                        </span>

                    </div>

                    <div className="flex justify-end mb-4">

                        <button
                            onClick={toggleFlag}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
              ${flagged.includes(current.id)
                                    ? "bg-red-600 text-white border-red-600"
                                    : "border-slate-300"
                                }`}
                        >
                            <Flag size={16} />
                            Đặt cờ
                        </button>

                    </div>

                    <h2 className="text-xl font-bold mb-6">
                        {current.text}
                    </h2>

                    <div className="space-y-3">

                        {current.options.map((option, idx) => (

                            <button
                                key={idx}
                                onClick={() => handleSelectAnswer(option.originalLabel)}
                                className={`w-full p-4 text-left rounded-lg border
                ${answers[current.id] === option.originalLabel
                                        ? "border-indigo-600 bg-indigo-50"
                                        : "border-slate-200 hover:bg-slate-50"
                                    }`}
                            >

                                <div className="flex items-center">

                                    <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center
                  ${answers[current.id] === option.originalLabel
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "border-slate-300"
                                        }`}>

                                        {answers[current.id] === option.originalLabel &&
                                            <CheckCircle size={16} className="text-white" />}

                                    </div>

                                    {`${option.label}. ${option.text}`}

                                </div>

                            </button>

                        ))}

                    </div>

                    {/* Navigation */}

                    <div className="flex justify-between mt-8">

                        <button
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            disabled={currentQuestion === 0}
                            className="px-5 py-2 border rounded-lg disabled:opacity-50"
                        >
                            ← Câu trước
                        </button>

                        {currentQuestion === questions.length - 1 ? (

                            <button
                                onClick={submitCurrentPractice}
                                disabled={submitting}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                            >
                                {submitting ? "Đang nộp..." : "Nộp bài"}
                            </button>

                        ) : (

                            <button
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
                            >
                                Câu tiếp →
                            </button>

                        )}

                    </div>

                </div>


                {/* Sidebar */}

                <div className="bg-white border rounded-lg p-6 h-fit sticky top-6">

                    <h3 className="font-semibold mb-4">
                        Danh sách câu
                    </h3>

                    <div className="grid grid-cols-5 gap-2">

                        {questions.map((q, idx) => (

                            <button
                                key={idx}
                                onClick={() => setCurrentQuestion(idx)}
                                className={`relative p-2 rounded text-sm font-medium
                ${currentQuestion === idx
                                        ? "bg-indigo-600 text-white"
                                        : answers[q.id]
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100"
                                    }`}
                            >

                                {idx + 1}

                                {flagged.includes(q.id) && (
                                    <span className="absolute -top-1 -right-1 text-red-500 text-xs">
                                        🚩
                                    </span>
                                )}

                            </button>

                        ))}

                    </div>

                </div>

            </div>

        </DashboardLayout>

    )

}