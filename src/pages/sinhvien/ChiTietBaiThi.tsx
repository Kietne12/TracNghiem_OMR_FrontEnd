import DashboardLayout from "../../layout/DashboardLayout"
import { useParams, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function ChiTietBaiThi() {

    const { id } = useParams()
    const navigate = useNavigate()

    const exam = {
        name: "Toán cao cấp 1 - Giữa kỳ",
        score: 8.5,
        correct: 4,
        total: 10
    }

    const questions = [
        {
            id: 1,
            question: "Đạo hàm của x² là gì?",
            options: ["A. 2x", "B. x", "C. x²", "D. 1"],
            correct: "A",
            selected: "A"
        },
        {
            id: 2,
            question: "Giới hạn lim(x→0) sinx/x bằng?",
            options: ["A. 0", "B. 1", "C. ∞", "D. Không tồn tại"],
            correct: "B",
            selected: "B"
        },
        {
            id: 3,
            question: "Ma trận vuông là gì?",
            options: [
                "A. Số hàng = số cột",
                "B. Số hàng > số cột",
                "C. Số hàng < số cột",
                "D. Không xác định"
            ],
            correct: "A",
            selected: "C"
        },
        {
            id: 4,
            question: "Stack hoạt động theo nguyên tắc?",
            options: ["A. FIFO", "B. LIFO", "C. Random", "D. Queue"],
            correct: "B",
            selected: "B"
        },
        {
            id: 5,
            question: "Đạo hàm của hằng số?",
            options: ["A. 0", "B. 1", "C. x", "D. Không xác định"],
            correct: "A",
            selected: "A"
        },
        {
            id: 6,
            question: "Queue hoạt động theo nguyên tắc?",
            options: ["A. FIFO", "B. LIFO", "C. Random", "D. Stack"],
            correct: "A",
            selected: "A"
        },
        {
            id: 7,
            question: "C++ là ngôn ngữ gì?",
            options: ["A. OOP", "B. Script", "C. Markup", "D. Database"],
            correct: "A",
            selected: "A"
        },
        {
            id: 8,
            question: "HTML là gì?",
            options: ["A. Programming", "B. Markup", "C. Database", "D. Server"],
            correct: "B",
            selected: "B"
        },
        {
            id: 9,
            question: "SQL dùng để?",
            options: ["A. Thiết kế UI", "B. Quản lý database", "C. Game", "D. AI"],
            correct: "B",
            selected: "B"
        },
        {
            id: 10,
            question: "React là thư viện của?",
            options: ["A. Google", "B. Facebook", "C. Microsoft", "D. Amazon"],
            correct: "B",
            selected: "B"
        }
    ]

    const wrong = exam.total - exam.correct
    const percent = ((exam.correct / exam.total) * 100).toFixed(0)

    /* Pagination */

    const questionsPerPage = 5
    const [page, setPage] = useState(1)

    const totalPages = Math.ceil(questions.length / questionsPerPage)

    const start = (page - 1) * questionsPerPage
    const end = start + questionsPerPage

    const currentQuestions = questions.slice(start, end)

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

                    {currentQuestions.map((q, index) => (

                        <div key={q.id} className="bg-white border rounded-lg p-6 shadow-sm">

                            <p className="font-semibold mb-4">
                                Câu {start + index + 1}: {q.question}
                            </p>

                            <div className="space-y-2">

                                {q.options.map((opt, i) => {

                                    const letter = opt.charAt(0)
                                    const isSelected = q.selected === letter
                                    const isCorrect = q.correct === letter

                                    return (

                                        <div
                                            key={i}
                                            className={`p-3 rounded-lg border
                      ${isCorrect
                                                    ? "border-green-500 bg-green-50"
                                                    : isSelected
                                                        ? "border-red-500 bg-red-50"
                                                        : "border-slate-200"
                                                }`}
                                        >
                                            {opt}
                                        </div>

                                    )

                                })}

                            </div>

                            <div className="mt-4 text-sm">

                                <p>
                                    Bạn chọn: <span className="font-semibold">{q.selected}</span>
                                </p>

                                <p className="text-green-600">
                                    Đáp án đúng: {q.correct}
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