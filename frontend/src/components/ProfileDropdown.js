import { Link } from "react-router-dom";
import { useState } from "react";

const ProfileDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500
                   flex items-center justify-center cursor-pointer font-bold"
      >
        {user?.email?.[0]?.toUpperCase()}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-lg">
          <Link
            to="/profile"
            className="block px-4 py-3 text-sm hover:bg-gray-800"
          >
            Profile
          </Link>

          <Link
            to="/gallery"
            className="block px-4 py-3 text-sm hover:bg-gray-800"
          >
            Gallery
          </Link>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
