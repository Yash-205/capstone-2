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
    "text-white transition-transform transform duration-200 hover:text-amber-600 hover:scale-110 font-medium";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-100 ${
          scrolled ? "bg-amber-400/95 shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-wide text-white hover:text-amber-600 transition-transform transform hover:scale-110"
          >
            Recipe Finder
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((text) => (
              <Link
                key={text}
                href={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                className={commonLinkClass}
              >
                {text}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className={`${commonLinkClass} bg-transparent border-none`}
                >
                  Logout
                </button>
                <Link href="/dashboard" className={`${commonLinkClass}`}>
                  Welcome, {user.name.split(" ")[0]}
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className={commonLinkClass}>
                  Login
                </Link>
                <Link href="/signup" className={commonLinkClass}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className={`lg:hidden fixed top-[72px] left-0 w-full z-40 px-6 pb-4 pt-4 transition-all duration-100 ${
            scrolled ? "bg-amber-400/95" : "bg-transparent"
          }`}
        >
          <ul className="space-y-4">
            {navLinks.map((text) => (
              <li key={text}>
                <Link
                  href={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={`${commonLinkClass} block text-lg`}
                >
                  {text}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`${commonLinkClass} block text-left w-full`}
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`${commonLinkClass} block text-lg`}
                  >
                    Welcome, {user.name.split(" ")[0]}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className={`${commonLinkClass} block text-lg`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className={`${commonLinkClass} block text-lg`}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
