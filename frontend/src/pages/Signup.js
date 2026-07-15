import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      return alert("All fields required");
    }

    try {
      setLoading(true);
      await signup(email, name, password);
      navigate("/generate");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "";
      if (msg.includes("waking up") || msg.includes("timeout") || error?.code === "ECONNABORTED") {
        alert("Server is waking up — please wait a moment and try again");
      } else if (msg.includes("Network Error")) {
        alert("Cannot reach server — please check your connection");
      } else {
        alert(error?.response?.data?.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-center">
          Join the Future
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Create your account to start generating futuristic visuals
        </p>

        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl">
          {/* NAME */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 block mb-2">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aiden Smith"
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700
                         focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@ai-platform.com"
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700
                         focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full px-4 py-3 rounded-lg bg-black border border-gray-700
                         focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-purple-500 to-blue-500
                       hover:opacity-90 hover:shadow-lg transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
