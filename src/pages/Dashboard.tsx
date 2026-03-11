import { useAuth } from "../hooks/useAuth";

const roleName: Record<string, string> = {
  admin: "Quản trị viên",
  giangvien: "Giảng viên",
  sinhvien: "Sinh viên",
};

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Xin chào, {user?.ho_ten}!
      </h2>
      <p className="text-gray-600">
        Vai trò: <span className="font-medium">{roleName[user?.role ?? ""] ?? user?.role}</span>
      </p>
      <p className="text-gray-600">
        Email: <span className="font-medium">{user?.email}</span>
      </p>
    </div>
  );
}
