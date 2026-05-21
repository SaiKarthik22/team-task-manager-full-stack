import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { Input, Select, Textarea } from "../components/common/Input";
import { Loader } from "../components/common/Loader";
import { Modal } from "../components/common/Modal";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { projectService } from "../services/projectService";
import { formatDate, toInputDate } from "../utils/formatters";
import { futureOrToday } from "../utils/validators";

const blankForm = { name: "", description: "", deadline: "", status: "Planning", members: [] };

export const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);

  const load = async () => {
    setLoading(true);
    try {
      const [projectData, userData] = await Promise.all([
        projectService.list(),
        isAdmin ? authService.users() : Promise.resolve([])
      ]);
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

  const openCreate = () => {
    setEditing(null);
    setForm(blankForm);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      deadline: toInputDate(project.deadline),
      status: project.status,
      members: project.members.map((member) => member._id)
    });
    setModalOpen(true);
  };

  const toggleMember = (id) => {
    setForm((current) => ({
      ...current,
      members: current.members.includes(id)
        ? current.members.filter((memberId) => memberId !== id)
        : [...current.members, id]
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return toast.error("Name and description are required");
    if (!futureOrToday(form.deadline)) return toast.error("Deadline cannot be in the past");

    try {
      if (editing) {
        await projectService.update(editing._id, form);
        toast.success("Project updated");
      } else {
        await projectService.create(form);
        toast.success("Project created");
      }
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const remove = async (project) => {
    if (!confirm(`Delete ${project.name} and all related tasks?`)) return;
    try {
      await projectService.remove(project._id);
      toast.success("Project deleted");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading projects" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="text-sm text-slate-500">Create, assign, and monitor team projects.</p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No projects found" text="Create a project to begin assigning team tasks." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link className="text-lg font-bold text-ink hover:text-brand" to={`/projects/${project._id}`}>
                    {project.name}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description}</p>
                </div>
                <Badge value={project.status} />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p>Deadline: <strong>{formatDate(project.deadline)}</strong></p>
                <p className="mt-1">Members: <strong>{project.members.length}</strong></p>
              </div>
              {isAdmin && (
                <div className="mt-5 flex gap-2">
                  <Button variant="secondary" onClick={() => openEdit(project)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => remove(project)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <Modal title={editing ? "Edit Project" : "Create Project"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Project Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Planning</option>
              <option>Active</option>
              <option>On Hold</option>
              <option>Completed</option>
            </Select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Team Members</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {users.map((user) => (
                <label key={user._id} className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm">
                  <input type="checkbox" checked={form.members.includes(user._id)} onChange={() => toggleMember(user._id)} />
                  <span>{user.name}</span>
                  <Badge value={user.role} />
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button>{editing ? "Save Changes" : "Create Project"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
