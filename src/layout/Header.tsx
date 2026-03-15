import { LogOut, Bell } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { memo, useState } from "react"

const roleName: Record<string, string> = {
  admin: "Quản trị viên",
  giangvien: "Giảng viên",
  sinhvien: "Sinh viên",
}

const Header = memo(function Header() {

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  // Demo notifications (sau này có thể lấy từ API)
  const notifications = [
    {
      id: 1,
      text: "Kỳ thi Cấu trúc dữ liệu bắt đầu lúc 08:00",
      time: "5 phút trước",
    },
    {
      id: 2,
      text: "Bạn đã đạt 8.5 điểm môn C++",
      time: "1 giờ trước",
    },
    {
      id: 3,
      text: "Có 2 kỳ thi sắp diễn ra trong tuần",
      time: "Hôm nay",
    },
  ]

  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <div className="flex items-center gap-3">

        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">SQ</span>
        </div>

        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            SmartQuiz
          </h1>
          <p className="text-xs text-slate-500">
            Hệ Thống Thi Trí Tuệ
          </p>
        </div>

      </div>


      <div className="flex gap-6 items-center">

        {/* Notification */}
        <div className="relative">

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Bell size={20} className="text-slate-600" />

            {/* Badge */}
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>


          {/* Dropdown */}
          {showNotifications && (

            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50">

              <div className="p-3 font-semibold border-b">
                Thông báo
              </div>

              {notifications.length === 0 ? (

                <div className="p-4 text-sm text-slate-500 text-center">
                  Không có thông báo
                </div>

              ) : (

                notifications.map((n) => (

                  <div
                    key={n.id}
                    className="p-3 border-b last:border-none hover:bg-slate-50 cursor-pointer"
                  >
                    <p className="text-sm text-slate-700">
                      {n.text}
                    </p>

                    <span className="text-xs text-slate-500">
                      {n.time}
                    </span>
                  </div>

                ))

              )}

            </div>

          )}

        </div>


        {/* User info */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">

          <div className="text-right">

            <p className="text-sm font-medium text-slate-700">
              {user?.ho_ten || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {roleName[user?.role ?? ""] ?? user?.role}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            title="Đăng xuất"
          >
            <LogOut size={18} className="text-slate-600" />
          </button>

        </div>

      </div>

    </header>
  )
})

export default Header