'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5050/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = ['Home', 'Random', 'Videos'];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-100 ${
        scrolled ? 'bg-amber-400/95 shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <Link href="/" className="text-3xl font-extrabold tracking-wide text-white hover:text-amber-600 transition-all transform hover:scale-105">
            NutriPlated
          </Link>

          <nav className="hidden lg:flex space-x-6 items-center">
            {navLinks.map((text) => (
              <Link
                key={text}
                href={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                className="text-white transition-all duration-100 hover:text-amber-600 hover:scale-125 font-medium"
              >
                {text}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-500 font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-amber-600 font-medium">Login</Link>
                <Link href="/signup" className="text-white hover:text-amber-600 font-medium">Sign Up</Link>
              </>
            )}
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {isOpen && (
        <div className={`lg:hidden fixed top-[72px] left-0 w-full z-40 px-6 pb-4 pt-4 transition-all duration-100 ${
          scrolled ? 'bg-amber-400/95' : 'bg-transparent'
        }`}>
          <ul className="space-y-4">
            {navLinks.map((text) => (
              <li key={text}>
                <Link
                  href={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-white text-lg font-medium transition-all hover:text-amber-600 hover:scale-105"
                >
                  {text}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-white text-lg font-medium hover:text-red-500 hover:scale-105"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="block text-white text-lg font-medium hover:text-amber-600 hover:scale-105">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/signup" onClick={() => setIsOpen(false)} className="block text-white text-lg font-medium hover:text-amber-600 hover:scale-105">
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
