import api from "./api";

export interface Account {
  id: number;
  user_id: number;
  username: string;
  password: string;
  ho_ten: string;
  email: string;
  mssv?: string | null;
  role: "admin" | "giangvien" | "sinhvien";
}

export interface LoginResponse {
  message: string;
  token: string;
  account: Account;
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/api/auth/login", {
      username,
      password,
    });
    return res.data;
  },

  async getMe(): Promise<Account> {
    const res = await api.get<{ account: Account }>("/api/auth/me");
    return res.data.account;
  },

  saveAuth(token: string, account: Account) {
    localStorage.setItem("token", token);
    localStorage.setItem("account", JSON.stringify(account));
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("account");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getSavedAccount(): Account | null {
    const raw = localStorage.getItem("account");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Account;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
