import DashboardLayout from "../../layout/DashboardLayout"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save, RefreshCcw, CheckCircle, Upload } from "lucide-react"

export default function TaoTaiKhoan() {

    const navigate = useNavigate()
    const [showToast, setShowToast] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "", // ✅ thêm username
        password: "",
        role: "sinhvien",
        avatar: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setFormData({ ...formData, avatar: imageUrl })
        }
    }

    const roles = [
        { label: "Admin", value: "admin" },
        { label: "Giáo viên", value: "giangvien" },
        { label: "Sinh viên", value: "sinhvien" }
    ]

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let pass = ""
        for (let i = 0; i < 8; i++) {
            pass += chars[Math.floor(Math.random() * chars.length)]
        }
        setFormData({ ...formData, password: pass })
    }

    const getPasswordStrength = () => {
        const len = formData.password.length
        if (len === 0) return ""
        if (len < 6) return "Yếu"
        if (len < 10) return "Trung bình"
        return "Mạnh"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password.length < 6) {
            alert("Mật khẩu phải ít nhất 6 ký tự")
            return
        }

        if (formData.username.length < 4) {
            alert("Username ít nhất 4 ký tự")
            return
        }

        try {
            await fetch("http://localhost:5000/api/admin/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ho_ten: formData.name,
                    email: formData.email,
                    username: formData.username, // ✅ fix đúng
                    password: formData.password,
                    role: formData.role,
                    trang_thai: true
                }),
            })

            setShowToast(true)

            setTimeout(() => {
                navigate("/admin/accounts")
            }, 1200)

        } catch {
            alert("Tạo tài khoản thất bại")
        }
    }

    return (
        <DashboardLayout role="ADMIN">

            <div className="mb-10">
                <button
                    onClick={() => navigate("/admin/accounts")}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4"
                >
                    <ArrowLeft size={18} /> Quay lại
                </button>

                <h1 className="text-4xl font-bold text-indigo-600">
                    Tạo tài khoản
                </h1>

                <p className="text-slate-500 mt-2">
                    Thêm người dùng mới vào hệ thống
                </p>
            </div>

            <div className="flex justify-center">
                <div className="w-full max-w-5xl">

                    <div className="bg-white p-10 rounded-2xl shadow-md border border-slate-200">

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                            {/* Avatar */}
                            <div className="col-span-2 flex items-center gap-6 mb-4">
                                <img
                                    src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                    className="w-20 h-20 rounded-full border"
                                />

                                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg flex gap-2 text-sm">
                                    <Upload size={16} /> Tải ảnh
                                    <input hidden type="file" onChange={handleAvatarChange} />
                                </label>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-sm font-semibold mb-1 block">Họ và tên</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-semibold mb-1 block">Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Username */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-1 block">Username</label>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-1 block">Mật khẩu</label>

                                <div className="flex gap-2">
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="flex-1 border px-4 py-3 rounded-xl"
                                    />

                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-4 bg-slate-200 rounded-lg"
                                    >
                                        <RefreshCcw size={16} />
                                    </button>
                                </div>

                                {formData.password && (
                                    <p className="text-sm mt-2 text-slate-500">
                                        Độ mạnh: <b>{getPasswordStrength()}</b>
                                    </p>
                                )}
                            </div>

                            {/* ROLE */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-2 block">Vai trò</label>

                                <div className="grid grid-cols-3 gap-4">
                                    {roles.map(r => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r.value })}
                                            className={`p-4 rounded-xl border text-sm font-semibold transition
                                                ${formData.role === r.value
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                                    : "hover:border-indigo-400"
                                                }
                                            `}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STATUS */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-2 block">Trạng thái</label>
                                <div className="px-4 py-3 rounded-xl bg-green-100 text-green-700 border border-green-200 font-semibold">
                                    Hoạt động
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <div className="col-span-2 pt-4">
                                <button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90">
                                    <Save size={18} />
                                    Tạo tài khoản
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
            </div>

            {showToast && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow flex gap-2">
                    <CheckCircle size={20} />
                    Tạo thành công
                </div>
            )}

        </DashboardLayout>
    )
}