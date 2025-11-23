
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-gray-300 py-12 border-t border-white/10">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 px-6 text-sm">
      <div className="space-y-4">
        <h4 className="font-serif text-xl tracking-widest text-[#d4af37]">RECIPE FINDER</h4>
        <p className="leading-relaxed font-light text-gray-400">Explore culinary traditions, discover healthy meals, and cook like a pro with our curated collection.</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-serif text-xl tracking-widest text-[#d4af37]">QUICK LINKS</h4>
        <ul className="space-y-2">
          <li><Link href="/videos" className="hover:text-[#d4af37] transition-colors uppercase tracking-wide text-xs">Videos</Link></li>
          <li><Link href="/random" className="hover:text-[#d4af37] transition-colors uppercase tracking-wide text-xs">Random</Link></li>
          <li><Link href="/home" className="hover:text-[#d4af37] transition-colors uppercase tracking-wide text-xs">Home</Link></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="font-serif text-xl tracking-widest text-[#d4af37]">STAY CONNECTED</h4>
        <p className="font-light text-gray-400">Join our newsletter for recipe updates and cooking tips.</p>
        <form className="mt-4 flex border-b border-gray-700 pb-2">
          <input
            type="email"
            placeholder="Your email"
            className="flex-grow bg-transparent text-white placeholder-gray-600 focus:outline-none"
          />
          <button type="submit" className="text-[#d4af37] font-semibold hover:text-white transition-colors uppercase text-xs tracking-wider">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
    <div className="text-center text-xs mt-12 text-gray-600 uppercase tracking-widest">
      &copy; 2025 NutriPlated. All rights reserved.
    </div>
  </footer>

  )
}

export default Footer