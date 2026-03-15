import DashboardLayout from "../../layout/DashboardLayout"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function ThemMonHoc() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        credits: 3,
        semester: 1,
        year: "2025-2026",
        teacher: ""
    })

    const [showSuccess, setShowSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault()

        console.log("Môn học mới:", formData)

        setShowSuccess(true)

        setTimeout(() => {
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
                    Thêm môn học
                </h1>

                <p className="text-slate-600 mt-2">
                    Nhập thông tin để tạo môn học mới
                </p>

            </div>


            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-10 max-w-4xl">

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                    {/* Mã môn */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Mã môn học
                        </label>

                        <input
                            type="text"
                            name="code"
                            required
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Ví dụ: CNTT101"
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
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ví dụ: Cấu trúc dữ liệu"
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
                            required
                            value={formData.teacher}
                            onChange={handleChange}
                            placeholder="Nhập tên giảng viên"
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>


                    {/* Buttons */}
                    <div className="col-span-2 flex justify-end gap-4 pt-4">

                        <button
                            type="button"
                            onClick={() => navigate("/admin/subjects")}
                            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-md"
                        >
                            <Save size={18} />
                            Lưu môn học
                        </button>

                    </div>

                </form>

            </div>


            {/* Success Toast */}
            {showSuccess && (

                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">

                    <CheckCircle size={22} />

                    <span className="font-medium">
                        Thêm môn học thành công!
                    </span>

                </div>

            )}

        </DashboardLayout>
    )
}