import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <>
      {/* GLOBAL NAVBAR */}
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />

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
