import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/common/Button";
import { Input, Select } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { strongPassword, validateEmail } from "../utils/validators";

export const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    if (!validateEmail(form.email)) return toast.error("Enter a valid email");
    if (!strongPassword.test(form.password)) return toast.error("Password needs uppercase, lowercase, number, and special character");

    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-bold text-ink">Create account</h2>
      <p className="mt-1 text-sm text-slate-500">Start with an admin or member role.</p>
      <div className="mt-6 space-y-4">
        <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>Member</option>
          <option>Admin</option>
        </Select>
        <Button className="w-full" disabled={loading}>
          <UserPlus className="h-4 w-4" />
          {loading ? "Creating account" : "Sign up"}
        </Button>
      </div>
      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account? <Link className="font-semibold text-brand" to="/login">Login</Link>
      </p>
    </form>
  );
};
