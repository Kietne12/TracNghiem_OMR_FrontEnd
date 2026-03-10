export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-700 text-white flex flex-col">

      <div className="p-4 font-bold text-lg border-b border-blue-500">
        OMR Exam System
      </div>

      <nav className="flex-1 p-4 space-y-2">

        <a className="block hover:bg-blue-600 p-2 rounded">
          Dashboard
        </a>

        <a className="block hover:bg-blue-600 p-2 rounded">
          Ngân hàng câu hỏi
        </a>

        <a className="block hover:bg-blue-600 p-2 rounded">
          Tạo kỳ thi
        </a>

        <a className="block hover:bg-blue-600 p-2 rounded">
          Chấm bài OMR
        </a>

      </nav>

    </div>
  )
}