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
        <div
          className="mx-auto flex max-w-7xl flex-wrap items-center
                     justify-between px-4 py-3 sm:px-6"
        >
          {/* LOGO */}
          <span
            className="font-heading text-xl sm:text-2xl font-bold tracking-wider
                       text-neon cursor-default select-none whitespace-nowrap"
          >
            CampusBuzz
          </span>

          {/* RIGHT LINKS */}
          {user && (
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <Link
                to="/home"
                className="text-sm font-medium text-gray-300
                           transition hover:text-neon"
              >
                Events
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium text-gray-300
                             transition hover:text-neon"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                className="rounded-lg bg-gradient-to-r
                           from-pink-500 to-red-500
                           px-3 py-1.5 text-xs sm:text-sm
                           font-semibold text-white
                           transition hover:scale-105
                           hover:shadow-[0_0_20px_rgba(255,0,80,0.6)]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* CONFIRM LOGOUT */}
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
