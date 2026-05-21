import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";

export const NotFound = () => (
  <div className="flex min-h-[70vh] items-center justify-center">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you opened does not exist.</p>
      <Link to="/">
        <Button className="mt-6">Back to dashboard</Button>
      </Link>
    </div>
  </div>
);
