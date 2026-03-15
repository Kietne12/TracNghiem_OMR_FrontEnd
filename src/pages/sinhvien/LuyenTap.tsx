import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, Flag, CheckCircle, Brain } from "lucide-react"
import { useState, useEffect } from "react"

type Question = {
    text: string
    options: string[]
    correct: string
}

export default function LuyenTap() {

    const subjects = [
        "Toán cao cấp",
        "Cấu trúc dữ liệu",
        "Lập trình C++"
    ]

    const questionBank: Question[] = [
        {
            text: "Đạo hàm của x² là?",
            options: ["A. 2x", "B. x", "C. 2", "D. x²"],
            correct: "A"
        },
        {
            text: "Stack hoạt động theo nguyên tắc?",
            options: ["A. FIFO", "B. LIFO", "C. Random", "D. Tree"],
            correct: "B"
        },
        {
            text: "C++ là ngôn ngữ?",
            options: [
                "A. Lập trình hướng đối tượng",
                "B. Script",
                "C. Markup",
                "D. Database"
            ],
            correct: "A"
        },
        {
            text: "Queue hoạt động theo nguyên tắc?",
            options: ["A. LIFO", "B. FIFO", "C. Random", "D. Stack"],
            correct: "B"
        },
        {
            text: "lim sinx/x khi x→0 là?",
            options: ["A. 0", "B. 1", "C. ∞", "D. Không tồn tại"],
            correct: "B"
        }
    ]

    const [started, setStarted] = useState(false)

    const [subject, setSubject] = useState("")
    const [questionCount, setQuestionCount] = useState(5)
    const [duration, setDuration] = useState(5)

    const [questions, setQuestions] = useState<Question[]>([])

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [flagged, setFlagged] = useState<number[]>([])
    const [timeRemaining, setTimeRemaining] = useState(0)

    const [finished, setFinished] = useState(false)
    const [score, setScore] = useState(0)
    const [correctCount, setCorrectCount] = useState(0)

    const [showDetail, setShowDetail] = useState(false)

    useEffect(() => {

        if (!started || finished) return

        const timer = setInterval(() => {

            setTimeRemaining(prev => {

                if (prev <= 1) {
                    clearInterval(timer)
                    alert("Hết thời gian!")
                    submit()
                    return 0
                }

                return prev - 1

            })

        }, 1000)

        return () => clearInterval(timer)

    }, [started, finished])

    const startPractice = () => {

        const shuffled = [...questionBank].sort(() => Math.random() - 0.5)

        const selected = shuffled.slice(0, questionCount)

        setQuestions(selected)

        setTimeRemaining(duration * 60)

        setStarted(true)

    }

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

    const submit = () => {

        let correct = 0

        questions.forEach((q, i) => {
            if (answers[i] === q.correct) correct++
        })

        const result = ((correct / questions.length) * 10).toFixed(2)

        setScore(Number(result))
        setCorrectCount(correct)
        setFinished(true)

    }

    const retry = () => {

        setAnswers({})
        setFlagged([])
        setCurrentQuestion(0)
        setFinished(false)
        setScore(0)
        setCorrectCount(0)
        setTimeRemaining(duration * 60)
        setShowDetail(false)

    }

    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60

    const totalTime = duration * 60
    const percentTime = timeRemaining / totalTime

    const timerColor =
        percentTime <= 0.2
            ? "text-red-600"
            : percentTime <= 0.5
                ? "text-yellow-500"
                : "text-green-600"

    const danger =
        timeRemaining <= 30 ? "animate-pulse text-red-600" : timerColor

    const current = questions[currentQuestion]

    return (
        <DashboardLayout role="SINH VIÊN">

            <div className="max-w-7xl mx-auto">

                {/* Setup */}
                {!started && (

                    <div className="bg-white border rounded-xl p-10 shadow-sm max-w-xl mx-auto">

                        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                            <Brain className="text-indigo-600" />
                            Luyện tập
                        </h1>

                        <div className="space-y-4">

                            <div>
                                <label className="text-sm text-slate-600">Chọn môn học</label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 mt-1"
                                >
                                    <option value="">-- Chọn môn --</option>
                                    {subjects.map((s, i) => (
                                        <option key={i}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-600">Số câu hỏi</label>
                                <select
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2 mt-1"
                                >
                                    <option value={3}>3 câu</option>
                                    <option value={5}>5 câu</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-slate-600">Thời gian</label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full border rounded-lg px-3 py-2 mt-1"
                                >
                                    <option value={3}>3 phút</option>
                                    <option value={5}>5 phút</option>
                                    <option value={10}>10 phút</option>
                                </select>
                            </div>

                            <button
                                disabled={!subject}
                                onClick={startPractice}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg"
                            >
                                Bắt đầu luyện tập
                            </button>

                        </div>

                    </div>

                )}

                {/* Làm bài */}
                {started && !finished && current && (

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        <div className="lg:col-span-3 bg-white border rounded-xl p-8 shadow-sm">

                            <div className="flex justify-between mb-6">

                                <span className="font-semibold text-indigo-600">
                                    Câu {currentQuestion + 1}/{questions.length}
                                </span>

                                <div className={`flex items-center gap-2 font-bold ${danger}`}>
                                    <Clock size={18} />
                                    {String(minutes).padStart(2, "0")}:
                                    {String(seconds).padStart(2, "0")}
                                </div>

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
                                {current.text}
                            </h2>

                            <div className="space-y-3">

                                {current.options.map((option, idx) => (
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

                                            {option}

                                        </div>

                                    </button>
                                ))}

                            </div>

                            <div className="flex justify-between mt-8">

                                <button
                                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                    className="px-6 py-2 border rounded-lg"
                                >
                                    ← Câu trước
                                </button>

                                {currentQuestion === questions.length - 1 ? (

                                    <button
                                        onClick={submit}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg"
                                    >
                                        Nộp bài
                                    </button>

                                ) : (

                                    <button
                                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                                    >
                                        Câu tiếp →
                                    </button>

                                )}

                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm h-fit sticky top-24">

                            <h3 className="font-bold mb-4">Danh sách câu</h3>

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

                )}

                {/* Result */}
                {finished && (

                    <div className="bg-white border rounded-xl p-10 shadow-sm text-center max-w-3xl mx-auto">

                        <h2 className="text-3xl font-bold mb-4">
                            Hoàn thành luyện tập
                        </h2>

                        <p className="text-5xl font-bold text-indigo-600 mb-4">
                            {score}/10
                        </p>

                        <p className="mb-6">
                            Đúng {correctCount}/{questions.length} câu
                        </p>

                        <div className="flex justify-center gap-4">

                            <button
                                onClick={retry}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                            >
                                Làm lại
                            </button>

                            <button
                                onClick={() => setShowDetail(!showDetail)}
                                className="bg-slate-200 px-6 py-2 rounded-lg"
                            >
                                Chi tiết bài làm
                            </button>

                        </div>

                        {showDetail && (

                            <div className="mt-8 text-left">

                                {questions.map((q, i) => {

                                    const correct = answers[i] === q.correct

                                    return (

                                        <div key={i} className="border p-4 rounded-lg mb-3">

                                            <p className="font-semibold">
                                                {i + 1}. {q.text}
                                            </p>

                                            <p>
                                                Bạn chọn: {answers[i] || "Chưa trả lời"}
                                            </p>

                                            <p className={correct ? "text-green-600" : "text-red-600"}>
                                                Đáp án đúng: {q.correct}
                                            </p>

                                        </div>

                                    )

                                })}

                            </div>

                        )}

                    </div>

                )}

            </div>

        </DashboardLayout>
    )
}