import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layout/DashboardLayout"
import { Calendar, Clock, BookOpen, FileText } from "lucide-react"

export default function DanhSachKyThi() {

    const navigate = useNavigate()

    const exams = [
        {
            id: 1,
            subject: "Cấu trúc dữ liệu",
            title: "Giữa kỳ",
            date: "15/03/2026",
            time: "08:00",
            duration: 90,
            questions: 40,
            status: "Đang diễn ra"
        },
        {
            id: 2,
            subject: "Toán cao cấp",
            title: "Kiểm tra chương 2",
            date: "16/03/2026",
            time: "13:00",
            duration: 60,
            questions: 30,
            status: "Sắp diễn ra"
        },
        {
            id: 3,
            subject: "Lập trình C++",
            title: "Cuối kỳ",
            date: "18/03/2026",
            time: "10:00",
            duration: 120,
            questions: 50,
            status: "Đã kết thúc"
        }
    ]

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("Tất cả")
    const [subjectFilter, setSubjectFilter] = useState("Tất cả")

    const subjects = ["Tất cả", ...new Set(exams.map(e => e.subject))]

    const filteredExams = exams.filter(exam => {

        const matchSearch =
            exam.title.toLowerCase().includes(search.toLowerCase()) ||
            exam.subject.toLowerCase().includes(search.toLowerCase())

        const matchStatus =
            statusFilter === "Tất cả" || exam.status === statusFilter

        const matchSubject =
            subjectFilter === "Tất cả" || exam.subject === subjectFilter

        return matchSearch && matchStatus && matchSubject

    })

    const getStatusStyle = (status: string) => {
        if (status === "Đang diễn ra") return "bg-green-100 text-green-700"
        if (status === "Sắp diễn ra") return "bg-blue-100 text-blue-700"
        return "bg-gray-100 text-gray-600"
    }

    const getButtonText = (status: string) => {
        if (status === "Đang diễn ra") return "Vào thi"
        if (status === "Sắp diễn ra") return "Chưa mở"
        return "Đã đóng"
    }

    return (
        <DashboardLayout role="SINH VIÊN">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Danh sách kỳ thi
                </h1>
                <p className="text-slate-600">
                    Chọn kỳ thi để bắt đầu làm bài
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">

                <input
                    type="text"
                    placeholder="Tìm kỳ thi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 flex-1"
                />

                <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2"
                >
                    {subjects.map(sub => (
                        <option key={sub}>{sub}</option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2"
                >
                    <option>Tất cả</option>
                    <option>Đang diễn ra</option>
                    <option>Sắp diễn ra</option>
                    <option>Đã kết thúc</option>
                </select>

            </div>

            {/* Exam list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {filteredExams.map((exam) => (

                    <div
                        key={exam.id}
                        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
                    >

                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="text-indigo-600" size={22} />
                            <h2 className="text-lg font-semibold text-slate-800">
                                {exam.title}
                            </h2>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                            Môn học: {exam.subject}
                        </p>

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

                        <div className="mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(exam.status)}`}>
                                {exam.status}
                            </span>
                        </div>

                        <button
                            disabled={exam.status !== "Đang diễn ra"}
                            onClick={() => navigate(`/sinhvien/lam-bai/${exam.id}`)}
                            className={`w-full py-2 rounded-lg font-medium transition
              ${exam.status === "Đang diễn ra"
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        >
                            {getButtonText(exam.status)}
                        </button>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    )
}