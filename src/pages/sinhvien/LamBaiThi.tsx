import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, CheckCircle, Flag } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function LamBaiThi() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const exam = {
    id: examId,
    name: "Toán cao cấp 1 - Kỳ thi giữa kỳ",
    duration: 90,
  }

  const questions = [
    {
      id: 1,
      text: "Đạo hàm của hàm số y = x² + 2x là?",
      options: ["A. 2x", "B. 2x + 2", "C. 2x + 1", "D. x + 2"],
      correct: "B"
    },
    {
      id: 2,
      text: "Tích phân của hàm số f(x) = 2x là?",
      options: ["A. x²", "B. x² + C", "C. 2x + C", "D. x² + 2C"],
      correct: "B"
    },
    {
      id: 3,
      text: "Giới hạn của lim x→0 (sin x / x) là?",
      options: ["A. 0", "B. 1", "C. ∞", "D. Không tồn tại"],
      correct: "B"
    },
    {
      id: 4,
      text: "Ma trận vuông là ma trận?",
      options: [
        "A. Có số hàng = số cột",
        "B. Có số hàng > số cột",
        "C. Có số hàng < số cột",
        "D. Không xác định"
      ],
      correct: "A"
    },
    {
      id: 5,
      text: "Đạo hàm của hằng số là?",
      options: ["A. 1", "B. 0", "C. x", "D. Không xác định"],
      correct: "B"
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60)
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  useEffect(() => {

    const timer = setInterval(() => {

      setTimeRemaining(prev => {

        if (prev <= 1) {
          clearInterval(timer)
          submitExam()
          return 0
        }

        return prev - 1

      })

    }, 1000)

    return () => clearInterval(timer)

  }, [])

  const handleSelectAnswer = (option: string) => {

    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: option
    }))

  }

  const toggleFlag = () => {

    const qId = questions[currentQuestion].id

    if (flagged.includes(qId)) {
      setFlagged(flagged.filter(id => id !== qId))
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

  const submitExam = () => {

    let correctCount = 0

    questions.forEach(q => {

      if (answers[q.id] === q.correct) {
        correctCount++
      }

    })

    const score = ((correctCount / questions.length) * 10).toFixed(2)
    const timeUsed = exam.duration * 60 - timeRemaining

    navigate("/sinhvien/ketqua", {
      state: {
        examName: exam.name,
        correct: correctCount,
        total: questions.length,
        score: score,
        timeUsed: timeUsed
      }
    })

  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (

    <DashboardLayout role="SINH VIÊN">

      {/* Header */}

      <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center mb-6">

        <h1 className="text-lg font-bold text-slate-800">
          {exam.name}
        </h1>

        <div className="flex items-center gap-6">

          <div className={`flex items-center gap-2 font-bold ${timeRemaining < 600 ? "text-red-600" : "text-green-600"}`}>
            <Clock size={20} />
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
          >
            Nộp bài
          </button>

        </div>

      </div>

      {/* Layout */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Question */}

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
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
              ${flagged.includes(questions[currentQuestion].id)
                  ? "bg-red-600 text-white border-red-600"
                  : "border-slate-300"
                }`}
            >
              <Flag size={16} />
              Đặt cờ
            </button>

          </div>

          <h2 className="text-xl font-bold mb-6">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-3">

            {questions[currentQuestion].options.map((option, idx) => (

              <button
                key={idx}
                onClick={() => handleSelectAnswer(option.charAt(0))}
                className={`w-full p-4 text-left rounded-lg border
                ${answers[questions[currentQuestion].id] === option.charAt(0)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:bg-slate-50"
                  }`}
              >

                <div className="flex items-center">

                  <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center
                  ${answers[questions[currentQuestion].id] === option.charAt(0)
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-slate-300"
                    }`}>

                    {answers[questions[currentQuestion].id] === option.charAt(0) &&
                      <CheckCircle size={16} className="text-white" />}

                  </div>

                  {option}

                </div>

              </button>

            ))}

          </div>

          {/* Navigation */}

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

        {/* Sidebar */}

        <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-6">

          <h3 className="font-semibold mb-4">
            Danh sách câu hỏi
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

      {/* Submit Modal */}

      {showSubmitModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">

            <h3 className="text-lg font-bold mb-4">
              Xác nhận nộp bài
            </h3>

            <p className="text-slate-600 mb-6">
              Bạn có chắc muốn nộp bài không?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Hủy
              </button>

              <button
                onClick={submitExam}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Nộp bài
              </button>

            </div>

          </div>

        </div>

      )}

    </DashboardLayout>

  )

}