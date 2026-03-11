import { LogOut, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200 px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">SQ</span>
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            SmartQuiz
          </h1>
          <p className="text-xs text-slate-500">Hệ Thống Thi Trí Tuệ</p>
        </div>
      </div>

      <div className="flex gap-6 items-center">
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">User</p>
            <p className="text-xs text-slate-500">Sinh viên</p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Đăng xuất">
            <LogOut size={18} className="text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
