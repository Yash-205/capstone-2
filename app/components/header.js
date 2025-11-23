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
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className={`lg:hidden fixed top-[88px] left-0 w-full z-40 px-6 pb-8 pt-4 transition-all duration-300 bg-black/95 border-b border-white/10 backdrop-blur-md`}
        >
          <ul className="space-y-6 text-center">
            {navLinks.map((text) => (
              <li key={text}>
                <Link
                  href={text === "Home" ? "/" : `/${text.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className={`${commonLinkClass} block text-xl uppercase`}
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
                    className={`${commonLinkClass} block w-full text-xl uppercase`}
                  >
                    LOGOUT
                  </button>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`${commonLinkClass} block text-xl uppercase`}
                  >
                    WELCOME, {user.name.split(" ")[0]}
                  </Link>
                </li>
              </>
            ) : (
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={`${commonLinkClass} block text-xl uppercase`}
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className={`inline-block mx-auto px-8 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 uppercase tracking-wider font-medium`}
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
