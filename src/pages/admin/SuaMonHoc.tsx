import DashboardLayout from "../../layout/DashboardLayout"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"

export default function SuaMonHoc() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [showToast, setShowToast] = useState(false)

    const [formData, setFormData] = useState({
        code: "CNTT101",
        name: "Cấu trúc dữ liệu",
        credits: 3,
        semester: 1,
        year: "2025-2026",
        teacher: "Nguyễn Văn B"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault()

        console.log("Cập nhật môn học:", id, formData)

        setShowToast(true)

        setTimeout(() => {
            setShowToast(false)
            navigate("/admin/subjects")
        }, 1500)
    }

    return (
        <DashboardLayout role="ADMIN">

            {/* Header */}
            <div className="mb-8">

                <button
                    onClick={() => navigate("/admin/subjects")}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-4"
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                    Sửa môn học
                </h1>

                <p className="text-slate-600 mt-2">
                    Cập nhật thông tin môn học
                </p>

            </div>


            {/* Form */}
            <div className="max-w-4xl">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                        {/* Mã môn */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mã môn học
                            </label>

                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>


                        {/* Tên môn */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Tên môn học
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>


                        {/* Tín chỉ */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Số tín chỉ
                            </label>

                            <input
                                type="number"
                                name="credits"
                                min={1}
                                max={6}
                                value={formData.credits}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>


                        {/* Học kỳ */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Học kỳ
                            </label>

                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3"
                            >
                                <option value={1}>HK1</option>
                                <option value={2}>HK2</option>
                            </select>
                        </div>


                        {/* Năm học */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Năm học
                            </label>

                            <select
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3"
                            >
                                <option value="2025-2026">2025-2026</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2023-2024">2023-2024</option>
                            </select>
                        </div>


                        {/* Giảng viên */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Giảng viên
                            </label>

                            <input
                                type="text"
                                name="teacher"
                                value={formData.teacher}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>


                        {/* Buttons */}
                        <div className="col-span-2 flex gap-4 pt-6">

                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
                            >
                                <Save size={18} />
                                Lưu thay đổi
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/subjects")}
                                className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
                            >
                                Hủy
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* Success Toast */}
            {showToast && (

                <div className="fixed top-6 right-6 z-50">

                    <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">

                        <CheckCircle size={20} />

                        Cập nhật môn học thành công

                    </div>

                </div>

            )}

        </DashboardLayout>
    )
}