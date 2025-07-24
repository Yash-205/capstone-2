'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://capstone-2-pvx5.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || 'Signup failed');
        return;
      }

      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
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
        onSubmit={handleSignup}
        className="bg-black/60 rounded-xl p-8 max-w-md w-full text-amber-100 shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-lg border border-amber-400 bg-transparent text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          Sign Up
        </button>

        {/* Login link */}
        <p className="text-center text-sm mt-2 text-amber-200">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-300 underline hover:text-amber-400">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
