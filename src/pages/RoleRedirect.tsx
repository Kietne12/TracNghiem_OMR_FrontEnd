import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Component tự động điều hướng người dùng tới dashboard của role họ
 * Sử dụng cho route "/" (trang chủ)
 */
export default function RoleRedirect() {
  const { account, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!account) {
        // Chưa đăng nhập → về login
        navigate("/login", { replace: true });
      } else {
        // Đã đăng nhập → điều hướng theo role
        const roleRoutes: Record<string, string> = {
          admin: "/admin/dashboard",
          giangvien: "/giangvien/dashboard",
          sinhvien: "/sinhvien/dashboard",
        };
        navigate(roleRoutes[account.role] || "/login", { replace: true });
      }
    }
  }, [account, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Đang chuyển hướng...</p>
    </div>
  );
}
