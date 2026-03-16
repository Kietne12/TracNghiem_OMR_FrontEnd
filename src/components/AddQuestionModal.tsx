import { X, Plus } from 'lucide-react'
import { useState } from 'react'

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

interface AddQuestionModalProps {
  chapters: { id: string; name: string; questionCount: number }[]
  onAdd: (question: Omit<Question, 'id' | 'uses' | 'createdAt'>) => void
  onClose: () => void
}

export default function AddQuestionModal({ chapters, onAdd, onClose }: AddQuestionModalProps) {
  const [formData, setFormData] = useState<{
    text: string
    chapter: string
    difficulty: 'Dễ' | 'Bình thường' | 'Khó'
    answers: string[]
    correctAnswer: number
  }>({
    text: '',
    chapter: 'ch1',
    difficulty: 'Bình thường',
    answers: ['', '', '', ''],
    correctAnswer: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.text.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi')
      return
    }

    if (formData.answers.some((a) => !a.trim())) {
      alert('Vui lòng nhập đầy đủ 4 đáp án')
      return
    }

    onAdd({
      text: formData.text,
      chapter: formData.chapter,
      difficulty: formData.difficulty,
      answers: formData.answers,
      correctAnswer: formData.correctAnswer,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Thêm câu hỏi mới</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Câu hỏi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Nhập nội dung câu hỏi..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          {/* Chapter and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Chương <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.chapter}
                onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {chapters
                  .filter((c) => c.id !== 'all')
                  .map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Độ khó <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as 'Dễ' | 'Bình thường' | 'Khó',
                  })
                }
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="Dễ">Dễ</option>
                <option value="Bình thường">Bình thường</option>
                <option value="Khó">Khó</option>
              </select>
            </div>
          </div>

          {/* Answers */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Đáp án <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {formData.answers.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.correctAnswer === idx}
                      onChange={() => setFormData({ ...formData, correctAnswer: idx })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-slate-700 w-6">{'ABCD'[idx]}</span>
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...formData.answers]
                      newAnswers[idx] = e.target.value
                      setFormData({ ...formData, answers: newAnswers })
                    }}
                    placeholder={`Đáp án ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Thêm câu hỏi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
