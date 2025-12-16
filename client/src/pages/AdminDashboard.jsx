import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchAdminEvents = async () => {
      try {
        const res = await api.get("/events/admin");
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

  /* SORT LOGIC (UNCHANGED) */
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
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    }

    return copy.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [events, sortBy]);

  /* DELETE (UNCHANGED) */
  const handleDeleteEvent = async () => {
    try {
      await api.delete(`/events/${selectedEventId}`);
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
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message="This action cannot be undone. Are you sure?"
        confirmText="Yes, Delete"
        variant="danger"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteEvent}
      />

      <div className="min-h-screen py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Admin Dashboard
            </h1>

            <div className="flex gap-3 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl bg-white/10 px-4 py-2 text-sm text-gray-200
                           border border-white/20"
              >
                <option value="date">Latest Date</option>
                <option value="registrations">Most Registrations</option>
                <option value="title">Alphabetical (A–Z)</option>
              </select>

              <Link
                to="/admin/create-event"
                className="rounded-xl bg-gradient-to-r from-neon to-neonBlue
                           px-5 py-2.5 text-sm font-semibold text-white
                           transition hover:shadow-neon hover:scale-105"
              >
                + Create Event
              </Link>
            </div>
          </div>

          {/* TABLE WRAPPER (MOBILE SAFE) */}
          <div
            className={`rounded-2xl bg-glass backdrop-blur-glass
                        border border-white/10 shadow-soft
                        overflow-x-auto
                        ${
                          sortedEvents.length > 10
                            ? "max-h-[520px] overflow-y-auto"
                            : ""
                        }`}
          >
            <table className="min-w-[720px] w-full border-collapse text-sm text-gray-300">
              <thead className="sticky top-0 bg-glass border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left">Event Title</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-center">Registrations</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="border-t border-white/5 hover:bg-white/5"
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
                        className="rounded-lg bg-white/5 px-3 py-1.5
                                   text-xs font-semibold text-neon"
                      >
                        {event.registeredUsers?.length || 0} users
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-center space-x-3">
                      <Link
                        to={`/admin/edit/${event._id}`}
                        className="rounded-lg bg-white/5 px-3 py-1.5
                                   text-xs font-semibold text-neon"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedEventId(event._id);
                          setShowDeleteConfirm(true);
                        }}
                        className="rounded-lg bg-red-500/10 px-3 py-1.5
                                   text-xs font-semibold text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
