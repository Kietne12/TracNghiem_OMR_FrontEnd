import DashboardLayout from "../../layout/DashboardLayout"
import { CheckCircle, RotateCcw, FileText } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function KetQuaLuyenTap() {

    const navigate = useNavigate()
    const location = useLocation()

    const {
        score,
        correct,
        total,
        questions,
        answers
    } = location.state || {}

    const [showDetail, setShowDetail] = useState(false)

    if (!score) {
        return (
            <DashboardLayout role="SINH VIÊN">
                <div className="text-center text-slate-500">
                    Không có dữ liệu kết quả
                </div>
            </DashboardLayout>
        )
    }

    return (

        <DashboardLayout role="SINH VIÊN">

            <div className="max-w-3xl mx-auto bg-white border rounded-xl p-10 shadow-sm text-center">

                <CheckCircle className="mx-auto text-green-600 mb-4" size={60} />

                <h2 className="text-3xl font-bold mb-4">
                    Hoàn thành luyện tập
                </h2>

                <p className="text-5xl font-bold text-indigo-600 mb-4">
                    {score}/10
                </p>

                <p className="text-slate-600 mb-6">
                    Đúng {correct}/{total} câu
                </p>

                {/* Buttons */}

                <div className="flex justify-center gap-4 mb-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg"
                    >
                        <RotateCcw size={18} />
                        Làm lại
                    </button>

                    <button
                        onClick={() => setShowDetail(!showDetail)}
                        className="flex items-center gap-2 bg-slate-200 px-5 py-2 rounded-lg"
                    >
                        <FileText size={18} />
                        Chi tiết bài làm
                    </button>

                </div>


                {/* Detail */}

                {showDetail && (

                    <div className="text-left mt-6 space-y-4">

                        {questions.map((q: any, i: number) => {

                            const userAnswer = answers[q.id]
                            const correct = userAnswer === q.correct

                            return (

                                <div
                                    key={q.id}
                                    className="border rounded-lg p-4"
                                >

                                    <p className="font-semibold mb-2">
                                        {i + 1}. {q.text}
                                    </p>

                                    <p>
                                        Bạn chọn: {userAnswer || "Chưa trả lời"}
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

        </DashboardLayout>

    )
}