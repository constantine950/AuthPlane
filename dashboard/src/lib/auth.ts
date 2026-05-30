import api from "./api";

export const AuthLib = {
  async login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  },

  async logout() {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};
