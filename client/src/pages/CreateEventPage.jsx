import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Today date (disable past dates)
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !date || !location || !description) {
      setError("All fields are required");
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      setError("Event date cannot be in the past");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please login again.");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events`,
        {
          title,
          date,
          location,
          description,
          organizer: user?.name || "Admin",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div
        className="mx-auto max-w-xl rounded-2xl
                   bg-glass p-8 backdrop-blur-glass
                   border border-white/10 shadow-soft"
      >
        {/* HEADER */}
        <h1 className="mb-6 font-heading text-2xl font-bold text-white">
          Create New Event
        </h1>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                       border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          <textarea
            rows="4"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                       placeholder-gray-400 border border-white/10
                       focus:outline-none focus:border-neon focus:shadow-neon"
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-neon to-neonBlue
                       py-2.5 text-sm font-semibold text-white
                       transition hover:shadow-neon hover:scale-105
                       disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
