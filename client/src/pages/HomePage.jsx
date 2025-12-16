import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import EventCardSkeleton from "../components/EventCardSkeleton";

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events`
        );
        setEvents(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="py-6 pb-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 w-full rounded-2xl bg-glass px-5 py-3 text-sm text-gray-200
                     placeholder-gray-400 backdrop-blur-glass
                     border border-white/10
                     focus:outline-none focus:border-neon focus:shadow-neon
                     focus-visible:ring-2 focus-visible:ring-neon
                     focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
        />

        {/* EVENTS */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="mt-10 text-center text-gray-400">
            No events found
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
