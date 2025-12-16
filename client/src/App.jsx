import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDetailPage from "./pages/EventDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import RegisterEventPage from "./pages/RegisterEventPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminEventUsersPage from "./pages/AdminEventUsersPage";

const AppLayout = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/signup",
    "/forgotpassword",
  ];

  const hideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/resetpassword");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "max-w-7xl mx-auto px-4 py-6" : ""}>
        <Routes>
          {/* ROOT → LOGIN */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* PUBLIC EVENTS (STUDENT + ADMIN) */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* EVENT DETAILS */}
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/register/:id" element={<RegisterEventPage />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route
            path="/resetpassword/:resetToken"
            element={<ResetPasswordPage />}
          />

          {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/create-event"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateEventPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditEventPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/event/:id/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEventUsersPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] items-center justify-center text-xl font-semibold text-gray-600">
                404 | Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
