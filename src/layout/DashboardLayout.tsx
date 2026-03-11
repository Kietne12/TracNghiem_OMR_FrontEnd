import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"

interface DashboardLayoutProps {
  children: React.ReactNode
  role?: string
}

export default function DashboardLayout({ children, role = 'SINH VIÊN' }: DashboardLayoutProps) {

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Content */}
      <div className="flex flex-col flex-1">
        <Header />

        <main className="flex-1 p-8 pt-16 overflow-auto scroll-smooth" style={{ scrollPaddingTop: '120px' }}>
          <div className="max-w-7xl">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}