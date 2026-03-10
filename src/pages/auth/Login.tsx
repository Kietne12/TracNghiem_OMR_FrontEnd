import { useState } from "react"
import { User, Lock, Eye, EyeOff } from "lucide-react"

export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log({
      email,
      password
    })
  }

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('./public/background.png')" }}
    >

      {/* overlay tối nhẹ */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* LOGIN BOX */}
      <div
        className="
        relative
        w-full
        max-w-md
        p-10
        rounded-2xl
        border border-white/20
        bg-white/10
        backdrop-blur-xl
        shadow-2xl
        text-white
      "
      >

        {/* Title */}
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold">
            OMR Exam System
          </h1>

          <p className="text-gray-200 text-sm mt-1">
            Hệ thống thi trắc nghiệm
          </p>

        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>

            <label className="text-sm text-gray-200">
              Email / MSSV
            </label>

            <div className="relative mt-2">

              <User
                size={18}
                className="absolute left-3 top-3 text-gray-300"
              />

              <input
                type="text"
                placeholder="Nhập email hoặc MSSV"
                className="
                w-full
                pl-10
                pr-4
                py-2
                rounded-md
                bg-white/20
                border border-white/30
                placeholder-gray-300
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

          </div>

          {/* Password */}
          <div>

            <label className="text-sm text-gray-200">
              Mật khẩu
            </label>

            <div className="relative mt-2">

              <Lock
                size={18}
                className="absolute left-3 top-3 text-gray-300"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="
                w-full
                pl-10
                pr-10
                py-2
                rounded-md
                bg-white/20
                border border-white/30
                placeholder-gray-300
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* ICON CON MẮT */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-300 hover:text-white hover:scale-110 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          {/* Remember */}
          <div className="flex justify-between text-sm text-gray-200">

            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>

            <a
              href="#"
              className="hover:underline"
            >
              Quên mật khẩu?
            </a>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="
            w-full
            py-2.5
            rounded-md
            font-semibold
            bg-pink-500
            hover:bg-pink-600
            transition
            shadow-lg
            "
          >
            Đăng nhập
          </button>

        </form>

      </div>

    </div>
  )
}