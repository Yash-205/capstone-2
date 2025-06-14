'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['home','random', 'blog', 'about'];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-100 ${
          scrolled ? 'bg-amber-400 shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-wide text-white hover:text-amber-700 transition-all transform hover:scale-105"
          >
            NutriPlated
          </Link>

          <nav className="hidden lg:flex space-x-6">
            {navLinks.map((text) => (
              <Link
                key={text}
                href={text === 'home' ? '/' : `/${text}`}
                className="text-white transition-all duration-100 hover:text-amber-700 hover:scale-125 font-medium"
              >
                {text}
              </Link>
            ))}
          </nav>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {isOpen && (
        <div
          className={`lg:hidden fixed top-[72px] left-0 w-full z-40 px-6 pb-4 pt-4 transition-all duration-100 ${
            scrolled ? 'bg-amber-400' : 'bg-transparent'
          }`}
        >
          <ul className="space-y-4">
            {navLinks.map((text) => (
              <li key={text}>
                <Link
                  href={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-white text-lg font-medium transition-all hover:text-amber-700 transition-all transform hover:scale-105"
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
