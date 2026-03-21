import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, CheckCircle, Flag, Loader2, AlertCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"

interface OptionItem {
  label: string
  text: string
  originalLabel: string
}

interface QuestionItem {
  id: number
  text: string
  options: OptionItem[]
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

export default function LamBaiThi() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const [exam, setExam] = useState({
    id: examId,
    name: "",
    duration: 60,
  })
  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const hasAutoSubmittedRef = useRef(false)

  useEffect(() => {
    let mounted = true

    const loadExam = async () => {
      setLoading(true)
      setError("")

      try {
        const response = await api.get(`/api/exams/${examId}`)
        const examData = response.data?.exam
        const rows = Array.isArray(response.data?.questions) ? response.data.questions : []
        const config = response.data?.cau_hinh || {}
        const shouldShuffleQuestions = toBoolean(config?.tron_cau_hoi, false)
        const shouldShuffleAnswers = toBoolean(config?.tron_dap_an, false)

        const now = Date.now()
        const startTime = examData?.thoi_gian_bat_dau
          ? new Date(examData.thoi_gian_bat_dau).getTime()
          : NaN

        if (Number.isFinite(startTime) && now < startTime) {
          if (!mounted) return
          setQuestions([])
          setError("Kỳ thi chưa tới giờ bắt đầu")
          return
        }

        const mappedQuestions: QuestionItem[] = rows
          .map((item: any) => {
            const q = item?.cau_hoi
            if (!q?.id || !q?.noi_dung) return null

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
            }
          })
          .filter(Boolean)

        const finalQuestions = shouldShuffleQuestions
          ? shuffleArray(mappedQuestions)
          : mappedQuestions

        if (!mounted) return

        const duration = Number(examData?.thoi_gian_lam_bai) || 60
        setExam({
          id: examData?.id || examId,
          name: examData?.ten_ky_thi || "Kỳ thi",
          duration,
        })
        setQuestions(finalQuestions)
        setTimeRemaining(duration * 60)
        hasAutoSubmittedRef.current = false
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || "Không thể tải đề thi")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadExam()

    return () => {
      mounted = false
    }
  }, [examId])

  useEffect(() => {
    if (loading || questions.length === 0 || submitting) return

    if (timeRemaining <= 0) {
      if (!hasAutoSubmittedRef.current) {
        hasAutoSubmittedRef.current = true
        void submitExam(true)
      }
      return
    }

    const timer = setTimeout(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [loading, questions.length, timeRemaining, submitting])

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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitExam = async (autoSubmit = false) => {
    if (submitting || questions.length === 0) return

    try {
      setSubmitting(true)

      const timeUsed = exam.duration * 60 - timeRemaining
      const payload = {
        answers: questions.map((q) => ({
          cau_hoi_id: q.id,
          dap_an_student: answers[q.id] || null,
        })),
        time_used_sec: timeUsed,
      }

      const response = await api.post(`/api/exams/${examId}/submit`, payload)
      const result = response.data?.result

      navigate("/sinhvien/ketqua", {
        state: {
          examName: exam.name,
          correct: result?.correct || 0,
          total: result?.total || questions.length,
          score: String(result?.score ?? 0),
          timeUsed: result?.timeUsed ?? timeUsed,
        },
      })
    } catch (err: any) {
      setError(err?.response?.data?.message || "Nộp bài thất bại")
      if (!autoSubmit) setShowSubmitModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="SINH VIÊN">
        <div className="py-20 flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="animate-spin" size={18} />
          Đang tải đề thi...
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
        <div className="text-slate-500">Đề thi chưa có câu hỏi.</div>
      </DashboardLayout>
    )
  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <DashboardLayout role="SINH VIÊN">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-700 flex items-start gap-2 mb-4">
          <AlertCircle size={16} className="mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center mb-6">
        <h1 className="text-lg font-bold text-slate-800">{exam.name}</h1>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-bold ${timeRemaining < 600 ? "text-red-600" : "text-green-600"}`}>
            <Clock size={20} />
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
          >
            {submitting ? "Đang nộp..." : "Nộp bài"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 p-8">
          <div className="flex justify-between mb-6">
            <span className="font-semibold text-indigo-600">
              Câu {currentQuestion + 1}/{questions.length}
            </span>
            <span className="text-slate-500">
              {Object.keys(answers).length}/{questions.length} câu đã làm
            </span>
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                flagged.includes(questions[currentQuestion].id)
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-300"
              }`}
            >
              <Flag size={16} />
              Đặt cờ
            </button>
          </div>

          <h2 className="text-xl font-bold mb-6">{questions[currentQuestion].text}</h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(option.originalLabel)}
                className={`w-full p-4 text-left rounded-lg border ${
                  answers[questions[currentQuestion].id] === option.originalLabel
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                      answers[questions[currentQuestion].id] === option.originalLabel
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-slate-300"
                    }`}
                  >
                    {answers[questions[currentQuestion].id] === option.originalLabel && (
                      <CheckCircle size={16} className="text-white" />
                    )}
                  </div>
                  {`${option.label}. ${option.text}`}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-5 py-2 border rounded-lg disabled:opacity-50"
            >
              ← Câu trước
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Làm xong
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Câu tiếp →
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-6">
          <h3 className="font-semibold mb-4">Danh sách câu hỏi</h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`relative p-2 rounded text-sm font-medium ${
                  currentQuestion === idx
                    ? "bg-indigo-600 text-white"
                    : answers[q.id]
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100"
                }`}
              >
                {idx + 1}
                {flagged.includes(q.id) && (
                  <span className="absolute -top-1 -right-1 text-red-500 text-xs">🚩</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h3 className="text-lg font-bold mb-4">Xác nhận nộp bài</h3>
            <p className="text-slate-600 mb-6">Bạn có chắc muốn nộp bài không?</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Hủy
              </button>

              <button
                onClick={() => void submitExam()}
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                {submitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}