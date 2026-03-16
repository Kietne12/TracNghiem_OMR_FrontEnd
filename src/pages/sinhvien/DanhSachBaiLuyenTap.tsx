import DashboardLayout from "../../layout/DashboardLayout"
import { Clock, FileText, BookOpen } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

export default function DanhSachBaiLuyenTap() {

    const { subjectId } = useParams()
    const navigate = useNavigate()

    const practices = [
        {
            id: 1,
            subjectId: "1",
            title: "Luyện tập chương 1",
            duration: 15,
            questions: 10,
            attempts: 3,
            lastScore: 8
        },
        {
            id: 2,
            subjectId: "1",
            title: "Luyện tập Stack & Queue",
            duration: 20,
            questions: 12,
            attempts: 1,
            lastScore: 7.5
        },
        {
            id: 3,
            subjectId: "2",
            title: "Luyện tập đạo hàm",
            duration: 15,
            questions: 10,
            attempts: 2,
            lastScore: 9
        },
        {
            id: 4,
            subjectId: "3",
            title: "Luyện tập OOP cơ bản",
            duration: 20,
            questions: 12,
            attempts: 0,
            lastScore: null
        }
    ]

    const subjectPractices = practices.filter(
        p => p.subjectId === subjectId
    )

    return (

        <DashboardLayout role="SINH VIÊN">

            {/* Header */}

            <div className="mb-6">

                <button
                    onClick={() => navigate("/sinhvien/luyen-tap")}
                    className="mb-4 text-indigo-600"
                >
                    ← Quay lại
                </button>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Danh sách bài luyện tập
                </h1>

            </div>


            {/* Không có bài */}

            {subjectPractices.length === 0 && (

                <div className="text-slate-500">
                    Chưa có bài luyện tập cho môn này
                </div>

            )}


            {/* Danh sách bài */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {subjectPractices.map((practice) => (

                    <div
                        key={practice.id}
                        className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
                    >

                        <div className="flex items-center gap-3 mb-4">

                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
                                <BookOpen size={20} />
                            </div>

                            <h2 className="text-lg font-semibold text-slate-800">
                                {practice.title}
                            </h2>

                        </div>


                        <div className="space-y-2 text-sm text-slate-600 mb-4">

                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                Thời gian: {practice.duration} phút
                            </div>

                            <div className="flex items-center gap-2">
                                <FileText size={16} />
                                Số câu: {practice.questions}
                            </div>

                            <div>
                                Số lần làm: {practice.attempts}
                            </div>

                        </div>


                        {practice.lastScore && (

                            <div className="mb-3 text-green-600 font-semibold">

                                Điểm gần nhất: {practice.lastScore}

                            </div>

                        )}


                        <button
                            onClick={() => navigate(`/sinhvien/luyen-tap/lam-bai/${practice.id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >

                            Luyện tập

                        </button>

                    </div>

                ))}

            </div>

        </DashboardLayout>

    )
}