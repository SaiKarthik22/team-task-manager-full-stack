import api from "./api";

export const taskService = {
  list: (params = {}) => api.get("/tasks", { params }).then((res) => res.data.data.tasks),
  get: (id) => api.get(`/tasks/${id}`).then((res) => res.data.data.task),
  create: (payload) => api.post("/tasks", payload).then((res) => res.data.data.task),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((res) => res.data.data.task),
  remove: (id) => api.delete(`/tasks/${id}`).then((res) => res.data)
};
