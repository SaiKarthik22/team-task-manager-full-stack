export const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-48 items-center justify-center text-sm font-medium text-slate-500">
    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />
    {label}
  </div>
);
