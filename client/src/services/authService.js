import api from "./api";

export const authService = {
  register: (payload) => api.post("/auth/register", payload).then((res) => res.data.data),
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data.data),
  profile: () => api.get("/auth/profile").then((res) => res.data.data),
  users: () => api.get("/users").then((res) => res.data.data.users)
};
