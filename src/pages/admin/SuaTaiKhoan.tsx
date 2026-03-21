import DashboardLayout from "../../layout/DashboardLayout"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Save, RefreshCcw, CheckCircle, Upload } from "lucide-react"

export default function SuaTaiKhoan() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [showToast, setShowToast] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "Sinh viên",
        status: "Hoạt động",
        avatar: ""
    })

    // 🔥 LOAD DATA
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("http://localhost:5000/api/admin/accounts")
            const data = await res.json()

            const user = data.find((u: any) => u.id == id)

            if (user) {
                setFormData({
                    name: user.ho_ten,
                    email: user.email,
                    username: user.tai_khoan?.username || "",
                    password: "",
                    role:
                        user.tai_khoan.role === "admin"
                            ? "Admin"
                            : user.tai_khoan.role === "giangvien"
                                ? "Giáo viên"
                                : "Sinh viên",
                    status: user.trang_thai ? "Hoạt động" : "Khóa",
                    avatar: ""
                })
            }
        }

        fetchUser()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setFormData({ ...formData, avatar: url })
        }
    }

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

        try {
            await fetch(`http://localhost:5000/api/admin/accounts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ho_ten: formData.name,
                    email: formData.email,
                    username: formData.username,
                    role:
                        formData.role === "Admin"
                            ? "admin"
                            : formData.role === "Giáo viên"
                                ? "giangvien"
                                : "sinhvien",
                    password: formData.password,
                    trang_thai: formData.status === "Hoạt động"
                }),
            })

            setShowToast(true)

            setTimeout(() => {
                navigate("/admin/accounts")
            }, 1200)

        } catch {
            alert("Cập nhật thất bại")
        }
    }

    const roles = ["Admin", "Giáo viên", "Sinh viên"]
    const statuses = ["Hoạt động", "Khóa"]

    return (
        <DashboardLayout role="ADMIN">

            {/* Header */}
            <div className="mb-10">
                <button
                    onClick={() => navigate("/admin/accounts")}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4"
                >
                    <ArrowLeft size={18} /> Quay lại
                </button>

                <h1 className="text-4xl font-bold text-indigo-600">
                    Sửa tài khoản
                </h1>

                <p className="text-slate-500 mt-2">
                    Cập nhật thông tin người dùng
                </p>
            </div>

            {/* FORM */}
            <div className="flex justify-center">
                <div className="w-full max-w-5xl">

                    <div className="bg-white p-10 rounded-2xl shadow-md border border-slate-200">

                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">

                            {/* Avatar */}
                            <div className="col-span-2 flex items-center gap-6">
                                <img
                                    src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`}
                                    className="w-20 h-20 rounded-full border"
                                />

                                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg flex gap-2 text-sm">
                                    <Upload size={16} /> Thay ảnh
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
                                />
                            </div>

                            {/* Username */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-1 block">Username</label>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border px-4 py-3 rounded-xl"
                                />
                            </div>

                            {/* Password */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-1 block">Mật khẩu mới</label>

                                <div className="flex gap-2">
                                    <input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Để trống nếu không đổi"
                                        className="flex-1 border px-4 py-3 rounded-xl"
                                    />
                                    <button type="button" onClick={generatePassword} className="px-4 bg-slate-200 rounded-lg">
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
                                            key={r}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r })}
                                            className={`p-4 rounded-xl border text-sm font-semibold transition
                                                ${formData.role === r
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                                    : "hover:border-indigo-400"
                                                }
                                            `}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* STATUS */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold mb-2 block">Trạng thái</label>

                                <div className="grid grid-cols-2 gap-4">
                                    {statuses.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status: s })}
                                            className={`p-4 rounded-xl border text-sm font-semibold transition
                                                ${formData.status === s
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                                                    : "hover:border-indigo-400"
                                                }
                                            `}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <div className="col-span-2 pt-4">
                                <button className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90">
                                    <Save size={18} />
                                    Lưu thay đổi
                                </button>
                            </div>

                        </form>

                    </div>

                </div>
            </div>

            {/* Toast */}
            {showToast && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow flex gap-2">
                    <CheckCircle size={20} />
                    Cập nhật thành công
                </div>
            )}

        </DashboardLayout>
    )
}