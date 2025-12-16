import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    setShowConfirm(false);
    setMobileMenu(false);
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname.startsWith(path);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--card)] backdrop-blur border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          {/* LOGO */}
          <span className="text-xl sm:text-2xl font-bold text-neon whitespace-nowrap">
            CampusBuzz
          </span>

          {/* DESKTOP LINKS */}
          {user && (
            <div className="hidden sm:flex items-center gap-6">
              <Link
                to="/home"
                className={`text-sm ${
                  isActive("/home") ? "text-neon" : "text-[var(--text)]"
                }`}
              >
                Events
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className={`text-sm ${
                    isActive("/admin")
                      ? "text-neon"
                      : "text-[var(--text)]"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                className="rounded-lg bg-gradient-to-r from-pink-500 to-red-500
                           px-3 py-1.5 text-sm text-white"
              >
                Logout
              </button>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          {user && (
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="sm:hidden text-2xl text-[var(--text)]"
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
        </div>

        {/* MOBILE MENU PANEL */}
        {mobileMenu && (
          <div className="sm:hidden border-t border-[var(--border)]
                          bg-[var(--card)] px-4 py-3 space-y-3">
            <Link
              to="/home"
              onClick={() => setMobileMenu(false)}
              className={`block text-sm ${
                isActive("/home") ? "text-neon" : "text-[var(--text)]"
              }`}
            >
              Events
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenu(false)}
                className={`block text-sm font-medium ${
                  isActive("/admin")
                    ? "text-neon"
                    : "text-[var(--text)]"
                }`}
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full rounded-lg bg-red-500/10 py-2
                         text-sm font-semibold text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* LOGOUT CONFIRM */}
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
