export default function Navbar() {
  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">

      <h1 className="font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">

        <span className="text-sm text-gray-600">
          Admin
        </span>

        <button className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>

      </div>

    </div>
  )
}