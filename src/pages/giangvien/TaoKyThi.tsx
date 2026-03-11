import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from "../../hooks/useAuth"

export default function TaoKyThi() {
  const { user } = useAuth()
  const [examName, setExamName] = useState('')
  const [duration, setDuration] = useState(60)
  const [totalQuestions, setTotalQuestions] = useState(50)
  const [passScore, setPassScore] = useState(5)

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Tạo kỳ thi: ' + examName)
  }

  const recentExams = [
    { id: 1, name: 'Toán cao cấp 1', questions: 50, duration: 90, created: '15/03/2026' },
    { id: 2, name: 'Vật lý đại cương', questions: 40, duration: 60, created: '12/03/2026' },
    { id: 3, name: 'Hóa học', questions: 45, duration: 75, created: '10/03/2026' },
  ]

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
          Tạo kỳ thi mới
        </h1>
        <p className="text-slate-600">Thiết lập đề thi mới cho lớp học của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleCreateExam} className="space-y-6">
            {/* Exam Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tên kỳ thi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="VD: Toán cao cấp 1 - Giữa kỳ"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Exam Settings Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Thời gian thi (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  min="15"
                  max="300"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Total Questions */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Số câu hỏi <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
                  min="1"
                  max="500"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Pass Score */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Điểm đạt chuẩn <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={passScore}
                onChange={(e) => setPassScore(parseInt(e.target.value))}
                min="0"
                max="10"
                step="0.5"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Question Bank Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Chọn câu hỏi từ ngân hàng
              </label>
              <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                <p className="text-sm text-slate-600 mb-3">Câu hỏi sẽ được chọn ngẫu nhiên từ các danh mục:</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked />
                    <span className="ml-3 text-sm text-slate-700">Chương 1: Đạo hàm (15 câu)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked />
                    <span className="ml-3 text-sm text-slate-700">Chương 2: Tích phân (20 câu)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" defaultChecked />
                    <span className="ml-3 text-sm text-slate-700">Chương 3: Phương trình vi phân (15 câu)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Tạo kỳ thi
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar - Recent Exams */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800">Kỳ thi gần đây</h3>
          </div>
          <div className="space-y-3">
            {recentExams.map((exam) => (
              <div key={exam.id} className="border border-slate-200 rounded-lg p-3 hover:bg-slate-50 transition cursor-pointer">
                <p className="font-medium text-sm text-slate-800 mb-1">{exam.name}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Câu hỏi: {exam.questions}</p>
                  <p>Thời gian: {exam.duration} phút</p>
                  <p className="text-slate-400 pt-1">{exam.created}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium text-sm">
            Xem tất cả →
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
