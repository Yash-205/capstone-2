"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navLinks = ["Home", "Random", "Videos"];

  const commonLinkClass =
    "text-white transition-all duration-300 hover:text-[#d4af37] hover:scale-105 font-medium tracking-wide";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <Link
            href="/"
            className="text-3xl font-bold tracking-widest text-white hover:text-[#d4af37] transition-colors duration-300 font-serif"
          >
            RECIPE FINDER
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-8 items-center">
            {navLinks.map((text) => (
              <Link
                key={text}
                href={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                className={commonLinkClass}
              >
                {text.toUpperCase()}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLogout}
                  className={`${commonLinkClass} bg-transparent border-none uppercase`}
                >
                  LOGOUT
                </button>
                <Link href="/dashboard" className={`${commonLinkClass} uppercase`}>
                  WELCOME, {user.name.split(" ")[0].toUpperCase()}
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link href="/login" className={commonLinkClass}>
                  LOGIN
                </Link>
                <Link href="/signup" className={`px-6 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-none uppercase tracking-wider font-medium`}>
                  SIGN UP
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white hover:text-[#d4af37] transition-colors focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-[#0a0a0a] z-50 transform transition-transform duration-300 ease-in-out shadow-2xl border-r border-[#d4af37] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-8 relative">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-[#d4af37] transition-colors"
          >
            <X size={24} />
          </button>

          {/* Logo in Drawer */}
          <div className="mb-12 mt-4">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold tracking-widest text-white font-serif"
            >
              RECIPE FINDER
            </Link>
            <div className="h-[2px] w-12 bg-[#d4af37] mt-4"></div>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-6">
            {navLinks.map((text) => (
              <li key={text}>
                <Link
                  href={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-300 hover:text-[#d4af37] hover:pl-2 transition-all duration-300 uppercase tracking-wide border-l-2 border-transparent hover:border-[#d4af37]"
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Links */}
          <div className="mt-auto pt-8 border-t border-white/10">
            {user ? (
              <div className="space-y-4">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-[#d4af37] hover:text-white transition-colors uppercase tracking-wide"
                >
                  Hi, {user.name.split(" ")[0]}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full py-3 border border-white/20 text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 uppercase tracking-wider text-sm font-bold"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center border border-white/20 text-gray-300 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 uppercase tracking-wider text-sm font-bold"
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 text-center bg-[#d4af37] text-black hover:bg-[#f1c40f] transition-all duration-300 uppercase tracking-wider text-sm font-bold"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
