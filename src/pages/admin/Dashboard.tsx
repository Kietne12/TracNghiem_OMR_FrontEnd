import DashboardLayout from "../../layout/DashboardLayout"
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  AlertCircle
} from "lucide-react"

export default function AdminDashboard() {

  const stats = {
    totalUsers: 350,
    teachers: 25,
    students: 325,
    exams: 48,
    avgScore: 7.2,
    systemHealth: 98
  }

  const recentActivities = [
    { id: 1, action: "Giáo viên mới", user: "Trần Văn X", time: "2 giờ trước" },
    { id: 2, action: "Kỳ thi tạo", user: "Lê Thị Y", time: "4 giờ trước" },
    { id: 3, action: "Tài khoản khóa", user: "Nguyễn Z", time: "1 ngày trước" },
    { id: 4, action: "Lớp mới tạo", user: "Phạm A", time: "2 ngày trước" },
  ]

  return (

    <DashboardLayout role="ADMIN">

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">

        <div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Bảng điều khiển Admin
          </h1>

          <p className="text-slate-600">
            Tổng quan hệ thống thi trắc nghiệm OMR
          </p>

        </div>

      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

        <StatCard
          icon={<Users size={20} />}
          label="Tổng người dùng"
          value={stats.totalUsers}
          color="indigo"
        />

        <StatCard
          icon={<FileText size={20} />}
          label="Giáo viên"
          value={stats.teachers}
          color="cyan"
        />

        <StatCard
          icon={<Users size={20} />}
          label="Sinh viên"
          value={stats.students}
          color="green"
        />

        <StatCard
          icon={<BarChart3 size={20} />}
          label="Kỳ thi"
          value={stats.exams}
          color="orange"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Điểm TB"
          value={stats.avgScore}
          color="emerald"
        />

        <StatCard
          icon={<Settings size={20} />}
          label="System Health"
          value={`${stats.systemHealth}%`}
          color="purple"
        />

      </div>


      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


        {/* System Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-bold text-slate-800 mb-6">
            Trạng thái hệ thống
          </h2>

          <div className="space-y-5">

            <StatusRow name="Database" status="ok" />
            <StatusRow name="API Server" status="ok" />
            <StatusRow name="Email Service" status="warning" />
            <StatusRow name="Storage" status="ok" />

          </div>


          {/* Health Bar */}
          <div className="mt-6">

            <p className="text-sm text-slate-600 mb-2">
              System Health
            </p>

            <div className="w-full bg-slate-200 rounded-full h-3">

              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${stats.systemHealth}%` }}
              />

            </div>

          </div>

        </div>


        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Hoạt động gần đây
          </h2>

          <div className="space-y-4">

            {recentActivities.map((activity) => (

              <div
                key={activity.id}
                className="flex items-center gap-3"
              >

                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                  {activity.user.charAt(0)}
                </div>

                <div className="flex-1">

                  <p className="text-sm font-medium text-slate-800">
                    {activity.action}
                  </p>

                  <p className="text-xs text-slate-500">
                    {activity.user}
                  </p>

                </div>

                <span className="text-xs text-slate-400">
                  {activity.time}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* Alert */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex gap-4">

        <AlertCircle size={24} className="text-yellow-600 flex-shrink-0 mt-1" />

        <div>

          <h3 className="font-semibold text-yellow-900 mb-1">
            Cảnh báo hệ thống
          </h3>

          <p className="text-sm text-yellow-800">
            Dịch vụ Email có độ trễ cao. Vui lòng kiểm tra cấu hình mail server trong 24 giờ tới.
          </p>

        </div>

      </div>

    </DashboardLayout>

  )
}


/* Stat Card */

function StatCard({ icon, label, value, color }: any) {

  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-100",
    cyan: "text-cyan-600 bg-cyan-100",
    green: "text-green-600 bg-green-100",
    orange: "text-orange-600 bg-orange-100",
    emerald: "text-emerald-600 bg-emerald-100",
    purple: "text-purple-600 bg-purple-100"
  }

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition">

      <div className="flex items-center justify-between mb-3">

        <p className="text-sm text-slate-600">
          {label}
        </p>

        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>

      </div>

      <p className="text-2xl font-bold text-slate-800">
        {value}
      </p>

    </div>

  )
}


/* Status Row */

function StatusRow({ name, status }: any) {

  const map: any = {
    ok: {
      dot: "bg-green-500",
      text: "Hoạt động",
      color: "text-green-600"
    },
    warning: {
      dot: "bg-yellow-500",
      text: "Cảnh báo",
      color: "text-yellow-600"
    }
  }

  return (

    <div className="flex items-center justify-between">

      <span className="text-slate-700 font-medium">
        {name}
      </span>

      <div className="flex items-center gap-2">

        <div className={`w-3 h-3 rounded-full ${map[status].dot}`} />

        <span className={`text-sm ${map[status].color}`}>
          {map[status].text}
        </span>

      </div>

    </div>

  )
}