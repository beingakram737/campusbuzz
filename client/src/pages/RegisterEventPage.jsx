import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";

const RegisterEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`
        );
        setEvent(res.data.data);
      } catch {
        setStatus("Event not found");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, navigate]);

  const handleRegister = async () => {
    try {
      setStatus("Registering...");
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/register`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus("Registered successfully! Redirecting...");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      setStatus(err.response?.data?.error || "Registration failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!event) return <div className="text-center mt-10">{status}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-xl rounded bg-white p-6 shadow">
        <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

        <p className="text-sm text-gray-600">
          📅 {format(new Date(event.date), "dd MMM yyyy")}
        </p>
        <p className="mb-4 text-sm text-gray-600">📍 {event.location}</p>

        {status && <p className="mb-4 text-sm text-indigo-600">{status}</p>}

        <button
          onClick={handleRegister}
          disabled={status === "Registering..."}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
        >
          Confirm Registration
        </button>
      </div>
    </div>
  );
};

export default RegisterEventPage;
