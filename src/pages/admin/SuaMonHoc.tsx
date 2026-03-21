import DashboardLayout from "../../layout/DashboardLayout"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"

export default function SuaMonHoc() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [showToast, setShowToast] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        desc: ""
    })

    // 🔥 LOAD DATA
    const fetchSubject = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/subjects/${id}`)
            const data = await res.json()

            setFormData({
                name: data.ten_mon_hoc || "",
                desc: data.mo_ta || ""
            })

        } catch {
            alert("Không load được dữ liệu")
        }
    }

    useEffect(() => {
        fetchSubject()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    // 🔥 UPDATE API
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!formData.name) {
            alert("Nhập tên môn học")
            return
        }

        try {
            await fetch(`http://localhost:5000/api/admin/subjects/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ten_mon_hoc: formData.name,
                    mo_ta: formData.desc
                })
            })

            setShowToast(true)

            setTimeout(() => {
                navigate("/admin/subjects")
            }, 1200)

        } catch {
            alert("Cập nhật thất bại")
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
                    Sửa môn học
                </h1>

                <p className="text-slate-500 mt-2">
                    Cập nhật thông tin môn học
                </p>

            </div>

            {/* FORM */}
            <div className="flex justify-center">

                <div className="w-full max-w-3xl">

                    <div className="bg-white p-10 rounded-2xl shadow-md border border-slate-200">

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* TÊN */}
                            <div>
                                <label className="text-sm font-semibold mb-2 block">
                                    Tên môn học
                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
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
                                    Lưu thay đổi
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

            {/* TOAST */}
            {showToast && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow flex gap-2">
                    <CheckCircle size={20} />
                    Cập nhật thành công
                </div>
            )}

        </DashboardLayout>
    )
}