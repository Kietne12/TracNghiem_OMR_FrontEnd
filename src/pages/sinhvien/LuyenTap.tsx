import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layout/DashboardLayout"
import { BookOpen, Calendar, Brain } from "lucide-react"

export default function LuyenTap() {

    const navigate = useNavigate()

    const [year, setYear] = useState("2025-2026")
    const [semester, setSemester] = useState("HK2")

    const subjects = [
        {
            id: 1,
            name: "Cấu trúc dữ liệu",
            desc: "Stack, Queue, Linked List, Tree"
        },
        {
            id: 2,
            name: "Toán cao cấp",
            desc: "Đạo hàm, tích phân và các bài toán ứng dụng"
        },
        {
            id: 3,
            name: "Lập trình C++",
            desc: "Lập trình hướng đối tượng và STL"
        }
    ]

    return (
        <DashboardLayout role="SINH VIÊN">

            {/* Header */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Brain className="text-indigo-600" />
                    Luyện tập
                </h1>

                <p className="text-slate-500">
                    Chọn môn học để luyện tập trắc nghiệm
                </p>

            </div>


            {/* Bộ lọc */}

            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 flex flex-wrap gap-4 items-center">

                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} />
                    <span className="text-sm font-medium">
                        Năm học
                    </span>
                </div>

                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >

                    <option>2025-2026</option>
                    <option>2024-2025</option>

                </select>


                <div className="flex items-center gap-2 text-slate-600 ml-4">
                    <span className="text-sm font-medium">
                        Học kỳ
                    </span>
                </div>

                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >

                    <option>HK1</option>
                    <option>HK2</option>

                </select>

            </div>


            {/* Danh sách môn */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {subjects.map((subject) => (

                    <div
                        key={subject.id}
                        onClick={() => navigate(`/sinhvien/luyen-tap/${subject.id}`)}
                        className="bg-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                    >

                        <div className="flex items-center gap-4 mb-4">

                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
                                <BookOpen size={24} />
                            </div>

                            <h2 className="font-semibold text-lg text-slate-800">
                                {subject.name}
                            </h2>

                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed">
                            {subject.desc}
                        </p>

                        <div className="mt-6 text-indigo-600 text-sm font-medium">
                            Luyện tập →
                        </div>

                    </div>

                ))}

            </div>

        </DashboardLayout>
    )
}