"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000";

export default function AuthForm() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect after login
      router.push("/v/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP ---------------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // Auto switch to login
      setIsLogin(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 transition-all duration-500">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10">
          <Image src="/auth-image.png" alt="Company" width={280} height={280} />
          <h1 className="text-3xl font-bold mt-6">Your Company</h1>
          <p className="text-center text-sm text-indigo-100 mt-2">
            Secure authentication made simple.
          </p>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-12 relative">
          {/* TOGGLE */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-l-lg ${
                isLogin ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-r-lg ${
                !isLogin ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          {/* LOGIN FORM */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-5">
              <h2 className="text-2xl font-bold text-center">
                Welcome Back 👋
              </h2>

              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {!isLogin && (
            <form onSubmit={handleSignup} className="space-y-5">
              <h2 className="text-2xl font-bold text-center">
                Create Account 🚀
              </h2>

              <input
                type="text"
                placeholder="Full Name"
                value={signupData.name}
                onChange={(e) =>
                  setSignupData({ ...signupData, name: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
