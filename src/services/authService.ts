import api from "./api";

export interface User {
  id: number;
  ho_ten: string;
  email: string;
  mssv: string | null;
  role: "admin" | "giangvien" | "sinhvien";
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ user: User }>("/api/auth/me");
    return res.data.user;
  },

  saveAuth(token: string, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  getSavedUser(): User | null {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
