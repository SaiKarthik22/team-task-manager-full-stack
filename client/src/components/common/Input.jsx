export const Input = ({ label, error, className = "", ...props }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <input
      className={`focus-ring w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export const Textarea = ({ label, error, className = "", ...props }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <textarea
      className={`focus-ring min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm ${className}`}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export const Select = ({ label, children, error, className = "", ...props }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <select
      className={`focus-ring w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);
