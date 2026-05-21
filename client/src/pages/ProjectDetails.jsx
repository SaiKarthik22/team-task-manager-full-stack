import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { Input, Select, Textarea } from "../components/common/Input";
import { Loader } from "../components/common/Loader";
import { Modal } from "../components/common/Modal";
import { TaskTable } from "../components/dashboard/TaskTable";
import { useAuth } from "../context/AuthContext";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { formatDate } from "../utils/formatters";
import { futureOrToday } from "../utils/validators";

const blankTask = { title: "", description: "", priority: "Medium", status: "Pending", dueDate: "", assignedUser: "" };

export const ProjectDetails = () => {
  const { id } = useParams();
  const { isAdmin, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(blankTask);

  const load = async () => {
    setLoading(true);
    try {
      const result = await projectService.get(id);
      setData(result);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const openTaskModal = () => {
    setTaskForm({ ...blankTask, assignedUser: data.project.members[0]?._id || "" });
    setModalOpen(true);
  };

  const submitTask = async (event) => {
    event.preventDefault();
    if (!taskForm.title.trim() || !taskForm.description.trim()) return toast.error("Task title and description are required");
    if (!taskForm.assignedUser) return toast.error("Choose an assignee");
    if (!futureOrToday(taskForm.dueDate)) return toast.error("Due date cannot be in the past");

    try {
      await taskService.create({ ...taskForm, project: id });
      toast.success("Task created");
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await taskService.update(task._id, { status });
      toast.success("Task updated");
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader label="Loading project" />;
  if (!data) return <EmptyState title="Project unavailable" text="The project could not be loaded." />;

  const { project, tasks } = data;

  return (
    <div className="space-y-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-2xl font-bold text-ink">{project.name}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{project.description}</p>
            <p className="mt-3 text-sm text-slate-500">Deadline: <strong>{formatDate(project.deadline)}</strong></p>
          </div>
          <Badge value={project.status} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.members.map((member) => (
            <span key={member._id} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{member.name}</span>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Project Tasks</h2>
          {isAdmin && (
            <Button onClick={openTaskModal}>
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          )}
        </div>
        {tasks.length ? (
          <TaskTable
            tasks={tasks}
            canEditStatus
            canEditTask={(task) => isAdmin || task.assignedUser?._id === user.id}
            onStatusChange={updateStatus}
          />
        ) : (
          <EmptyState title="No tasks yet" text="Add tasks to start tracking progress for this project." />
        )}
      </section>

      <Modal title="Create Task" open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={submitTask} className="space-y-4">
          <Input label="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
          <Textarea label="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Priority" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Select>
            <Select label="Status" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Select>
            <Input label="Due Date" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            <Select label="Assigned User" value={taskForm.assignedUser} onChange={(e) => setTaskForm({ ...taskForm, assignedUser: e.target.value })}>
              {project.members.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
            </Select>
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
