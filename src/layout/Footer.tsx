export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 px-8 py-4 flex justify-between items-center text-sm">
      <p className="text-slate-600">© 2026 SmartQuiz - Hệ Thống Thi Trí Tuệ</p>
      <div className="flex gap-6 text-slate-500">
        <a href="#" className="hover:text-indigo-600 transition">Liên hệ</a>
        <a href="#" className="hover:text-indigo-600 transition">Hỗ trợ</a>
        <a href="#" className="hover:text-indigo-600 transition">Về chúng tôi</a>
      </div>
    </footer>
  )
}