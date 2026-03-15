import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, CheckCircle, Flag } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export default function LamBaiThi() {

  const { user } = useAuth()
  const { examId } = useParams()
  const navigate = useNavigate()

  const exam = {
    name: "Toán cao cấp 1 - Kỳ thi giữa kỳ",
    duration: 90,
    totalQuestions: 5,
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

      setTimeRemaining((prev) => {

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

    setAnswers({
      ...answers,
      [currentQuestion]: option
    })

  }

  const toggleFlag = () => {

    if (flagged.includes(currentQuestion)) {
      setFlagged(flagged.filter(q => q !== currentQuestion))
    } else {
      setFlagged([...flagged, currentQuestion])
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

    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++
      }
    })

    const score = ((correctCount / questions.length) * 10).toFixed(2)

    // 👉 tính thời gian đã làm
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

  const handleSubmit = () => {
    setShowSubmitModal(true)
  }

  const confirmSubmitExam = () => {
    setShowSubmitModal(false)
    submitExam()
  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <DashboardLayout role="SINH VIÊN">

      {/* Header */}
      <div className="fixed top-0 right-0 left-64 bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">

        <h1 className="text-xl font-bold text-slate-800">
          {exam.name} (ID: {examId})
        </h1>

        <div className="flex items-center gap-8">

          <div className={`flex items-center gap-2 text-lg font-bold ${timeRemaining < 600 ? "text-red-600" : "text-green-600"}`}>
            <Clock size={24} />
            <span>
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Nộp bài
          </button>

        </div>

      </div>

      <div className="pt-24 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Question */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border p-8">

          <div className="flex justify-between mb-6">

            <span className="font-semibold text-indigo-600">
              Câu {currentQuestion + 1}/{questions.length}
            </span>

            <span className="text-slate-600">
              {Math.round((Object.keys(answers).length / questions.length) * 100)}% hoàn thành
            </span>

          </div>

          <div className="flex justify-end mb-4">

            <button
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
              ${flagged.includes(currentQuestion)
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white border-slate-300"
                }`}
            >
              <Flag size={16} />
              {flagged.includes(currentQuestion) ? "Bỏ cờ" : "Đặt cờ"}
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
                className={`w-full p-4 text-left rounded-lg border-2
                ${answers[currentQuestion] === option.charAt(0)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-slate-300"
                  }`}
              >

                <div className="flex items-center">

                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                  ${answers[currentQuestion] === option.charAt(0)
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-slate-300"
                    }`}>

                    {answers[currentQuestion] === option.charAt(0) &&
                      <CheckCircle size={18} className="text-white" />}

                  </div>

                  <span>{option}</span>

                </div>

              </button>

            ))}

          </div>

          <div className="flex justify-between mt-8">

            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border rounded-lg disabled:opacity-50"
            >
              ← Câu trước
            </button>

            {currentQuestion === questions.length - 1 ? (

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg"
              >
                Làm xong
              </button>

            ) : (

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Câu tiếp →
              </button>

            )}

          </div>

        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 h-fit sticky top-32">

          <h3 className="font-bold mb-4">Danh sách câu hỏi</h3>

          <div className="grid grid-cols-5 gap-2">

            {questions.map((_, idx) => (

              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`relative p-2 rounded text-sm font-medium
                ${currentQuestion === idx
                    ? "bg-indigo-600 text-white"
                    : answers[idx]
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
              >

                {idx + 1}

                {flagged.includes(idx) && (
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
                onClick={confirmSubmitExam}
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