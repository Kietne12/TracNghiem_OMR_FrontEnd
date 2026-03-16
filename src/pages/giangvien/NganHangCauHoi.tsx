import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Search, Trash2, Edit2, Download, Upload, Filter } from 'lucide-react'
import { useState } from 'react'
import AddQuestionModal from "../../components/AddQuestionModal"
import EditQuestionModal from "../../components/EditQuestionModal"

interface Question {
  id: number
  text: string
  chapter: string
  difficulty: 'Dễ' | 'Bình thường' | 'Khó'
  answers: string[]
  correctAnswer: number
  uses: number
  createdAt: string
}

interface Chapter {
  id: string
  name: string
  questionCount: number
}

export default function NganHangCauHoi() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [activeTab, setActiveTab] = useState<'question-bank' | 'import-excel'>('question-bank')

  // Mock data
  const chapters: Chapter[] = [
    { id: 'all', name: 'Tất cả', questionCount: 120 },
    { id: 'ch1', name: 'Chương 1: Hàm số và giới hạn', questionCount: 35 },
    { id: 'ch2', name: 'Chương 2: Đạo hàm', questionCount: 28 },
    { id: 'ch3', name: 'Chương 3: Tích phân', questionCount: 32 },
    { id: 'ch4', name: 'Chương 4: Phương trình vi phân', questionCount: 25 },
  ]

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: 'Đạo hàm của hàm số y = x² + 2x là?',
      chapter: 'ch2',
      difficulty: 'Dễ',
      answers: ['2x + 2', '2x', 'x + 2', '2'],
      correctAnswer: 0,
      uses: 5,
      createdAt: '15/03/2026',
    },
    {
      id: 2,
      text: 'Tích phân của hàm số f(x) = 2x là?',
      chapter: 'ch3',
      difficulty: 'Dễ',
      answers: ['x² + C', '2x² + C', 'x² + 2x + C', '2 + C'],
      correctAnswer: 0,
      uses: 3,
      createdAt: '14/03/2026',
    },
    {
      id: 3,
      text: 'Giới hạn của hàm số f(x) = (x² - 1)/(x - 1) khi x → 1 là?',
      chapter: 'ch1',
      difficulty: 'Bình thường',
      answers: ['0', '1', '2', 'Không tồn tại'],
      correctAnswer: 2,
      uses: 8,
      createdAt: '13/03/2026',
    },
    {
      id: 4,
      text: 'Tính tích phân xác định: ∫₀¹ x² dx = ?',
      chapter: 'ch3',
      difficulty: 'Khó',
      answers: ['1/3', '1/2', '2/3', '1'],
      correctAnswer: 0,
      uses: 2,
      createdAt: '12/03/2026',
    },
  ])

  const difficultyLevels = [
    { id: 'all', label: 'Tất cả độ khó' },
    { id: 'Dễ', label: 'Dễ' },
    { id: 'Bình thường', label: 'Bình thường' },
    { id: 'Khó', label: 'Khó' },
  ]

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesChapter = selectedChapter === 'all' || q.chapter === selectedChapter
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty
    return matchesSearch && matchesChapter && matchesDifficulty
  })

  const handleDeleteQuestion = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      setQuestions(questions.filter(q => q.id !== id))
    }
  }

  const handleDownloadTemplate = () => {
    const template = `Chương,Câu hỏi,Đáp án A,Đáp án B,Đáp án C,Đáp án D,Đáp án đúng,Độ khó
Chương 1: Hàm số và giới hạn,Ví dụ câu hỏi 1,ĐA A,ĐA B,ĐA C,ĐA D,1,Dễ
Chương 1: Hàm số và giới hạn,Ví dụ câu hỏi 2,ĐA A,ĐA B,ĐA C,ĐA D,2,Bình thường
Chương 2: Đạo hàm,Ví dụ câu hỏi 3,ĐA A,ĐA B,ĐA C,ĐA D,3,Khó`

    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template))
    element.setAttribute('download', 'mau_nhap_cau_hoi.csv')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      // Parse CSV and add questions
      alert('Tải lên file thành công! Hệ thống sẽ xử lý và thêm vào ngân hàng câu hỏi.')
    }
    reader.readAsText(file)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ':
        return 'bg-green-100 text-green-800'
      case 'Bình thường':
        return 'bg-yellow-100 text-yellow-800'
      case 'Khó':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getChapterName = (chapterId: string) => {
    return chapters.find(c => c.id === chapterId)?.name || 'N/A'
  }

  return (
    <DashboardLayout role="GIẢNG VIÊN">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Ngân hàng câu hỏi
          </h1>
          <p className="text-slate-600">Quản lý và tổ chức câu hỏi cho các kỳ thi</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Download size={20} />
            Tải mẫu Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Thêm câu hỏi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('question-bank')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'question-bank'
              ? 'border-b-3 border-indigo-600 text-indigo-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Ngân hàng câu hỏi ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('import-excel')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'import-excel'
              ? 'border-b-3 border-indigo-600 text-indigo-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Nhập từ Excel
        </button>
      </div>

      {activeTab === 'question-bank' ? (
        <>
          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Chương
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {chapters.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-2" />
                  Độ khó
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.id} value={level.id}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
                <p className="text-slate-600 mb-4">Không tìm thấy câu hỏi phù hợp</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Thêm câu hỏi đầu tiên
                </button>
              </div>
            ) : (
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                    <div className="lg:col-span-2">
                      <p className="font-semibold text-slate-800 mb-2">{question.text}</p>
                      <p className="text-sm text-slate-600">{getChapterName(question.chapter)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-slate-600">
                        Dùng: {question.uses}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingQuestion(question)
                            setShowEditModal(true)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Answers Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {question.answers.map((answer, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-sm ${
                          idx === question.correctAnswer
                            ? 'bg-green-100 text-green-800 border-2 border-green-300 font-semibold'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="font-semibold">{'ABCD'[idx]}.</span> {answer}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        // Import Excel Tab
        <div className="bg-white rounded-lg border border-slate-200 p-8">
          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-500 transition">
              <Upload size={48} className="mx-auto text-slate-400 mb-4" />
              <p className="font-semibold text-slate-800 mb-2">Tải lên file Excel</p>
              <p className="text-sm text-slate-600 mb-4">
                Hỗ trợ file CSV hoặc Excel (.xlsx)
              </p>

              <label className="inline-block">
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleUploadFile}
                  className="hidden"
                />
                <span className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer transition inline-block">
                  Chọn file
                </span>
              </label>

              <p className="text-xs text-slate-500 mt-4">
                Còn chưa có mẫu? <button onClick={handleDownloadTemplate} className="text-indigo-600 hover:underline">Tải mẫu ngay</button>
              </p>
            </div>

            <div className="mt-8">
              <p className="font-semibold text-slate-800 mb-4">Yêu cầu định dạng file:</p>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>✓ Cột 1: Chương (tên chương)</li>
                <li>✓ Cột 2: Câu hỏi (nội dung)</li>
                <li>✓ Cột 3-6: Đáp án A, B, C, D</li>
                <li>✓ Cột 7: Đáp án đúng (1, 2, 3, 4)</li>
                <li>✓ Cột 8: Độ khó (Dễ, Bình thường, Khó)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <AddQuestionModal
          chapters={chapters}
          onAdd={(question) => {
            const newQuestion: Question = {
              ...question,
              id: Math.max(...questions.map((q) => q.id), 0) + 1,
              uses: 0,
              createdAt: new Date().toLocaleDateString('vi-VN'),
            }
            setQuestions([...questions, newQuestion])
            setShowAddModal(false)
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Question Modal */}
      {showEditModal && editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          chapters={chapters}
          onEdit={(updatedQuestion) => {
            setQuestions(questions.map((q) => (q.id === editingQuestion.id ? {...editingQuestion, ...updatedQuestion} : q)))
            setShowEditModal(false)
            setEditingQuestion(null)
          }}
          onClose={() => {
            setShowEditModal(false)
            setEditingQuestion(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
