import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'


export default function LamBaiThi() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const exam = {
    name: 'Toán cao cấp 1 - Kỳ thi giữa kỳ',
    duration: 90,
    totalQuestions: 50,
    timeRemaining: 45,
  }

  const questions = [
    {
      id: 1,
      text: 'Đạo hàm của hàm số y = x² + 2x là?',
      options: ['A. 2x', 'B. 2x + 2', 'C. 2x + 1', 'D. x + 2'],
      image: null,
    },
    {
      id: 2,
      text: 'Tích phân của hàm số f(x) = 2x là?',
      options: ['A. x²', 'B. x² + C', 'C. 2x + C', 'D. x² + 2C'],
      image: null,
    },
  ]

  const handleSelectAnswer = (option: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: option
    })
  }

  const handleNext = () => {
    if (currentQuestion < exam.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    alert('Nộp bài thi')
  }

  const minutes = Math.floor(exam.timeRemaining / 60)
  const seconds = exam.timeRemaining % 60

  return (
    <DashboardLayout>
      {/* Header with timer */}
      <div className="fixed top-0 right-0 left-64 bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
        <h1 className="text-xl font-bold text-slate-800">{exam.name}</h1>
        <div className="flex items-center gap-8">
          <div className={`flex items-center gap-2 text-lg font-bold ${exam.timeRemaining < 600 ? 'text-red-600' : 'text-green-600'}`}>
            <Clock size={24} />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Nộp bài
          </button>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          {/* Question Info */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-indigo-600">
                Câu {currentQuestion + 1}/{exam.totalQuestions}
              </span>
              <span className="text-sm text-slate-600">
                {Math.round((Object.keys(answers).length / exam.totalQuestions) * 100)}% hoàn thành
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${(Object.keys(answers).length / exam.totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {questions[currentQuestion % questions.length].text}
            </h2>

            {/* Question Image if exists */}
            {questions[currentQuestion % questions.length].image && (
              <img
                src={questions[currentQuestion % questions.length].image || ''}
                alt="Hình ảnh câu hỏi"
                className="mb-8 max-w-full rounded-lg"
              />
            )}

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion % questions.length].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option.charAt(0))}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    answers[currentQuestion] === option.charAt(0)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition ${
                        answers[currentQuestion] === option.charAt(0)
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {answers[currentQuestion] === option.charAt(0) && (
                        <CheckCircle size={20} className="text-white" />
                      )}
                    </div>
                    <span className="font-medium text-slate-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Câu trước
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === exam.totalQuestions - 1}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Câu tiếp →
            </button>
          </div>
        </div>

        {/* Question Index Sidebar */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-32">
          <h3 className="font-bold text-slate-800 mb-4">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
            {Array.from({ length: exam.totalQuestions }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`p-2 rounded font-medium text-sm transition ${
                  currentQuestion === idx
                    ? 'bg-indigo-600 text-white'
                    : answers[idx]
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100"></div>
              <span className="text-slate-600">Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-100"></div>
              <span className="text-slate-600">Chưa trả lời</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
