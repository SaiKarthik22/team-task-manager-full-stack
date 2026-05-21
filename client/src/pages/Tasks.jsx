import { Filter, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { Input, Select, Textarea } from "../components/common/Input";
import { Loader } from "../components/common/Loader";
import { Modal } from "../components/common/Modal";
import { TaskTable } from "../components/dashboard/TaskTable";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { futureOrToday } from "../utils/validators";

const blankTask = { title: "", description: "", priority: "Medium", status: "Pending", dueDate: "", assignedUser: "", project: "" };

export const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(blankTask);
  const [filters, setFilters] = useState({ status: "", priority: "", deadline: "", search: "", sort: "dueDate" });

  const load = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const [taskData, projectData, userData] = await Promise.all([
        taskService.list(params),
        projectService.list(),
        isAdmin ? authService.users() : Promise.resolve([])
      ]);
      setTasks(taskData);
      setProjects(projectData);
      setUsers(userData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const applyFilters = (event) => {
    event.preventDefault();
    load();
  };

  const updateStatus = async (task, status) => {
    try {
      await taskService.update(task._id, { status });
      toast.success("Task status updated");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openCreate = () => {
    setForm({
      ...blankTask,
      project: projects[0]?._id || "",
      assignedUser: users[0]?._id || ""
    });
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return toast.error("Task title and description are required");
    if (!form.project || !form.assignedUser) return toast.error("Project and assignee are required");
    if (!futureOrToday(form.dueDate)) return toast.error("Due date cannot be in the past");

    try {
      await taskService.create(form);
      toast.success("Task created");
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const remove = async (task) => {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    try {
      await taskService.remove(task._id);
      toast.success("Task deleted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading tasks" />;
  const selectedProject = projects.find((project) => project._id === form.project);
  const assigneeOptions = selectedProject?.members?.length ? selectedProject.members : users;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Tasks</h1>
          <p className="text-sm text-slate-500">Search, filter, sort, and update work items.</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        )}
      </div>

      <form onSubmit={applyFilters} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-6">
        <Input label="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <Select label="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </Select>
        <Select label="Priority" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </Select>
        <Select label="Deadline" value={filters.deadline} onChange={(e) => setFilters({ ...filters, deadline: e.target.value })}>
          <option value="">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="overdue">Overdue</option>
        </Select>
        <Select label="Sort" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="dueDate">Due Date</option>
          <option value="newest">Newest</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </Select>
        <div className="flex items-end">
          <Button className="w-full">
            <Filter className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </form>

      {tasks.length ? (
        <>
          <TaskTable tasks={tasks} canEditStatus onStatusChange={updateStatus} />
          {isAdmin && (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3">
                  <span className="truncate text-sm font-medium text-slate-700">{task.title}</span>
                  <Button variant="danger" className="px-3 py-1.5" onClick={() => remove(task)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No tasks found" text="Adjust filters or create a task for a project." />
      )}

      <Modal title="Create Task" open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Task Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Project"
              value={form.project}
              onChange={(e) => {
                const nextProject = projects.find((project) => project._id === e.target.value);
                setForm({
                  ...form,
                  project: e.target.value,
                  assignedUser: nextProject?.members?.[0]?._id || ""
                });
              }}
            >
              {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
            </Select>
            <Select label="Assigned User" value={form.assignedUser} onChange={(e) => setForm({ ...form, assignedUser: e.target.value })}>
              {assigneeOptions.map((user) => <option key={user._id} value={user._id}>{user.name}</option>)}
            </Select>
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Select>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button>Create Task</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
