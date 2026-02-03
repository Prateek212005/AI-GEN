import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError(""); // Clear previous error
    if (!email || !password) {
      setError("All fields required");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/generate");
    } catch (error) {
      setError("Wrong password or email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white grid md:grid-cols-2">
      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">AIGen</span>
        </div>

        <div className="bg-black/40 rounded-3xl p-8 max-w-md shadow-xl">
          <h2 className="text-3xl font-bold mb-4">
            The Future of Creation is Here
          </h2>
          <p className="text-gray-300 mb-6">
            Harness the power of generative intelligence to bring your wildest
            visions to life.
          </p>
          <div className="h-32 rounded-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30"></div>
        </div>

        <p className="text-sm text-gray-300">👥 Join 10k+ creators today</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 mb-8">
            Sign in to your AI workspace
          </p>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 shadow-xl">

            {/* EMAIL */}
            <div className="mb-5">
              <label className="text-sm text-gray-400 block mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="name@company.com"
                autoComplete="email"
                name="email"
                className={`w-full px-4 py-3 rounded-lg bg-black border
                           focus:outline-none ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'}`}
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
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                autoComplete="current-password"
                name="password"
                className={`w-full px-4 py-3 rounded-lg bg-black border
                           focus:outline-none ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'}`}
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm">⚠️ {error}</p>
              )}
            </div>

            {/* SIGN IN */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold
                         bg-gradient-to-r from-purple-500 to-blue-500
                         hover:opacity-90 hover:shadow-lg transition mb-6"
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>

            <p className="mt-6 text-sm text-gray-400 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-purple-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
