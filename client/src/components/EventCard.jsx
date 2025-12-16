import { Link } from "react-router-dom";
import { format } from "date-fns";

const EventCard = ({ event }) => {
  return (
    <div
      className="group relative mx-auto w-full max-w-md
                 rounded-2xl p-5 sm:p-6
                 border shadow-soft
                 transition duration-300
                 hover:-translate-y-1 hover:shadow-neon"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl
                      opacity-0 group-hover:opacity-100 transition">
        <div className="absolute inset-0 rounded-2xl
                        bg-gradient-to-br from-neon/20 to-neonBlue/10
                        blur-xl" />
      </div>

      <h3 className="mb-3 text-lg sm:text-xl font-semibold text-[var(--text)]
                     group-hover:text-neon transition">
        {event.title}
      </h3>

      <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
        <span>📅</span>
        <span>{format(new Date(event.date), "dd MMM yyyy")}</span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
        <span>📍</span>
        <span>{event.location}</span>
      </div>

      <p className="mb-6 text-sm text-gray-400 line-clamp-2">
        {event.description}
      </p>

      <Link
        to={`/event/${event._id}`}
        className="inline-block rounded-xl
                   bg-gradient-to-r from-neon to-neonBlue
                   px-5 py-2 text-sm font-semibold text-white
                   transition
                   hover:shadow-neon hover:scale-105"
      >
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
