// 📁 client/src/pages/Signup.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";


const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        { name, email, password }
      );

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md rounded-2xl bg-glass p-6 backdrop-blur-glass border border-white/10 shadow-soft">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 rounded bg-red-500/20 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-gray-200
           placeholder-gray-400 border border-white/10
           focus:outline-none focus:border-neon focus:shadow-neon"
>
          {/* Name */}
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-gray-200
           placeholder-gray-400 border border-white/10
           focus:outline-none focus:border-neon focus:shadow-neon"

          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-neon hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
