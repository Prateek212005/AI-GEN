import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  ImageIcon,
  VideoIcon,
  LayoutGrid,
  CreditCard,
  LogOut,
  User,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-[#1F2937]">
      <div className="relative flex items-center h-16 px-6">

        {/* LOGO – LEFT (UNCHANGED) */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="/assets/logo.png" alt="AI-GEN" className="h-10 w-10" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent">
            AI-GEN
          </span>
        </Link>

        {/* CENTER NAV LINKS */}
        {user && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-1">
            {[
              { path: "/generate", label: "Image", icon: ImageIcon },
              { path: "/generatevideo", label: "Video", icon: VideoIcon },
              { path: "/gallery", label: "Gallery", icon: LayoutGrid },
              { path: "/pricing", label: "Pricing", icon: CreditCard },
            ].map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setShowUserMenu(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive(path)
                    ? "bg-[#A855F7]/20 text-[#A855F7]"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#111827]"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              {/* CREDITS */}
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-[#111827] rounded-lg border border-[#1F2937]">
                <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                <span className="text-white font-semibold">
                  {user?.credits ?? 0}
                </span>
                <span className="text-[#9CA3AF] text-sm">credits</span>
              </div>

              {/* USER MENU */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 bg-[#111827] rounded-lg border border-[#1F2937] hover:border-[#A855F7] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6] flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white hidden md:block max-w-[100px] truncate">
                    {user?.name || "User"}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#111827] rounded-xl border border-[#1F2937] shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-[#1F2937]">
                      <p className="text-white font-semibold truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[#9CA3AF] text-sm truncate">
                        {user?.email}
                      </p>
                      <p className="text-[#22D3EE] text-xs mt-1 capitalize">
                        {user?.subscription_plan || "Free"} Plan
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-[#1F2937]"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-[#EF4444] hover:bg-[#1F2937]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-[#9CA3AF] hover:text-white">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
