import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmType, setConfirmType] = useState(null); // "register" | "cancel"

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );
        setEvent(res.data.data);
      } catch {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="mt-16 text-center text-gray-400 animate-pulse">
        Loading event details…
      </div>
    );

  if (error)
    return (
      <div className="mt-16 text-center text-red-400">
        {error}
      </div>
    );

  if (!event) return null;

  const isRegistered =
    user &&
    event.registeredUsers?.some((u) => u._id === user._id);

  /* ⏱️ DATE LOGIC */
  const daysLeft =
    (new Date(event.date) - new Date()) /
    (1000 * 60 * 60 * 24);

  const canModifyRegistration = daysLeft > 15;

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/events/${event._id}/register`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ FIX: go back to events
    navigate("/home", { replace: true });
  };

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/events/${event._id}/register`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ FIX: go back to events
    navigate("/home", { replace: true });
  };

  return (
    <>
      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={confirmType !== null}
        title="Please Confirm"
        message={
          confirmType === "register"
            ? "Do you really want to register for this event?"
            : "Do you really want to cancel your registration?"
        }
        confirmText="Yes, Continue"
        onCancel={() => setConfirmType(null)}
        onConfirm={() => {
          confirmType === "register"
            ? handleRegister()
            : handleCancel();
          setConfirmType(null);
        }}
      />

      <div className="min-h-screen py-10">
        <div
          className="mx-auto max-w-3xl rounded-2xl bg-glass p-8
                     backdrop-blur-glass border border-white/10 shadow-soft"
        >
          {/* TITLE */}
          <h1 className="mb-3 text-2xl font-bold text-white">
            {event.title}
          </h1>

          {/* META */}
          <div className="mb-4 space-y-1 text-sm text-gray-300">
            <p>📅 {format(new Date(event.date), "dd MMM yyyy")}</p>
            <p>📍 {event.location}</p>
          </div>

          {/* DESCRIPTION */}
          <p className="mb-6 text-gray-400 leading-relaxed">
            {event.description}
          </p>

          {/* STUDENT ACTIONS */}
          {user && user.role !== "admin" && (
            <div className="mt-6 space-y-3">

              {!canModifyRegistration && (
                <div className="rounded-xl bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
                  Registration and cancellation are disabled within
                  <strong> 15 days </strong> of the event.
                </div>
              )}

              {!isRegistered && (
                <button
                  disabled={!canModifyRegistration}
                  onClick={() => setConfirmType("register")}
                  className={`rounded-xl px-6 py-2 text-sm font-semibold text-white
                              transition
                              ${
                                canModifyRegistration
                                  ? "bg-gradient-to-r from-neon to-neonBlue hover:shadow-neon hover:scale-105"
                                  : "bg-gray-500/40 cursor-not-allowed"
                              }`}
                >
                  Register for this Event
                </button>
              )}

              {isRegistered && (
                <button
                  disabled={!canModifyRegistration}
                  onClick={() => setConfirmType("cancel")}
                  className={`rounded-xl px-6 py-2 text-sm font-semibold text-white
                              transition
                              ${
                                canModifyRegistration
                                  ? "bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-lg hover:scale-105"
                                  : "bg-gray-500/40 cursor-not-allowed"
                              }`}
                >
                  Cancel Registration
                </button>
              )}
            </div>
          )}

          {/* ✅ FIXED BACK BUTTON */}
          <Link
            to="/home"
            className="mt-8 inline-flex items-center gap-2 rounded-xl
                       border border-white/10 bg-glass px-4 py-2
                       text-sm font-medium text-gray-200
                       backdrop-blur-glass transition
                       hover:border-neon hover:text-neon hover:shadow-neon"
          >
            <span className="text-lg">←</span>
            Back to Events
          </Link>
        </div>
      </div>
    </>
  );
};

export default EventDetailPage;
