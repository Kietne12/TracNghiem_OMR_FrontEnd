import DashboardLayout from "../../layout/DashboardLayout"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function ThemMonHoc() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        desc: ""
    })

    const [showSuccess, setShowSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    // 🔥 CALL API
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!formData.name) {
            alert("Nhập tên môn học")
            return
        }

        try {
            await fetch("http://localhost:5000/api/admin/subjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ten_mon_hoc: formData.name,
                    mo_ta: formData.desc
                })
            })

            setShowSuccess(true)

            setTimeout(() => {
                navigate("/admin/subjects")
            }, 1200)

        } catch (err) {
            alert("Thêm thất bại")
        }
    }

    return (
        <DashboardLayout role="ADMIN">

            {/* HEADER */}
            <div className="mb-10">

                <button
                    onClick={() => navigate("/admin/subjects")}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4"
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>

                <h1 className="text-4xl font-bold text-indigo-600">
                    Thêm môn học
                </h1>

                <p className="text-slate-500 mt-2">
                    Nhập thông tin để tạo môn học
                </p>

            </div>

            {/* FORM */}
            <div className="flex justify-center">

                <div className="w-full max-w-3xl">

                    <div className="bg-white p-10 rounded-2xl shadow-md border border-slate-200">

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* TÊN MÔN */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block">
                                    Tên môn học
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Cơ sở dữ liệu"
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* MÔ TẢ */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block">
                                    Mô tả
                                </label>

                                <textarea
                                    name="desc"
                                    value={formData.desc}
                                    onChange={handleChange}
                                    placeholder="Mô tả môn học..."
                                    className="w-full border px-4 py-3 rounded-xl h-28 resize-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* BUTTON */}
                            <div className="pt-4 flex justify-end gap-4">

                                <button
                                    type="button"
                                    onClick={() => navigate("/admin/subjects")}
                                    className="px-6 py-3 border rounded-xl hover:bg-slate-100"
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90"
                                >
                                    <Save size={18} />
                                    Lưu môn học
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

            {/* TOAST */}
            {showSuccess && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow flex gap-2">
                    <CheckCircle size={20} />
                    Thêm thành công
                </div>
            )}

        </DashboardLayout>
    )
}