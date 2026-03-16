import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService, type Account } from "../services/authService";
import { AuthContext } from "./authContextDef";

export interface AuthContextType {
  account: Account | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<Account>;
  logout: () => void;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  // Khi app load → kiểm tra token đã lưu
  useEffect(() => {
    const init = async () => {
      if (authService.isAuthenticated()) {
        try {
          const me = await authService.getMe();
          setAccount(me);
        } catch {
          authService.logout();
          setAccount(null);
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
        setAccount(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Khi user quay lại tab → kiểm tra token còn không (bắt trường hợp xóa trong DevTools)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && account && !authService.isAuthenticated()) {
        setAccount(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [account]);

  const login = useCallback(async (username: string, password: string): Promise<Account> => {
    const data = await authService.login(username, password);
    authService.saveAuth(data.token, data.account);
    setAccount(data.account);
    return data.account;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAccount(null);
  }, []);

  return (
    <AuthContext.Provider value={{ account, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
