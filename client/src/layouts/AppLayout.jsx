import { BarChart3, FolderKanban, LogOut, Menu, User, Users, X, CheckSquare } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/team", label: "Team", icon: Users, adminOnly: true },
  { to: "/profile", label: "Profile", icon: User }
];

export const AppLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const nav = (
    <nav className="space-y-1">
      {links.filter((link) => !link.adminOnly || isAdmin).map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
            }`
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white p-5 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-sm font-bold text-white">TT</div>
          <div>
            <p className="font-bold text-ink">Task Manager</p>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden">
          <aside className="h-full w-72 bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <strong>Task Manager</strong>
              <Button variant="ghost" className="px-2" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <div>
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="px-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <h2 className="font-semibold text-ink">{user?.name}</h2>
            </div>
          </div>
          <Button variant="secondary" onClick={() => logout()}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
