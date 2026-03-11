import DashboardLayout from "../../layout/DashboardLayout"
import { Plus, Edit2, Trash2, Search, Lock, Unlock } from 'lucide-react'
import { useState } from 'react'

export default function QuanLyTaiKhoan() {
  const [searchQuery, setSearchQuery] = useState('')
  const [accounts, setAccounts] = useState([
    { id: 1, email: 'giangvien1@example.com', name: 'Trần Văn X', role: 'Giáo viên', status: 'Hoạt động', joined: '01/01/2026' },
    { id: 2, email: 'sv001@example.com', name: 'Nguyễn Văn A', role: 'Sinh viên', status: 'Hoạt động', joined: '15/02/2026' },
    { id: 3, email: 'sv002@example.com', name: 'Trần Thị B', role: 'Sinh viên', status: 'Khóa', joined: '15/02/2026' },
    { id: 4, email: 'admin@example.com', name: 'Admin System', role: 'Admin', status: 'Hoạt động', joined: '01/01/2026' },
  ])

  const filteredAccounts = accounts.filter(a =>
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleLock = (id: number) => {
    setAccounts(accounts.map(a =>
      a.id === id
        ? { ...a, status: a.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động' }
        : a
    ))
  }

  const handleDelete = (id: number) => {
    setAccounts(accounts.filter(a => a.id !== id))
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
            Quản lý tài khoản
          </h1>
          <p className="text-slate-600">Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
          <Plus size={20} />
          Tạo tài khoản
        </button>
      </div>

      {/* Search */}
      <div className="mb-8 relative">
        <Search size={20} className="absolute left-4 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tên</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Vai trò</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tham gia</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-sm text-indigo-600 font-medium">{account.email}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium">{account.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      account.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      account.role === 'Giáo viên' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {account.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      account.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{account.joined}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-indigo-600">
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => toggleLock(account.id)}
                        className={`p-2 hover:bg-slate-100 rounded-lg transition ${
                          account.status === 'Hoạt động'
                            ? 'text-slate-600 hover:text-red-600'
                            : 'text-slate-600 hover:text-green-600'
                        }`}
                      >
                        {account.status === 'Hoạt động' ? (
                          <Lock size={18} />
                        ) : (
                          <Unlock size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAccounts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">Không tìm thấy tài khoản nào</p>
          </div>
        )}
        <div className="mt-4 text-sm text-slate-600 text-right">
          Tổng: {filteredAccounts.length} tài khoản
        </div>
      </div>
    </DashboardLayout>
  )
}
