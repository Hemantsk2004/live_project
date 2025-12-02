import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import AuthContext from "../context/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useContext(AuthContext);

  // detect mode by route
  const isRegisterRoute = location.pathname === "/register";
  const [isLogin, setIsLogin] = useState(!isRegisterRoute);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const resetForm = () => {
    setFullname("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password || (!isLogin && !fullname)) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    setBusy(true);

    try {
      if (isLogin) {
        const res = await axiosInstance.post("/auth/login", {
          email,
          password,
        });

        const { token, user } = res.data;
        loginUser(user, token);

        setMessage({
          type: "success",
          text: "Authentication successful. Redirecting…",
        });

        setTimeout(() => {
          switch (user.role) {
            case "admin":
              navigate("/admin/dashboard");
              break;
            case "superadmin":
              navigate("/superadmin/dashboard");
              break;
            default:
              navigate("/user/dashboard");
          }
        }, 350);
      } else {
        await axiosInstance.post("/auth/register", {
          fullname,
          email,
          password,
        });

        setMessage({
          type: "success",
          text: "Account created successfully. Please sign in.",
        });

        resetForm();
        setIsLogin(true);
        navigate("/login", { replace: true });
      }
    } catch (err) {
      const text =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";
      setMessage({ type: "error", text });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-4">
      {/* CARD */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.18)] p-8">

        {/* BRAND */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            CMS
          </div>
          <div>
            <p className="font-semibold text-slate-900">Complaint Matrix</p>
            <p className="text-xs text-slate-500">
              Secure access portal
            </p>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-slate-900 mb-1">
          {isLogin ? "Sign in" : "Create account"}
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          {isLogin
            ? "Authenticate to access your dashboard."
            : "Register to raise and track complaints."}
        </p>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-sm border ${
              message.type === "error"
                ? "bg-rose-50 text-rose-700 border-rose-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* LOGIN / REGISTER TOGGLE */}
        <div className="flex mb-5 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              navigate("/login");
            }}
            disabled={busy}
            className={`flex-1 py-2 text-sm rounded-xl transition ${
              isLogin
                ? "bg-white shadow text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              navigate("/register");
            }}
            disabled={busy}
            className={`flex-1 py-2 text-sm rounded-xl transition ${
              !isLogin
                ? "bg-white shadow text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Full name
              </label>
              <input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full mt-2 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-2.5 font-semibold shadow-lg hover:-translate-y-[1px] transition disabled:opacity-60"
          >
            {busy
              ? isLogin
                ? "Signing in…"
                : "Creating account…"
              : isLogin
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-sky-500" />
          Secure, role-based access
        </div>
      </div>
    </div>
  );
}
