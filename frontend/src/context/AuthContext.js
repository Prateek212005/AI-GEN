import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 🔁 Fetch user from token (page refresh)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // ✅ SIGNUP
  const signup = async (email, name, password) => {
    const res = await API.post("/auth/signup", {
      email,
      name,
      password,
    });

    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);

    return res.data.user;
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);

    return res.data.user;
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // ✅ Update credits (used after generation)
  const updateCredits = (credits) => {
    setUser((prev) => ({ ...prev, credits }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        signup,
        login,
        logout,
        updateCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
