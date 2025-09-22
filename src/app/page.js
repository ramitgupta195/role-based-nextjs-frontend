"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log("Data received:", data);
      const role = data.roles[0]; // top-level roles array
      router.push(
        role === "admin" || role === "super_admin"
          ? "/adminDashboard"
          : "/notes"
      );
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 
      bg-gradient-to-br from-[#ff9966] via-[#ff5e62] to-[#8e44ad]"
    >
      {/* Animated glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Auth card */}
      <div
        className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-2xl shadow-lg text-white p-6 transform transition-all duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-center text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-center text-sm text-white/80 mb-4">
          Login to your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/20 placeholder-white text-white backdrop-blur-sm border border-white/30 
              rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/40 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/20 placeholder-white text-white backdrop-blur-sm border border-white/30 
              rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/40 outline-none"
          />
          <button
            type="submit"
            className="w-full font-semibold rounded-lg py-2 transition group bg-transparent text-white"
          >
            <span
              className="transition duration-300 
               group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]"
            >
              Login
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
