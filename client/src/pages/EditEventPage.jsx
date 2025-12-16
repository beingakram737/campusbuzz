import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = localStorage.getItem("token");
  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH EVENT ================= */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );

        const e = res.data.data;
        setTitle(e.title);
        setDate(e.date.split("T")[0]);
        setLocation(e.location);
        setDescription(e.description);
      } catch {
        setError("Failed to load event");
      }
    };

    fetchEvent();
  }, [id]);

  /* ================= UPDATE EVENT ================= */
  const updateEvent = async () => {
    setError("");

    if (new Date(date) < new Date(today)) {
      setError("Past date is not allowed");
      return;
    }

    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`,
        { title, date, location, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update event"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE EVENT ================= */
  const deleteEvent = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* UPDATE CONFIRM */}
      <ConfirmModal
        isOpen={showUpdateConfirm}
        title="Update Event"
        message="Are you sure you want to update this event?"
        confirmText="Yes, Update"
        onCancel={() => setShowUpdateConfirm(false)}
        onConfirm={() => {
          setShowUpdateConfirm(false);
          updateEvent();
        }}
      />

      {/* DELETE CONFIRM */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="This action cannot be undone. Are you sure?"
        confirmText="Yes, Delete"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          deleteEvent();
        }}
      />

      <div className="min-h-screen py-10">
        <div className="mx-auto max-w-xl rounded-2xl
                        bg-glass p-8 backdrop-blur-glass
                        border border-white/10 shadow-soft">

          {/* HEADER */}
          <h1 className="mb-6 font-heading text-2xl font-bold text-white">
            Edit Event
          </h1>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                         placeholder-gray-400 border border-white/10
                         focus:outline-none focus:border-neon focus:shadow-neon"
            />

            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                         border border-white/10
                         focus:outline-none focus:border-neon focus:shadow-neon"
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                         placeholder-gray-400 border border-white/10
                         focus:outline-none focus:border-neon focus:shadow-neon"
            />

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-gray-200
                         placeholder-gray-400 border border-white/10
                         focus:outline-none focus:border-neon focus:shadow-neon"
            />

            {/* UPDATE */}
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowUpdateConfirm(true)}
              className="w-full rounded-xl bg-gradient-to-r from-neon to-neonBlue
                         py-2.5 text-sm font-semibold text-white
                         transition hover:shadow-neon hover:scale-105
                         disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </form>

          {/* DELETE */}
          <button
            disabled={loading}
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 w-full rounded-xl bg-red-500/20 py-2.5
                       text-sm font-semibold text-red-300
                       transition hover:bg-red-500/30
                       hover:shadow-[0_0_15px_rgba(255,0,80,0.5)]
                       disabled:opacity-60"
          >
            Delete Event
          </button>
        </div>
      </div>
    </>
  );
};

export default EditEventPage;
