import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    setShowConfirm(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="sticky top-0 z-50 backdrop-blur-glass bg-glass
                   border-b border-white/10 shadow-soft"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* 🔒 LOGO (READ-ONLY FOR ALL) */}
          <span
            className="font-heading text-2xl font-bold tracking-wider text-neon
                       cursor-default select-none"
          >
            CampusBuzz
          </span>

          {/* RIGHT SIDE LINKS */}
          {user && (
            <div className="flex items-center gap-6">

              {/* EVENTS (PUBLIC EVENTS) */}
              <Link
                to="/home"
                className="text-sm font-medium text-gray-300
                           transition hover:text-neon
                           focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-neon
                           focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                Events
              </Link>

              {/* ADMIN DASHBOARD */}
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-gray-300
                             transition hover:text-neon
                             focus-visible:outline-none
                             focus-visible:ring-2 focus-visible:ring-neon
                             focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
                >
                  Dashboard
                </Link>
              )}

              {/* LOGOUT */}
              <button
                onClick={() => setShowConfirm(true)}
                className="rounded-xl bg-gradient-to-r
                           from-pink-500 to-red-500
                           px-4 py-2 text-sm font-semibold text-white
                           transition hover:scale-105
                           hover:shadow-[0_0_20px_rgba(255,0,80,0.6)]
                           focus-visible:outline-none
                           focus-visible:ring-2 focus-visible:ring-red-400
                           focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* LOGOUT CONFIRM MODAL */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        variant="danger"
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleLogout}
      />
   
    </>
  );
};

export default Navbar;
