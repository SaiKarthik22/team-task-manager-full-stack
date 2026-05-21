import { Inbox } from "lucide-react";

export const EmptyState = ({ title, text }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
    <Inbox className="mx-auto mb-3 h-10 w-10 text-slate-400" aria-hidden="true" />
    <h3 className="text-base font-semibold text-ink">{title}</h3>
    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>
  </div>
);
