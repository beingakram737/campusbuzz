// 📁 client/src/pages/ForgotPasswordPage.jsx

import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgotpassword`,
        { email }
      );
      setSuccess("Password reset link sent to your email.");
      setEmail("");
    } catch {
      setError("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md rounded-2xl bg-glass p-6 backdrop-blur-glass border border-white/10 shadow-soft">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">
          Forgot Password
        </h1>

        <p className="mb-6 text-center text-sm text-gray-400">
          Enter your email to receive reset link
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-500/20 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded bg-green-500/20 px-4 py-2 text-sm text-green-300">
            {success}
          </div>
        )}

        <form  onSubmit={handleSubmit} className="w-full rounded-xl bg-transparent px-3 py-2 text-sm text-gray-200
           placeholder-gray-400 border border-white/10
           focus:outline-none focus:border-neon focus:shadow-neon"
>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Remember password?{" "}
          <Link to="/login" className="text-neon hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
