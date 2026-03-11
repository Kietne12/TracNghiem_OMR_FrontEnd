import { LayoutDashboard, BookOpen, FileText, ClipboardList, Users, Settings } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface NavItem {
  icon: React.ComponentType<any>
  label: string
  href: string
}

// Menu items cho mỗi role - có thể lấy từ context/state
const menuByRole = {
  'SINH VIÊN': [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/sinhvien/dashboard' },
    { icon: FileText, label: 'Làm bài thi', href: '/sinhvien/lam-bai' },
    { icon: ClipboardList, label: 'Kết quả thi', href: '/sinhvien/ketqua' },
  ],
  'GIẢNG VIÊN': [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/giangvien/dashboard' },
    { icon: BookOpen, label: 'Ngân hàng câu hỏi', href: '/giangvien/ngan-hang-cau-hoi' },
    { icon: FileText, label: 'Tạo kỳ thi', href: '/giangvien/tao-ky-thi' },
    { icon: ClipboardList, label: 'Chấm bài', href: '/giangvien/cham-bai' },
  ],
  'ADMIN': [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Quản lý tài khoản', href: '/admin/tai-khoan' },
    { icon: BookOpen, label: 'Quản lý môn học', href: '/admin/mon-hoc' },
    { icon: Settings, label: 'Quản lý hệ thống', href: '/admin/he-thong' },
  ],
}

interface SidebarProps {
  role?: string
}

export default function Sidebar({ role = 'SINH VIÊN' }: SidebarProps) {
  const location = useLocation()

  // User info - có thể lấy từ context/state
  const userInfo = {
    name: 'Nguyễn Văn A',
    role: role,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
  }

  const navItems: NavItem[] = menuByRole[role as keyof typeof menuByRole] || menuByRole['SINH VIÊN']

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900 text-white flex flex-col shadow-lg">
      {/* User Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={userInfo.avatar}
            alt={userInfo.name}
            className="w-12 h-12 rounded-full border-2 border-cyan-400 shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white truncate">{userInfo.name}</p>
            <p className="text-xs text-slate-400">{userInfo.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname.includes(item.href)
          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                  : 'hover:bg-slate-700/50 text-slate-300 group-hover:text-white'
              }`}
            >
              <Icon size={20} className={`transition ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
              }`} />
              <span className={`text-sm font-medium ${
                isActive ? 'text-white font-semibold' : 'group-hover:text-cyan-300'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </a>
          )
        })}
      </nav>

      {/* Footer - Minimal */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">© 2026 SmartQuiz</p>
      </div>
    </aside>
  )
}