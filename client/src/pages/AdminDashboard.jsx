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
      <div className="mt-20 text-center text-[var(--muted)] animate-pulse">
        Loading admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-red-500">
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
            <h1 className="text-3xl font-bold text-[var(--text)]">
              Admin Dashboard
            </h1>

            <div className="flex flex-wrap gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl bg-[var(--card)]
                           px-4 py-2 text-sm
                           text-[var(--text)]
                           border border-[var(--border)]"
              >
                <option value="date">Latest Date</option>
                <option value="registrations">Most Registrations</option>
                <option value="title">Alphabetical (A–Z)</option>
              </select>

              <Link
                to="/admin/create-event"
                className="rounded-xl bg-[var(--accent)]
                           px-5 py-2.5 text-sm
                           font-semibold text-white
                           transition hover:opacity-90"
              >
                + Create Event
              </Link>
            </div>
          </div>

          {/* TABLE */}
          <div
            className={`rounded-2xl bg-[var(--card)]
                        border border-[var(--border)]
                        shadow-sm overflow-x-auto
                        ${
                          sortedEvents.length > 10
                            ? "max-h-[520px] overflow-y-auto"
                            : ""
                        }`}
          >
            <table className="min-w-[720px] w-full text-sm">
              <thead className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4 text-left text-[var(--text)]">
                    Event Title
                  </th>
                  <th className="px-6 py-4 text-center text-[var(--text)]">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-[var(--text)]">
                    Registrations
                  </th>
                  <th className="px-6 py-4 text-center text-[var(--text)]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="border-t border-[var(--border)]
                               hover:bg-black/5"
                  >
                    <td className="px-6 py-4 font-medium text-[var(--text)]">
                      {event.title}
                    </td>

                    <td className="px-6 py-4 text-center text-[var(--muted)]">
                      {new Date(event.date).toDateString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/event/${event._id}/users`}
                        className="rounded-lg bg-black/5
                                   px-3 py-1.5 text-xs
                                   font-semibold text-[var(--accent)]"
                      >
                        {event.registeredUsers?.length || 0} users
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-center space-x-3">
                      <Link
                        to={`/admin/edit/${event._id}`}
                        className="rounded-lg bg-black/5
                                   px-3 py-1.5 text-xs
                                   font-semibold text-[var(--accent)]"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedEventId(event._id);
                          setShowDeleteConfirm(true);
                        }}
                        className="rounded-lg bg-red-500/10
                                   px-3 py-1.5 text-xs
                                   font-semibold text-red-600"
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
