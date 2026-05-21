import { AlertTriangle, CheckCircle2, ClipboardList, FolderKanban, Timer } from "lucide-react";
import { toast } from "react-toastify";
import { EmptyState } from "../components/common/EmptyState";
import { Loader } from "../components/common/Loader";
import { BarChart } from "../components/dashboard/BarChart";
import { ProgressList } from "../components/dashboard/ProgressList";
import { StatCard } from "../components/dashboard/StatCard";
import { TaskTable } from "../components/dashboard/TaskTable";
import { useAuth } from "../context/AuthContext";
import { useAsync } from "../hooks/useAsync";
import { dashboardService } from "../services/dashboardService";
import { taskService } from "../services/taskService";

export const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { data, loading, error, refetch } = useAsync(() => dashboardService.stats(), []);

  const updateStatus = async (task, status) => {
    try {
      await taskService.update(task._id, { status });
      toast.success("Task status updated");
      refetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader label="Loading dashboard" />;
  if (error) return <EmptyState title="Dashboard unavailable" text={error} />;

  const cards = data.cards;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-sm text-slate-500">Live overview of projects, tasks, and delivery risk.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={FolderKanban} label="Total Projects" value={cards.totalProjects} tone="blue" />
        <StatCard icon={ClipboardList} label="Total Tasks" value={cards.totalTasks} tone="slate" />
        <StatCard icon={CheckCircle2} label="Completed" value={cards.completedTasks} tone="green" />
        <StatCard icon={Timer} label="Pending" value={cards.pendingTasks} tone="amber" />
        <StatCard icon={AlertTriangle} label="Overdue" value={cards.overdueTasks} tone="red" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <BarChart title="Task Status" data={data.charts.statusCounts} />
        <BarChart title="Priority Mix" data={data.charts.priorityCounts} />
        <ProgressList projects={data.charts.projectProgress} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-ink">Assigned Tasks</h2>
        {data.assignedTasks.length ? (
          <TaskTable tasks={data.assignedTasks} canEditStatus={!isAdmin || isAdmin} onStatusChange={updateStatus} />
        ) : (
          <EmptyState title="No assigned tasks" text="Tasks will appear here when they are created and assigned." />
        )}
      </section>
    </div>
  );
};
