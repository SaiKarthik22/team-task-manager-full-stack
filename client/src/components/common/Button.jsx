export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const styles = {
    primary: "bg-brand text-white hover:bg-blue-700",
    secondary: "bg-white text-ink border border-slate-200 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
  };

  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
