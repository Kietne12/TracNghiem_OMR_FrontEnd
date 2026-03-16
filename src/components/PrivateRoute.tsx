import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const { account, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  // Chưa đăng nhập → về login
  if (!account) return <Navigate to="/login" replace />;

  // Có giới hạn role nhưng account không thuộc role cho phép → về trang không có quyền
  if (allowedRoles && !allowedRoles.includes(account.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
