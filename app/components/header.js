'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-amber-400 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-6">
        <h1 className="text-3xl font-extrabold tracking-wide text-white hover:text-amber-600 transition-all transform hover:scale-105">
        NutriPlated
        </h1>
        <nav>
          <ul className="flex space-x-6">
            {['Home', 'Blog', 'About', 'Contact'].map((text) => (
              <li key={text}>
                <Link
                  href={text === 'Home' ? '/' : `/${text.toLowerCase()}`}
                  className="text-white inline-block transform transition-all duration-200 hover:text-amber-500 hover:scale-125 font-medium"
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
