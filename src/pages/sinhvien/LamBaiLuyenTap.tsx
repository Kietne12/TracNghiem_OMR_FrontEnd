import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, CheckCircle, Flag } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function LamBaiLuyenTap() {

    const { practiceId } = useParams()
    const navigate = useNavigate()

    const practice = {
        id: practiceId,
        name: "Luyện tập trắc nghiệm",
        duration: 15
    }

    const questions = [
        {
            id: 1,
            text: "Stack hoạt động theo nguyên tắc nào?",
            options: ["A. FIFO", "B. LIFO", "C. Random", "D. Queue"],
            correct: "B"
        },
        {
            id: 2,
            text: "Đạo hàm của x² là?",
            options: ["A. 2x", "B. x²", "C. x", "D. 2"],
            correct: "A"
        },
        {
            id: 3,
            text: "Queue hoạt động theo nguyên tắc?",
            options: ["A. FIFO", "B. LIFO", "C. Stack", "D. Random"],
            correct: "A"
        },
        {
            id: 4,
            text: "C++ là ngôn ngữ?",
            options: [
                "A. Lập trình hướng đối tượng",
                "B. Markup",
                "C. Database",
                "D. Script"
            ],
            correct: "A"
        },
        {
            id: 5,
            text: "lim sinx/x khi x → 0 bằng?",
            options: ["A. 0", "B. 1", "C. ∞", "D. Không tồn tại"],
            correct: "B"
        }
    ]

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [flagged, setFlagged] = useState<number[]>([])
    const [timeRemaining, setTimeRemaining] = useState(practice.duration * 60)

    useEffect(() => {

        const timer = setInterval(() => {

            setTimeRemaining(prev => {

                if (prev <= 1) {
                    clearInterval(timer)
                    submitPractice()
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

    const submitPractice = () => {

        let correct = 0

        questions.forEach(q => {

            if (answers[q.id] === q.correct) {
                correct++
            }

        })

        const score = ((correct / questions.length) * 10).toFixed(2)

        navigate("/sinhvien/ketqua-luyen-tap", {
            state: {
                score: score,
                correct: correct,
                total: questions.length,
                questions: questions,
                answers: answers
            }
        })

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
                                onClick={() => handleSelectAnswer(option.charAt(0))}
                                className={`w-full p-4 text-left rounded-lg border
                ${answers[current.id] === option.charAt(0)
                                        ? "border-indigo-600 bg-indigo-50"
                                        : "border-slate-200 hover:bg-slate-50"
                                    }`}
                            >

                                <div className="flex items-center">

                                    <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center
                  ${answers[current.id] === option.charAt(0)
                                            ? "bg-indigo-600 border-indigo-600"
                                            : "border-slate-300"
                                        }`}>

                                        {answers[current.id] === option.charAt(0) &&
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
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            disabled={currentQuestion === 0}
                            className="px-5 py-2 border rounded-lg disabled:opacity-50"
                        >
                            ← Câu trước
                        </button>

                        {currentQuestion === questions.length - 1 ? (

                            <button
                                onClick={submitPractice}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Nộp bài
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