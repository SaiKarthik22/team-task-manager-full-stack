import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AuthLayout = () => {
  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  return (
    <main className="min-h-screen bg-surface">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-12 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand text-lg font-bold">TT</div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight">Team Task Manager</h1>
            <p className="mt-4 max-w-lg text-base text-slate-300">
              Plan projects, assign ownership, and keep every task moving with a focused team dashboard.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="rounded-lg border border-white/10 p-4">
              <strong className="block text-2xl text-white">RBAC</strong>
              Admin and member controls
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <strong className="block text-2xl text-white">JWT</strong>
              Token-secured API
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <strong className="block text-2xl text-white">MERN</strong>
              Production-ready stack
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center p-6">
          <Outlet />
        </section>
      </div>
    </main>
  );
};
