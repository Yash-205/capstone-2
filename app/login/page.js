'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://capstone-2-3-hmts.onrender.com/api/auth/login', {
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
      router.refresh();
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat px-4"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-black/60 rounded-xl p-8 max-w-md w-full text-amber-100 shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-amber-400 bg-transparent text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-amber-400 bg-transparent text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-semibold transition"
        >
          Login
        </button>

        {/* Signup link */}
        <p className="text-center text-sm mt-2 text-amber-200">
          Do not have an account?{' '}
          <Link href="/signup" className="text-amber-300 underline hover:text-amber-400">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
