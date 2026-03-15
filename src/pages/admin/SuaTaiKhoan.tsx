import DashboardLayout from "../../layout/DashboardLayout"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, RefreshCcw, CheckCircle } from "lucide-react"

export default function SuaTaiKhoan() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [showToast, setShowToast] = useState(false)

    const [formData, setFormData] = useState({
        name: "Nguyễn Văn A",
        email: "sv001@example.com",
        password: "",
        role: "Sinh viên",
        status: "Hoạt động"
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleRoleChange = (role: string) => {
        setFormData({
            ...formData,
            role
        })
    }

    const handleStatusChange = (status: string) => {
        setFormData({
            ...formData,
            status
        })
    }

    const generatePassword = () => {

        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let pass = ""

        for (let i = 0; i < 8; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)]
        }

        setFormData({
            ...formData,
            password: pass
        })
    }

    const getPasswordStrength = () => {

        const length = formData.password.length

        if (length === 0) return ""
        if (length < 6) return "Yếu"
        if (length < 10) return "Trung bình"
        return "Mạnh"
    }

    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault()

        console.log("Cập nhật tài khoản:", id, formData)

        setShowToast(true)

        setTimeout(() => {
            setShowToast(false)
            navigate("/admin/accounts")
        }, 1500)
    }

    return (
        <DashboardLayout role="ADMIN">

            {/* Header */}
            <div className="mb-8">

                <button
                    onClick={() => navigate("/admin/accounts")}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-4"
                >
                    <ArrowLeft size={18} />
                    Quay lại
                </button>

                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                    Sửa tài khoản
                </h1>

                <p className="text-slate-600 mt-2">
                    Cập nhật thông tin tài khoản
                </p>

            </div>


            <div className="max-w-4xl">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">

                    <form onSubmit={handleSubmit} className="space-y-7">

                        {/* Avatar */}
                        <div className="flex items-center gap-4">

                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                alt="avatar"
                                className="w-16 h-16 rounded-full border"
                            />

                            <div className="text-sm text-slate-500">
                                Avatar được tạo theo tên người dùng
                            </div>

                        </div>


                        {/* Name */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Họ và tên
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />

                        </div>


                        {/* Email */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />

                        </div>


                        {/* Password */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Mật khẩu mới
                            </label>

                            <div className="flex gap-2">

                                <input
                                    type="text"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Để trống nếu không đổi mật khẩu"
                                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2"
                                >
                                    <RefreshCcw size={16} />
                                    Tạo
                                </button>

                            </div>

                            {formData.password && (
                                <p className="text-sm mt-2 text-slate-500">
                                    Độ mạnh mật khẩu: <b>{getPasswordStrength()}</b>
                                </p>
                            )}

                        </div>


                        {/* Role */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Vai trò
                            </label>

                            <div className="grid grid-cols-3 gap-4">

                                {["Admin", "Giáo viên", "Sinh viên"].map((role) => {

                                    const active = formData.role === role

                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => handleRoleChange(role)}
                                            className={`border rounded-xl py-3 text-sm font-semibold transition
                      ${active
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                    : "border-slate-300 hover:border-indigo-400"
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    )
                                })}

                            </div>

                        </div>


                        {/* Status */}
                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Trạng thái
                            </label>

                            <div className="grid grid-cols-2 gap-4">

                                {["Hoạt động", "Khóa"].map((status) => {

                                    const active = formData.status === status

                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => handleStatusChange(status)}
                                            className={`border rounded-xl py-3 text-sm font-semibold transition
                      ${active
                                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                    : "border-slate-300 hover:border-indigo-400"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    )
                                })}

                            </div>

                        </div>


                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">

                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
                            >
                                <Save size={18} />
                                Lưu thay đổi
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/accounts")}
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

                        Cập nhật tài khoản thành công

                    </div>

                </div>

            )}

        </DashboardLayout>
    )
}