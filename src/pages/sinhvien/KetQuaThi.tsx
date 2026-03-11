import DashboardLayout from "../../layout/DashboardLayout"
import { BarChart3, Award, TrendingUp, Calendar } from 'lucide-react'

export default function KetQuaThi() {
  const results = [
    { id: 1, subject: 'Toán cao cấp 1', score: 8.5, maxScore: 10, date: '01/03/2026', status: 'Đạt' },
    { id: 2, subject: 'Vật lý đại cương', score: 7.2, maxScore: 10, date: '28/02/2026', status: 'Đạt' },
    { id: 3, subject: 'Hóa học đại cương', score: 8.1, maxScore: 10, date: '25/02/2026', status: 'Đạt' },
    { id: 4, subject: 'Tiếng Anh cơ bản', score: 9.0, maxScore: 10, date: '20/02/2026', status: 'Giỏi' },
    { id: 5, subject: 'Lập trình C++', score: 6.8, maxScore: 10, date: '15/02/2026', status: 'Đạt' },
  ]

  const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
          Kết quả thi
        </h1>
        <p className="text-slate-600">Xem chi tiết kết quả thi của bạn</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Điểm trung bình</p>
              <p className="text-3xl font-bold text-indigo-600">{avgScore}</p>
            </div>
            <TrendingUp size={32} className="text-indigo-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Số bài thi</p>
              <p className="text-3xl font-bold text-cyan-600">{results.length}</p>
            </div>
            <BarChart3 size={32} className="text-cyan-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Bài đạt</p>
              <p className="text-3xl font-bold text-green-600">{results.filter(r => r.score >= 5).length}</p>
            </div>
            <Award size={32} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm mb-1">Tỉ lệ đạt</p>
              <p className="text-3xl font-bold text-emerald-600">
                {((results.filter(r => r.score >= 5).length / results.length) * 100).toFixed(0)}%
              </p>
            </div>
            <Calendar size={32} className="text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Chi tiết kết quả</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Môn thi</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Ngày thi</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Điểm</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Xếp loại</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-800 font-medium">{result.subject}</td>
                  <td className="py-3 px-4 text-slate-600">{result.date}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-lg text-indigo-600">
                      {result.score}/{result.maxScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {result.score >= 8.5 && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Giỏi</span>
                    )}
                    {result.score >= 7 && result.score < 8.5 && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Khá</span>
                    )}
                    {result.score >= 5 && result.score < 7 && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">Trung bình</span>
                    )}
                    {result.score < 5 && (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Chưa đạt</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
