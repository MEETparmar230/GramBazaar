'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/me");
        setIsLoggedIn(res.data.isAuthenticated);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      alert("Logged out!");
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (error) {
      alert("Logout failed.");
    }
  };

  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">GramBazaar</h1>
      <ul className="flex gap-5">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#news">News</a></li>
        <li><Link href="/book">Cart</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </li>
        ) : (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
