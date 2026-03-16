import DashboardLayout from "../../layout/DashboardLayout"
import { Calendar, Clock, FileText } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

export default function DanhSachBaiThi() {

    const { subjectId } = useParams()
    const navigate = useNavigate()

    const exams = [
        {
            id: 1,
            subjectId: "1",
            title: "Giữa kỳ",
            date: "15/03/2026",
            time: "08:00",
            duration: 90,
            questions: 40,
            status: "Đang diễn ra",
            score: null
        },
        {
            id: 2,
            subjectId: "1",
            title: "Kiểm tra chương 2",
            date: "20/03/2026",
            time: "13:00",
            duration: 60,
            questions: 30,
            status: "Chưa đến giờ",
            score: null
        },
        {
            id: 3,
            subjectId: "2",
            title: "Cuối kỳ",
            date: "10/03/2026",
            time: "09:00",
            duration: 60,
            questions: 30,
            status: "Đã làm",
            score: 8.5
        }
    ]

    const subjectExams = exams.filter(e => e.subjectId === subjectId)

    const getButton = (exam: any) => {

        if (exam.status === "Đang diễn ra") {
            return (
                <button
                    onClick={() => navigate(`/sinhvien/lam-bai/${exam.id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    Làm bài
                </button>
            )
        }

        if (exam.status === "Chưa đến giờ") {
            return (
                <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
                >
                    Chưa đến giờ
                </button>
            )
        }

        return (
            <button
                disabled
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
                Đã làm
            </button>
        )
    }

    return (
        <DashboardLayout role="SINH VIÊN">

            {/* Header */}
            <div className="mb-6">

                <button
                    onClick={() => navigate("/sinhvien/ky-thi")}
                    className="mb-4 text-indigo-600"
                >
                    ← Quay lại
                </button>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Danh sách bài thi
                </h1>

            </div>

            {/* Không có bài thi */}
            {subjectExams.length === 0 && (
                <div className="text-slate-500">
                    Không có kỳ thi hoặc kiểm tra nào
                </div>
            )}

            {/* Danh sách bài thi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {subjectExams.map((exam) => (

                    <div
                        key={exam.id}
                        className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
                    >

                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            {exam.title}
                        </h2>

                        <div className="space-y-2 text-sm text-slate-600 mb-4">

                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {exam.date}
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {exam.time}
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                Thời gian: {exam.duration} phút
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                Số câu: {exam.questions}
                            </div>

                        </div>

                        {exam.score && (
                            <div className="mb-3 text-green-600 font-semibold">
                                Điểm: {exam.score}
                            </div>
                        )}

                        {getButton(exam)}

                    </div>

                ))}

            </div>

        </DashboardLayout>
    )
}