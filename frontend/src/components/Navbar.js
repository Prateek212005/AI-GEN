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
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/generate", label: "Image", icon: ImageIcon },
    { path: "/generatevideo", label: "Video", icon: VideoIcon },
    { path: "/gallery", label: "Gallery", icon: LayoutGrid },
    { path: "/pricing", label: "Pricing", icon: CreditCard },
  ];

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-[#1F2937]">
      <div className="relative flex items-center h-16 px-6">

        {/* LOGO – LEFT */}
        <Link to="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
          <img src="/assets/logo.png" alt="AI-GEN" className="h-10 w-10" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#3B82F6] bg-clip-text text-transparent">
            AI-GEN
          </span>
        </Link>

        {/* CENTER NAV LINKS - Desktop Only */}
        {user && (
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
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
              {/* CREDITS - Hidden on small screens */}
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-[#111827] rounded-lg border border-[#1F2937]">
                <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                <span className="text-white font-semibold">
                  {user?.credits ?? 0}
                </span>
                <span className="text-[#9CA3AF] text-sm">credits</span>
              </div>

              {/* USER MENU - Desktop */}
              <div className="relative hidden md:block">
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

              {/* HAMBURGER MENU BUTTON - Mobile Only */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-white hover:bg-[#111827] rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          ) : (
            <>
              {/* Login/Signup - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg hover:opacity-90">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>

              {/* HAMBURGER MENU BUTTON - Mobile Only (Not logged in) */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-white hover:bg-[#111827] rounded-lg transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {showMobileMenu && (
        <div className="md:hidden bg-[#0B0F19] border-t border-[#1F2937]">
          {user ? (
            <>
              {/* User Info */}
              <div className="p-4 border-b border-[#1F2937]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6] flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user?.name || "User"}</p>
                    <p className="text-[#9CA3AF] text-sm">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                  <span className="text-white font-semibold">{user?.credits ?? 0}</span>
                  <span className="text-[#9CA3AF] text-sm">credits</span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="py-2">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 transition-colors ${isActive(path)
                      ? "bg-[#A855F7]/20 text-[#A855F7]"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#111827]"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Profile & Logout */}
              <div className="border-t border-[#1F2937] py-2">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-4 py-3 text-white hover:bg-[#111827]"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-[#EF4444] hover:bg-[#111827]"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            /* Not logged in - Mobile Menu */
            <div className="p-4 space-y-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white text-center rounded-lg hover:opacity-90"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMobileMenu}
                className="block w-full py-3 border border-[#A855F7] text-[#A855F7] text-center rounded-lg hover:bg-[#A855F7]/10"
              >
                Sign Up
              </Link>
              <Link
                to="/pricing"
                onClick={closeMobileMenu}
                className="flex items-center justify-center space-x-2 py-3 text-[#9CA3AF] hover:text-white"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pricing</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
