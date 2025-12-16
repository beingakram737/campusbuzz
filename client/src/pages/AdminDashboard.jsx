import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // 🔽 SORT STATE
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchAdminEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/admin`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEvents(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminEvents();
  }, []);

  /* ================= SORT LOGIC ================= */
  const sortedEvents = useMemo(() => {
    const copy = [...events];

    if (sortBy === "registrations") {
      return copy.sort(
        (a, b) =>
          (b.registeredUsers?.length || 0) -
          (a.registeredUsers?.length || 0)
      );
    }

    if (sortBy === "title") {
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    // default: latest date first
    return copy.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [events, sortBy]);

  /* ================= DELETE ================= */
  const handleDeleteEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/events/${selectedEventId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) =>
        prev.filter((e) => e._id !== selectedEventId)
      );
    } catch {
      alert("Failed to delete event");
    } finally {
      setShowDeleteConfirm(false);
      setSelectedEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 text-center text-gray-400 animate-pulse">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* DELETE CONFIRM */}
      <ConfirmModal
  isOpen={showDeleteConfirm}
  title="Delete Event"
  message="This action cannot be undone. Are you sure?"
  confirmText="Yes, Delete"
  variant="danger"   // 👈 THIS LINE
  onCancel={() => setShowDeleteConfirm(false)}
  onConfirm={handleDeleteEvent}
/>


      <div className="min-h-screen py-10">
        <div className="mx-auto max-w-7xl px-4">

          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-3xl font-bold text-white">
              Admin Dashboard
            </h1>

            <div className="flex gap-3">
              {/* SORT */}
             <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  style={{
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    padding: "8px 14px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  }}
>
  <option value="date" style={{ backgroundColor: "#0b0f19", color: "#e5e7eb" }}>
    Latest Date
  </option>

  <option value="registrations" style={{ backgroundColor: "#0b0f19", color: "#e5e7eb" }}>
    Most Registrations
  </option>

  <option value="title" style={{ backgroundColor: "#0b0f19", color: "#e5e7eb" }}>
    Alphabetical (A–Z)
  </option>
</select>


              {/* CREATE */}
              <Link
                to="/admin/create-event"
                className="inline-flex items-center justify-center
                           rounded-xl bg-gradient-to-r from-neon to-neonBlue
                           px-5 py-2.5 text-sm font-semibold text-white
                           transition hover:shadow-neon hover:scale-105"
              >
                + Create Event
              </Link>
            </div>
          </div>

          {/* TABLE */}
          {sortedEvents.length === 0 ? (
            <div className="rounded-2xl bg-glass p-8 text-center text-gray-400
                            backdrop-blur-glass border border-white/10 shadow-soft">
              No events found
            </div>
          ) : (
            <div
              className={`rounded-2xl bg-glass backdrop-blur-glass
                          border border-white/10 shadow-soft
                          ${
                            sortedEvents.length > 10
                              ? "max-h-[520px] overflow-y-auto"
                              : ""
                          }`}
            >
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="sticky top-0 bg-glass backdrop-blur-glass
                                 border-b border-white/10 text-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">Event Title</th>
                    <th className="px-6 py-4 text-center">Date</th>
                    <th className="px-6 py-4 text-center">
                      Registrations
                    </th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="border-t border-white/5
                                 hover:bg-white/5 transition"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {event.title}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-400">
                        {new Date(event.date).toDateString()}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/admin/event/${event._id}/users`}
                          className="inline-flex rounded-lg bg-white/5 px-3 py-1.5
                                     text-xs font-semibold text-neon
                                     hover:bg-neon/10 hover:shadow-neon"
                        >
                          {event.registeredUsers?.length || 0} users
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-center space-x-3">
                        <Link
                          to={`/admin/edit/${event._id}`}
                          className="inline-flex rounded-lg bg-white/5 px-3 py-1.5
                                     text-xs font-semibold text-neon
                                     hover:bg-neon/10 hover:shadow-neon"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedEventId(event._id);
                            setShowDeleteConfirm(true);
                          }}
                          className="inline-flex rounded-lg bg-red-500/10 px-3 py-1.5
                                     text-xs font-semibold text-red-400
                                     hover:bg-red-500/20
                                     hover:shadow-[0_0_12px_rgba(255,0,80,0.5)]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
