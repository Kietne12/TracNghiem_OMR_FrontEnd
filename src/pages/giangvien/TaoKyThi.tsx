import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, BookOpen, Loader, Zap, VolumeX, Check } from 'lucide-react'
import { useState } from 'react'

type ExamStep = 'semester-year-select' | 'class-select' | 'basic-info' | 'generation-method' | 'configuration' | 'success'

interface ExamConfig {
  semester: string
  academicYear: string
  className: string
  examName: string
  duration: number
  totalQuestions: number
  generationMethod: 'manual' | 'by-chapter'
  selectedChapters: string[]
  hardCount: number
  normalCount: number
  easyCount: number
  shuffle: boolean
  shuffleAnswers: boolean
  examType: 'online' | 'omr'
  examCodeCount: number
}

interface Class {
  id: string
  name: string
  studentCount: number
}

export default function TaoKyThi() {
  const [currentStep, setCurrentStep] = useState<ExamStep>('semester-year-select')
  const [config, setConfig] = useState<ExamConfig>({
    semester: '1',
    academicYear: '2025-2026',
    className: '',
    examName: '',
    duration: 60,
    totalQuestions: 50,
    generationMethod: 'by-chapter',
    selectedChapters: ['ch1', 'ch2', 'ch3'],
    hardCount: 10,
    normalCount: 25,
    easyCount: 15,
    shuffle: false,
    shuffleAnswers: false,
    examType: 'online',
    examCodeCount: 1,
  })

  const semesters = [
    { id: '1', name: 'Kỳ 1' },
    { id: '2', name: 'Kỳ 2' },
  ]

  const academicYears = [
    { id: '2025-2026', name: 'Năm học 2025-2026' },
    { id: '2024-2025', name: 'Năm học 2024-2025' },
    { id: '2023-2024', name: 'Năm học 2023-2024' },
  ]

  const classes: Class[] = [
    { id: 'lop1', name: 'Lớp 10A1 - Toán cao cấp 1', studentCount: 45 },
    { id: 'lop2', name: 'Lớp 10A2 - Toán cao cấp 1', studentCount: 42 },
    { id: 'lop3', name: 'Lớp 10B1 - Vật lý đại cương', studentCount: 48 },
    { id: 'lop4', name: 'Lớp 10B2 - Hóa học', studentCount: 40 },
  ]

  const chapters = [
    { id: 'ch1', name: 'Chương 1: Hàm số và giới hạn', count: 35 },
    { id: 'ch2', name: 'Chương 2: Đạo hàm', count: 28 },
    { id: 'ch3', name: 'Chương 3: Tích phân', count: 32 },
    { id: 'ch4', name: 'Chương 4: Phương trình vi phân', count: 25 },
  ]

  const recentExams = [
    { id: 1, name: 'Toán cao cấp 1 - Giữa kỳ', questions: 50, duration: 90, created: '15/03/2026', type: 'online' },
    { id: 2, name: 'Vật lý đại cương - Quiz 1', questions: 40, duration: 60, created: '12/03/2026', type: 'omr' },
    { id: 3, name: 'Hóa học - Kiểm tra', questions: 45, duration: 75, created: '10/03/2026', type: 'online' },
  ]

  if (currentStep === 'semester-year-select') {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo kỳ thi mới
          </h1>
          <p className="text-slate-600">Bước 1: Chọn kỳ học và năm học</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Kỳ học <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {semesters.map((sem) => (
                  <button
                    key={sem.id}
                    onClick={() => setConfig({ ...config, semester: sem.id })}
                    className={`p-3 rounded-lg border-2 transition font-semibold text-sm ${
                      config.semester === sem.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 text-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    {sem.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Năm học <span className="text-red-500">*</span>
              </label>
              <select
                value={config.academicYear}
                onChange={(e) => setConfig({ ...config, academicYear: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setCurrentStep('class-select')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition mt-4"
            >
              Tiếp theo
            </button>
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg border border-blue-200 p-4">
            <h4 className="font-semibold text-blue-900 mb-1 text-sm">ℹ️ Thông tin</h4>
            <p className="text-xs text-blue-800">
              Chọn kỳ học và năm học để hệ thống hiển thị danh sách lớp học trong kỳ/năm đó.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Step 2: Class Selection
  if (currentStep === 'class-select') {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo kỳ thi mới
          </h1>
          <p className="text-slate-600">Bước 2: Chọn lớp muốn tạo đề thi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => {
                  setConfig({ ...config, className: cls.name })
                  setCurrentStep('basic-info')
                }}
                className="w-full bg-white rounded-lg border border-slate-200 p-6 hover:border-indigo-600 hover:shadow-md transition text-left"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">{cls.name}</h3>
                    <p className="text-sm text-slate-600">Số học sinh: {cls.studentCount} | Kỳ {config.semester}, Năm {config.academicYear}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Zap size={20} className="text-indigo-600" />
                  </div>
                </div>
              </button>
            ))}
          </div>

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
                    <p>Loại: {exam.type === 'online' ? 'Trực tuyến' : 'OMR'}</p>
                    <p className="text-slate-400 pt-1">{exam.created}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Step 3: Basic Information
  if (currentStep === 'basic-info') {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo kỳ thi mới
          </h1>
          <p className="text-slate-600">Bước 3: Nhập thông tin cơ bản</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setCurrentStep('generation-method')
              }}
              className="space-y-6"
            >
              {/* Lớp học */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lớp học</label>
                <input
                  type="text"
                  value={config.className}
                  disabled
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-700"
                />
              </div>

              {/* Tên kỳ thi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tên kỳ thi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.examName}
                  onChange={(e) => setConfig({ ...config, examName: e.target.value })}
                  placeholder="VD: Toán cao cấp 1 - Giữa kỳ"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Thời gian và số câu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Thời gian thi (phút) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={config.duration}
                    onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                    min="15"
                    max="300"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tổng số câu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={config.totalQuestions}
                    onChange={(e) => setConfig({ ...config, totalQuestions: parseInt(e.target.value) })}
                    min="1"
                    max="500"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('class-select')}
                  className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Tiếp theo
                </button>
              </div>
            </form>
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Lưu ý</h4>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Số câu hỏi sẽ được phân bổ theo độ khó ở bước tiếp theo</li>
              <li>✓ Thời gian thi sẽ áp dụng cho tất cả học sinh</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Step 4: Generation Method
  if (currentStep === 'generation-method') {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo kỳ thi mới
          </h1>
          <p className="text-slate-600">Bước 4: Chọn cách sinh đề thi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Manual Selection */}
          <button
            onClick={() => {
              setConfig({ ...config, generationMethod: 'manual' })
              setCurrentStep('configuration')
            }}
            className="bg-white rounded-lg border-2 border-slate-200 p-8 hover:border-indigo-600 hover:shadow-md transition text-left"
          >
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">Chọn thủ công</h3>
            <p className="text-slate-600 text-sm mb-4">
              Tự chọn câu hỏi cho từng câu, kiểm soát toàn bộ nội dung đề thi
            </p>
            <div className="text-xs text-indigo-600 font-semibold">Nhấn để tiếp tục →</div>
          </button>

          {/* By Chapter */}
          <button
            onClick={() => {
              setConfig({ ...config, generationMethod: 'by-chapter' })
              setCurrentStep('configuration')
            }}
            className="bg-white rounded-lg border-2 border-slate-200 p-8 hover:border-cyan-600 hover:shadow-md transition text-left"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">Theo chương</h3>
            <p className="text-slate-600 text-sm mb-4">
              Chọn các chương cần ra đề, hệ thống sẽ tự động phân bổ câu hỏi
            </p>
            <div className="text-xs text-cyan-600 font-semibold">Nhấn để tiếp tục →</div>
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCurrentStep('basic-info')}
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Quay lại
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // Step 5: Configuration
  if (currentStep === 'configuration') {
    const totalConfigured = config.hardCount + config.normalCount + config.easyCount
    const selectedChapterOptions = chapters.filter((ch) => config.selectedChapters.includes(ch.id))

    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo kỳ thi mới
          </h1>
          <p className="text-slate-600">Bước 5: Cấu hình chi tiết đề thi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Method Selection */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Cách sinh đề</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center border-2 rounded-lg p-4 cursor-pointer" style={{ borderColor: config.generationMethod === 'manual' ? '#4f46e5' : '#e2e8f0' }}>
                  <input
                    type="radio"
                    checked={config.generationMethod === 'manual'}
                    onChange={() => setConfig({ ...config, generationMethod: 'manual' })}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">Chọn thủ công</span>
                </label>

                <label className="flex items-center border-2 rounded-lg p-4 cursor-pointer" style={{ borderColor: config.generationMethod === 'by-chapter' ? '#06b6d4' : '#e2e8f0' }}>
                  <input
                    type="radio"
                    checked={config.generationMethod === 'by-chapter'}
                    onChange={() => setConfig({ ...config, generationMethod: 'by-chapter' })}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">Theo chương</span>
                </label>
              </div>
            </div>

            {/* Chapter Selection (if by-chapter) */}
            {config.generationMethod === 'by-chapter' && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Chọn các chương</h3>
                <div className="space-y-2">
                  {chapters.map((ch) => (
                    <label key={ch.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.selectedChapters.includes(ch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({
                              ...config,
                              selectedChapters: [...config.selectedChapters, ch.id],
                            })
                          } else {
                            setConfig({
                              ...config,
                              selectedChapters: config.selectedChapters.filter((id) => id !== ch.id),
                            })
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className="ml-3 text-sm text-slate-700">
                        {ch.name} <span className="text-slate-500">({ch.count} câu)</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Question Distribution */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">
                Phân bổ câu hỏi theo độ khó
                <span className="text-sm text-slate-500 font-normal ml-2">
                  (Tổng: {totalConfigured}/{config.totalQuestions})
                </span>
              </h3>

              <div className="space-y-4">
                {/* Dễ */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Câu dễ</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Dễ</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={config.totalQuestions}
                    value={config.easyCount}
                    onChange={(e) => setConfig({ ...config, easyCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>{config.easyCount} câu</span>
                    <span>{Math.round((config.easyCount / config.totalQuestions) * 100)}%</span>
                  </div>
                </div>

                {/* Bình thường */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Câu bình thường</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Bình thường</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={config.totalQuestions}
                    value={config.normalCount}
                    onChange={(e) => setConfig({ ...config, normalCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>{config.normalCount} câu</span>
                    <span>{Math.round((config.normalCount / config.totalQuestions) * 100)}%</span>
                  </div>
                </div>

                {/* Khó */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Câu khó</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Khó</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={config.totalQuestions}
                    value={config.hardCount}
                    onChange={(e) => setConfig({ ...config, hardCount: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>{config.hardCount} câu</span>
                    <span>{Math.round((config.hardCount / config.totalQuestions) * 100)}%</span>
                  </div>
                </div>
              </div>

              {totalConfigured !== config.totalQuestions && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                  ⚠️ Tổng câu hỏi cấu hình ({totalConfigured}) không bằng số câu yêu cầu ({config.totalQuestions})
                </div>
              )}
            </div>

            {/* Shuffle Options */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Tùy chọn khác</h3>
              <div className="space-y-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.shuffle}
                    onChange={(e) => setConfig({ ...config, shuffle: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">Trộn vị trí câu hỏi</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.shuffleAnswers}
                    onChange={(e) => setConfig({ ...config, shuffleAnswers: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">Trộn vị trí đáp án</span>
                </label>
              </div>
            </div>

            {/* Exam Type */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Loại hình thi</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="border-2 rounded-lg p-4 cursor-pointer" style={{ borderColor: config.examType === 'online' ? '#4f46e5' : '#e2e8f0' }}>
                  <input
                    type="radio"
                    checked={config.examType === 'online'}
                    onChange={() => {
                      setConfig({ ...config, examType: 'online', examCodeCount: 1 })
                    }}
                    className="w-4 h-4"
                  />
                  <div className="ml-0 mt-3">
                    <span className="text-sm font-medium text-slate-700">📱 Trực tuyến</span>
                    <p className="text-xs text-slate-600 mt-1">Sinh viên làm bài trực tiếp trên hệ thống</p>
                  </div>
                </label>

                <label className="border-2 rounded-lg p-4 cursor-pointer" style={{ borderColor: config.examType === 'omr' ? '#06b6d4' : '#e2e8f0' }}>
                  <input
                    type="radio"
                    checked={config.examType === 'omr'}
                    onChange={() => setConfig({ ...config, examType: 'omr' })}
                    className="w-4 h-4"
                  />
                  <div className="ml-0 mt-3">
                    <span className="text-sm font-medium text-slate-700">📄 OMR</span>
                    <p className="text-xs text-slate-600 mt-1">In ra để sinh viên tô phiếu</p>
                  </div>
                </label>
              </div>

              {config.examType === 'omr' && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Số mã đề cần sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={config.examCodeCount}
                    onChange={(e) => setConfig({ ...config, examCodeCount: parseInt(e.target.value) })}
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <p className="text-xs text-slate-600 mt-2">
                    ✓ Hệ thống sẽ sinh {config.examCodeCount} mã đề khác nhau với các câu hỏi/đáp án được xáo trộn
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6 h-fit">
            <h4 className="font-semibold text-indigo-900 mb-4">Tóm tắt cấu hình</h4>
            <div className="space-y-3 text-sm text-indigo-900">
              <div>
                <p className="text-xs text-indigo-700 font-medium">Lớp học</p>
                <p className="text-sm">{config.className}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-700 font-medium">Tên đề</p>
                <p className="text-sm">{config.examName || '(chưa nhập)'}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-700 font-medium">Thời gian</p>
                <p className="text-sm">{config.duration} phút</p>
              </div>
              <div>
                <p className="text-xs text-indigo-700 font-medium">Cấu hình câu hỏi</p>
                <p className="text-sm">Khó: {config.hardCount} | Bình: {config.normalCount} | Dễ: {config.easyCount}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-700 font-medium">Tùy chọn</p>
                <p className="text-sm">
                  {config.shuffle && config.shuffleAnswers
                    ? 'Trộn câu + đáp án'
                    : config.shuffle
                    ? 'Trộn câu'
                    : config.shuffleAnswers
                    ? 'Trộn đáp án'
                    : 'Không trộn'}
                </p>
              </div>
              <div>
                <p className="text-xs text-indigo-700 font-medium">Loại hình</p>
                <p className="text-sm">
                  {config.examType === 'online' ? '📱 Trực tuyến' : `📄 OMR (${config.examCodeCount} mã đề)`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep('success')}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Hoàn tất tạo đề
            </button>

            <button
              onClick={() => setCurrentStep('generation-method')}
              className="w-full mt-2 py-2 rounded-lg border border-indigo-300 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
            >
              Quay lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Step 6: Success
  if (currentStep === 'success') {
    return (
      <DashboardLayout role="GIẢNG VIÊN">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Tạo kỳ thi mới
          </h1>
          <p className="text-slate-600">Hoàn tất!</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 rounded-lg border-2 border-green-200 p-12 text-center">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-green-900 mb-3">Tạo đề thi thành công!</h2>
            <p className="text-green-800 mb-8 text-lg">{config.examName}</p>

            <div className="bg-white rounded-lg border border-green-200 p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-800 mb-4">Thông tin đề thi</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Lớp</p>
                  <p>{config.className}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Thời gian</p>
                  <p>{config.duration} phút</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Số câu hỏi</p>
                  <p>{config.totalQuestions} câu</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Loại</p>
                  <p>{config.examType === 'online' ? 'Trực tuyến' : `OMR (${config.examCodeCount} mã đề)`}</p>
                </div>
              </div>
            </div>

            {config.examType === 'omr' && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Tiếp theo</h3>
                <p className="text-blue-800 text-sm mb-3">Hệ thống đã sinh {config.examCodeCount} mã đề. Bạn có thể:</p>
                <ol className="text-sm text-blue-800 space-y-1 ml-4">
                  <li>1. Tải về file PDF chứa tất cả {config.examCodeCount} mã đề</li>
                  <li>2. In ra các tờ đề</li>
                  <li>3. In phiếu làm trắc nghiệm OMR mẫu</li>
                  <li>4. Tiến hành thi và sử dụng máy quét OMR</li>
                </ol>
              </div>
            )}

            <div className="flex gap-4">
              {config.examType === 'omr' && (
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                  📥 Tải đề thi
                </button>
              )}
              <button
                onClick={() => {
                  const btn = document.createElement('a')
                  btn.innerHTML = 'Chỉnh sửa cấu hình'
                  setCurrentStep('configuration')
                }}
                className="flex-1 border-2 border-indigo-600 text-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                ✏️ Chỉnh sửa cấu hình
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentStep('class-select')
                setConfig({
                  className: '',
                  examName: '',
                  duration: 60,
                  totalQuestions: 50,
                  generationMethod: 'by-chapter',
                  selectedChapters: ['ch1', 'ch2', 'ch3'],
                  hardCount: 10,
                  normalCount: 25,
                  easyCount: 15,
                  shuffle: false,
                  shuffleAnswers: false,
                  examType: 'online',
                  examCodeCount: 1,
                })
              }}
              className="w-full mt-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
            >
              Tạo đề thi mới
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return null
}
