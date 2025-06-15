
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-amber-400/95 text-white py-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 text-sm">
      <div>
        <h4 className="font-semibold text-lg mb-2">NutriPlated</h4>
        <p>Explore culinary traditions, discover healthy meals, and cook like a pro.</p>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Quick Links</h4>
        <ul className="space-y-1">
          <li><Link href="/videos" className="hover:underline">Videos</Link></li>
          <li><Link href="/random" className="hover:underline">Random</Link></li>
          <li><Link href="/home" className="hover:underline">Home</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2">Stay Connected</h4>
        <p>Join our newsletter for recipe updates and cooking tips.</p>
        <form className="mt-2 flex">
          <input
            type="email"
            placeholder="Your email"
            className="p-2 rounded-l bg-white text-black"
          />
          <button type="submit" className="bg-white text-amber-600 p-2 rounded-r font-semibold hover:bg-gray-100">
            Subscribe
          </button>
        </form>
      </div>
    </div>
    <div className="text-center text-xs mt-6 border-t border-white/30 pt-4">
      &copy; 2025 NutriPlated. All rights reserved.
    </div>
  </footer>

  )
}

export default Footer