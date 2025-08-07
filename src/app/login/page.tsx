"use client"

import axios from "axios";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const res = await axios.post('/api/login', {
      email,
      password,
    });

    alert("Login successful!");
    window.location.href = "/"; 
  } catch (error) {
    alert("Login failed.");
  }
};



  return (
 <div className="flex items-center justify-center  mt-5">
  <div className="bg-zinc-100 p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Login</h2>

    <input
      type="email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="Email"
      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <input
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      placeholder="Password"
      className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <button
      onClick={handleLogin}
      className="w-full bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition"
    >
      Login
    </button>
  </div>
</div>


  );
}
