
'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { RiMenu2Fill } from "react-icons/ri";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 

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

  const NavLinks = () => (
  <>
    <li><Link href="/">Home</Link></li>

    {isLoggedIn && (
      <li><Link href="/dashboard">Dashboard</Link></li>
    )}

    <li><Link href="/services">Services</Link></li>
    <li><Link href="/products">Products</Link></li>
    <li><Link href="/news">News</Link></li>
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
  </>
);


  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex justify-between items-center relative">
      <h1 className="text-xl font-bold">GramBazaar</h1>

      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-5 items-center">
       <NavLinks/>
      </ul>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        <RiMenu2Fill />
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul className="absolute top-16 right-4 bg-white text-black rounded shadow-md p-4 flex flex-col gap-3 z-50 w-48 md:hidden">
          <NavLinks/>
        </ul>
      )}
    </nav>
  );
}
