import { ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-ink">Profile</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <UserRound className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Role</p>
            <div className="mt-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" />
              <Badge value={user.role} />
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">User ID</p>
            <p className="mt-2 break-all text-sm font-medium text-ink">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
