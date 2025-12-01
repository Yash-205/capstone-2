'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { checkAuth } = useAuth();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || 'Login failed');
        return;
      }

      await checkAuth();

      // Check if profile is completed
      const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include',
      });
      const userData = await userRes.json();

      if (userData.user && !userData.user.profileCompleted) {
        router.push('/profile-complete');
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: "url('/photo2.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/40"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <form
          onSubmit={handleLogin}
          className="bg-[#111] border border-white/10 p-10 shadow-2xl space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white font-serif tracking-tight mb-2">
              Welcome Back
            </h2>
            <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          </div>

          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Login
          </button>

          <div className="pt-6 border-t border-white/10">
            <p className="text-center text-sm text-gray-400">
              Do not have an account?{' '}
              <Link href="/signup" className="text-[#d4af37] hover:text-[#f1c40f] transition-colors font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
