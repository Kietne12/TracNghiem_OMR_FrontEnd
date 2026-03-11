import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Search, Trash2, Edit2 } from 'lucide-react'
import { useState } from 'react'

export default function NganHangCauHoi() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Tất cả', count: 120 },
    { id: 'dao-ham', name: 'Đạo hàm', count: 35 },
    { id: 'tich-phan', name: 'Tích phân', count: 28 },
    { id: 'phuong-trinh', name: 'Phương trình', count: 32 },
    { id: 'he-phuong-trinh', name: 'Hệ phương trình', count: 25 },
  ]

  const questions = [
    { id: 1, text: 'Đạo hàm của hàm số y = x² + 2x là?', category: 'dao-ham', difficulty: 'Dễ', uses: 5 },
    { id: 2, text: 'Tích phân của hàm số f(x) = 2x là?', category: 'tich-phan', difficulty: 'Dễ', uses: 3 },
    { id: 3, text: 'Giải phương trình 2x + 5 = 15', category: 'phuong-trinh', difficulty: 'Dễ', uses: 8 },
    { id: 4, text: 'Tính giới hạn của hàm số khi x tiến đến vô cùng', category: 'dao-ham', difficulty: 'Khó', uses: 2 },
  ]

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Ngân hàng câu hỏi
          </h1>
          <p className="text-slate-600">Quản lý và tổ chức câu hỏi cho các kỳ thi</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
          <Plus size={20} />
          Thêm câu hỏi
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}
            >
              {cat.name} <span className="ml-1 opacity-75">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions Grid */}
      <div className="space-y-3">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-slate-800 font-medium mb-3">{question.text}</p>
                  <div className="flex gap-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {categories.find(c => c.id === question.category)?.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      question.difficulty === 'Dễ'
                        ? 'bg-green-100 text-green-700'
                        : question.difficulty === 'Trung bình'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      Sử dụng: {question.uses}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-indigo-600">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-500">Không tìm thấy câu hỏi nào</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
