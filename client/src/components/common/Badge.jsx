const colors = {
  Admin: "bg-blue-100 text-blue-800",
  Member: "bg-slate-100 text-slate-700",
  Pending: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-indigo-100 text-indigo-800",
  High: "bg-red-100 text-red-800",
  Planning: "bg-slate-100 text-slate-700",
  Active: "bg-emerald-100 text-emerald-800",
  "On Hold": "bg-amber-100 text-amber-800"
};

export const Badge = ({ value }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[value] || "bg-slate-100 text-slate-700"}`}>
    {value}
  </span>
);
