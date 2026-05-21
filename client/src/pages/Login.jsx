import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validators";

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!validateEmail(form.email)) return toast.error("Enter a valid email");
    if (!form.password) return toast.error("Password is required");

    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
      <p className="mt-1 text-sm text-slate-500">Log in to manage your team workspace.</p>
      <div className="mt-6 space-y-4">
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button className="w-full" disabled={loading}>
          <LogIn className="h-4 w-4" />
          {loading ? "Logging in" : "Login"}
        </Button>
      </div>
      <p className="mt-5 text-center text-sm text-slate-600">
        New here? <Link className="font-semibold text-brand" to="/signup">Create an account</Link>
      </p>
    </form>
  );
};
