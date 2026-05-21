import { Badge } from "../common/Badge";
import { formatDate, isOverdue } from "../../utils/formatters";

export const TaskTable = ({ tasks = [], onStatusChange, canEditStatus = false, canEditTask = () => true }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Assigned</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-ink">{task.title}</td>
              <td className="px-4 py-3 text-slate-600">{task.project?.name || "Unassigned"}</td>
              <td className="px-4 py-3 text-slate-600">{task.assignedUser?.name || "Unknown"}</td>
              <td className="px-4 py-3"><Badge value={task.priority} /></td>
              <td className="px-4 py-3">
                {canEditStatus && canEditTask(task) ? (
                  <select
                    className="focus-ring rounded-md border border-slate-200 bg-white px-2 py-1"
                    value={task.status}
                    onChange={(event) => onStatusChange(task, event.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                ) : (
                  <Badge value={task.status} />
                )}
              </td>
              <td className={`px-4 py-3 ${isOverdue(task.dueDate, task.status) ? "font-semibold text-red-600" : "text-slate-600"}`}>
                {formatDate(task.dueDate)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
