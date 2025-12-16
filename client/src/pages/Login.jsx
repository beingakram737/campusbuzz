import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { unlockBackNavigation } from "../utils/historyLock";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      // ✅ Save auth
      login(res.data.user, res.data.token);
      unlockBackNavigation();

      // ✅ Redirect by role
      navigate(
        res.data.user.role === "admin"
          ? "/admin/dashboard"
          : "/home",
        { replace: true }
      );
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🔒 FULL SCREEN CENTER – NO SCROLL */
    <div className="flex min-h-screen items-center justify-center bg-dark px-4 overflow-hidden">
      
      {/* 🔲 LOGIN CARD */}
      <div
        className="w-full max-w-sm rounded-2xl bg-glass p-8
                   backdrop-blur-glass border border-white/10 shadow-soft"
      >
        {/* TITLE */}
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Login to CampusBuzz
        </h1>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon
                       focus-visible:ring-2 focus-visible:ring-neon
                       focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon
                       focus-visible:ring-2 focus-visible:ring-neon
                       focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-neon to-neonBlue
                       py-3 text-sm font-semibold text-white
                       transition
                       hover:shadow-neon hover:scale-[1.02]
                       disabled:opacity-60 disabled:cursor-not-allowed
                       focus-visible:outline-none
                       focus-visible:ring-2 focus-visible:ring-neon
                       focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <Link
            to="/forgotpassword"
            className="hover:text-neon transition"
          >
            Forgot password?
          </Link>
          <Link
            to="/signup"
            className="hover:text-neon transition"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
