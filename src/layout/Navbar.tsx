import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Navbar() {
  const { account, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">

      <h1 className="font-semibold text-gray-700">
        SmartQuiz Dashboard
      </h1>

      <div className="flex items-center gap-3">

        <span className="text-sm text-gray-600">
          {account?.ho_ten ?? "User"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>

    </div>
  )
}