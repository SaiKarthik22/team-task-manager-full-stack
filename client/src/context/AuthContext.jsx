import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("ttm_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("ttm_token"));
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("ttm_token")));

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const data = await authService.profile();
        setUser(data.user);
        localStorage.setItem("ttm_user", JSON.stringify(data.user));
      } catch {
        logout(false);
      } finally {
        setBooting(false);
      }
    };
    loadProfile();
  }, [token]);

  const persistSession = (data) => {
    localStorage.setItem("ttm_token", data.token);
    localStorage.setItem("ttm_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (payload) => {
    const data = await authService.login(payload);
    persistSession(data);
    toast.success("Welcome back");
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    persistSession(data);
    toast.success("Account created");
  };

  const logout = (notify = true) => {
    localStorage.removeItem("ttm_token");
    localStorage.removeItem("ttm_user");
    setToken(null);
    setUser(null);
    if (notify) toast.info("Signed out");
  };

  const value = useMemo(() => ({
    user,
    token,
    booting,
    isAdmin: user?.role === "Admin",
    login,
    register,
    logout
  }), [user, token, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
