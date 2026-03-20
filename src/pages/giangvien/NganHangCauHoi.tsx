import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Search, Trash2, Edit2, Download, Upload, Filter } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import AddQuestionModal from "../../components/AddQuestionModal"
import EditQuestionModal from "../../components/EditQuestionModal"
import api from "../../services/api"


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

interface QuestionApi {
  id: number
  mon_hoc_id: number
  noi_dung: string
  dap_an_a: string
  dap_an_b: string
  dap_an_c: string
  dap_an_d: string
  dap_an_dung: 'A' | 'B' | 'C' | 'D'
  do_kho: number
  chuong: number
  nguoi_tao_id: number
  createdAt: string
  updatedAt: string
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

  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true)
  const [apiError, setApiError] = useState("")

  const loadQuestions = async () => {
    setIsLoadingQuestions(true)
    try {
      const res = await api.get<{ questions: QuestionApi[] }>("/api/question-bank")
      const raw = res.data.questions || []
      setQuestions(
        raw.map((q) => ({
          id: q.id,
          text: q.noi_dung,
          chapter: `ch${q.chuong}`,
          difficulty: q.do_kho === 1 ? "Dễ" : q.do_kho === 2 ? "Bình thường" : "Khó",
          answers: [q.dap_an_a, q.dap_an_b, q.dap_an_c, q.dap_an_d],
          correctAnswer: ["A", "B", "C", "D"].indexOf(q.dap_an_dung),
          uses: 0,
          createdAt: q.createdAt ? new Date(q.createdAt).toLocaleDateString("vi-VN") : "",
        }))
      )
      setApiError("")
    } catch (error: any) {
      console.error("Lỗi khi tải câu hỏi:", error)
      setApiError(error?.response?.data?.message || "Không tải được danh sách câu hỏi")
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [])


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

  if (isLoadingQuestions) {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="text-center py-20">Đang tải ngân hàng câu hỏi...</div>
      </DashboardLayout>
    )
  }

  if (apiError) {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="text-center py-20 text-red-600">{apiError}</div>
      </DashboardLayout>
    )
  }

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return
    try {
      await api.delete(`/api/question-bank/${id}`)
      await loadQuestions()
    } catch (err: any) {
      console.error('Xóa câu hỏi lỗi:', err)
      alert(err?.response?.data?.message || 'Xóa câu hỏi thất bại')
    }
  }

  const uiToApi = (question: Omit<Question, 'id' | 'uses' | 'createdAt'>) => ({
    mon_hoc_id: Number(question.chapter.replace('ch', '')),
    noi_dung: question.text,
    dap_an_a: question.answers[0],
    dap_an_b: question.answers[1],
    dap_an_c: question.answers[2],
    dap_an_d: question.answers[3],
    dap_an_dung: ['A', 'B', 'C', 'D'][question.correctAnswer] as 'A' | 'B' | 'C' | 'D',
    do_kho: question.difficulty === 'Dễ' ? 1 : question.difficulty === 'Bình thường' ? 2 : 3,
    chuong: Number(question.chapter.replace('ch', '')),
  })

  const handleAddQuestion = async (question: Omit<Question, 'id' | 'uses' | 'createdAt'>) => {
    try {
      const body = uiToApi(question)
      await api.post('/api/question-bank', body)
      await loadQuestions()
      setShowAddModal(false)
    } catch (err: any) {
      console.error('Thêm câu hỏi lỗi:', err)
      alert(err?.response?.data?.message || 'Thêm câu hỏi thất bại')
    }
  }

  const handleEditQuestion = async (updatedQuestion: Question) => {
    if (!editingQuestion) return

    try {
      const body = uiToApi(updatedQuestion)
      await api.put(`/api/question-bank/${editingQuestion.id}`, body)
      await loadQuestions()
      setShowEditModal(false)
      setEditingQuestion(null)
    } catch (err: any) {
      console.error('Cập nhật câu hỏi lỗi:', err)
      alert(err?.response?.data?.message || 'Cập nhật câu hỏi thất bại')
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

    const processRows = async (rows: string[][]) => {
      if (rows.length <= 1) {
        alert('File không có dữ liệu hợp lệ.')
        return
      }

      const normalizeKey = (value: string) => {
        const normalized = value
          .toString()
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/đ/g, 'd')
          .replace(/\s+/g, ' ')
          .replace(/[^a-z0-9 ]/g, '')
        return normalized
      }

      const canonicalMap: Record<string, string> = {
        'chuong': 'chuong',
        'chuong so': 'chuong',
        'chương': 'chuong',
        'chương so': 'chuong',
        'chapter': 'chuong',
        'cau hoi': 'cau hoi',
        'cauhoi': 'cau hoi',
        'câu hoi': 'cau hoi',
        'câu hỏi': 'cau hoi',
        'dap an a': 'dap an a',
        'dapan a': 'dap an a',
        'dap an b': 'dap an b',
        'dap an c': 'dap an c',
        'dap an d': 'dap an d',
        'dap an dung': 'dap an dung',
        'dapan dung': 'dap an dung',
        'do kho': 'do kho',
        'dokho': 'do kho',
        'do khoi': 'do kho',
      }

      const header = rows[0].map((h) => canonicalMap[normalizeKey(h.toString())] || normalizeKey(h.toString()))

      const required = ['chuong', 'cau hoi', 'dap an a', 'dap an b', 'dap an c', 'dap an d', 'dap an dung', 'do kho']
      const missingHeaders = required.filter((col) => !header.includes(col))
      if (missingHeaders.length > 0) {
        alert(`Định dạng file không đúng. Thiếu cột: ${missingHeaders.join(', ')}`)
        return
      }

      const getValue = (row: any[], key: string) => {
        const idx = header.indexOf(key)
        return idx >= 0 ? (row[idx] || '').toString().trim() : ''
      }

      const questionsToUpload = rows.slice(1).map((row, idx) => {
        const chapterText = getValue(row, 'chuong')
        const match = chapterText.match(/\d+/)
        const chapterNumber = match ? Number(match[0]) : 1

        const difficultyText = getValue(row, 'do kho').toLowerCase()
        const difficulty = difficultyText.includes('de')
          ? 1
          : difficultyText.includes('kho')
          ? 3
          : 2

        const correctAnswerRaw = getValue(row, 'dap an dung').toLowerCase()
        const mappedCorrect = ['1', 'a'].includes(correctAnswerRaw)
          ? 'A'
          : ['2', 'b'].includes(correctAnswerRaw)
          ? 'B'
          : ['3', 'c'].includes(correctAnswerRaw)
          ? 'C'
          : ['4', 'd'].includes(correctAnswerRaw)
          ? 'D'
          : ''

        return {
          rowIndex: idx + 2,
          data: {
            mon_hoc_id: 1, // map sang môn học mặc định đã seed (Cơ sở dữ liệu)
            noi_dung: getValue(row, 'cau hoi'),
            dap_an_a: getValue(row, 'dap an a'),
            dap_an_b: getValue(row, 'dap an b'),
            dap_an_c: getValue(row, 'dap an c'),
            dap_an_d: getValue(row, 'dap an d'),
            dap_an_dung: mappedCorrect,
            do_kho: difficulty,
            chuong: chapterNumber,
          },
        }
      })

      let successCount = 0
      const failedRows: string[] = []

      for (const item of questionsToUpload) {
        const q = item.data
        if (!q.noi_dung || !q.dap_an_a || !q.dap_an_b || !q.dap_an_c || !q.dap_an_d || !q.dap_an_dung) {
          failedRows.push(`Dòng ${item.rowIndex}: thiếu dữ liệu (câu hỏi/đáp án/đáp án đúng).`)
          continue
        }

        try {
          await api.post('/api/question-bank', q)
          successCount += 1
        } catch (err: any) {
          const message = err?.response?.data?.message || err?.message || 'Lỗi không xác định'
          failedRows.push(`Dòng ${item.rowIndex}: ${message}`)
        }
      }

      await loadQuestions()

      let summary = `Đã nhập thành công ${successCount} câu hỏi.`
      if (failedRows.length > 0) {
        summary += `\nBỏ qua ${failedRows.length} dòng bị lỗi:\n${failedRows.join('\n')}`
      }
      alert(summary)
    }

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const data = new Uint8Array(reader.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
          await processRows(jsonRows as string[][])
        } catch (err: any) {
          console.error('Lỗi đọc file xlsx:', err)
          alert('Không đọc được file .xlsx. Vui lòng kiểm tra lại.')
        } finally {
          event.target.value = ''
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      const reader = new FileReader()
      reader.onload = async () => {
        const content = String(reader.result || '')
        const rows = content
          .split(/\r?\n/)
          .map((row) => row.split(',').map((col) => col.trim()))
          .filter((row) => row.some((cell) => cell !== ''))

        await processRows(rows)
        event.target.value = ''
      }
      reader.readAsText(file)
    }
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
          onAdd={handleAddQuestion}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Question Modal */}
      {showEditModal && editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          chapters={chapters}
          onEdit={handleEditQuestion}
          onClose={() => {
            setShowEditModal(false)
            setEditingQuestion(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
