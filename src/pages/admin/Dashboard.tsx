import DashboardLayout from "../../layout/DashboardLayout"
import {
  Users,
  FileText
} from "lucide-react"

export default function AdminDashboard() {
  const stats = {
    totalUsers: 350,
    teachers: 25,
    students: 325
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

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
            <StatusRow name="Storage" status="ok" />

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

    </DashboardLayout>

  )
}


/* Stat Card */

function StatCard({ icon, label, value, color }: any) {

  const colorMap: any = {
    indigo: "text-indigo-600 bg-indigo-100",
    cyan: "text-cyan-600 bg-cyan-100",
    green: "text-green-600 bg-green-100",
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