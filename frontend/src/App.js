import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "sonner";

/* COMPONENTS */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";

/* PAGES */
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import GenerateImage from "./pages/ImageGeneration";
import VideoGeneration from "./pages/VideoGeneration";
import Gallery from "./pages/Gallery";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile"; // ✅ NEW
import TextToImageLearnMore from "./pages/TextToImageLearnMore";
import TextToVideoLearnMore from "./pages/TextToVideoLearnMore";
import AdminDashboard from "./pages/AdminDashboard";

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* GLOBAL NAVBAR */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/text-to-image" element={<TextToImageLearnMore />} />
        <Route path="/text-to-video" element={<TextToVideoLearnMore />} />

        {/* AUTH */}
        <Route
          path="/signup"
          element={user ? <Navigate to="/generate" replace /> : <Signup />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/generate" replace /> : <Login />}
        />

        {/* PROTECTED */}
        <Route
          path="/generate"
          element={
            <ProtectedRoute>
              <GenerateImage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/generatevideo"
          element={
            <ProtectedRoute>
              <VideoGeneration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile" // ✅ NEW PROFILE ROUTE
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />

        {/* TOASTS */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#ffffff",
              border: "1px solid #1F2937",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
