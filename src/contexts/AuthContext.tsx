import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService, type User } from "../services/authService";
import { AuthContext } from "./authContextDef";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Khi app load → kiểm tra token đã lưu
  useEffect(() => {
    const init = async () => {
      if (authService.isAuthenticated()) {
        try {
          const me = await authService.getMe();
          setUser(me);
        } catch {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // Đồng bộ khi localStorage bị thay đổi từ tab khác
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Khi user quay lại tab → kiểm tra token còn không (bắt trường hợp xóa trong DevTools)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && user && !authService.isAuthenticated()) {
        setUser(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const data = await authService.login(email, password);
    authService.saveAuth(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
