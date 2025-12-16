import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AdminEventUsersPage = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(res.data.data.registeredUsers || []);
      } catch (err) {
        setError("Failed to load registered users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mt-20 text-center text-gray-400 animate-pulse">
        Loading registered users...
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
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-4">

        {/* HEADER */}
        <h1 className="mb-6 font-heading text-2xl font-bold text-white">
          Registered Users ({users.length})
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded-xl bg-glass px-4 py-3 text-sm text-gray-200
                     placeholder-gray-400 border border-white/10
                     backdrop-blur-glass
                     focus:outline-none focus:border-neon focus:shadow-neon"
        />

        {/* TABLE / EMPTY */}
        {filteredUsers.length === 0 ? (
          <div
            className="rounded-2xl bg-glass p-8 text-center text-gray-400
                       backdrop-blur-glass border border-white/10 shadow-soft"
          >
            No users found
          </div>
        ) : (
          <div
            className="max-h-[420px] overflow-y-auto rounded-2xl
                       bg-glass backdrop-blur-glass
                       border border-white/10 shadow-soft"
          >
            <table className="w-full border-collapse text-sm text-gray-300">
              <thead className="sticky top-0 bg-dark/80 backdrop-blur-glass border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-200">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-200">
                    Email
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-white/5 transition hover:bg-white/5"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {u.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminEventUsersPage;
