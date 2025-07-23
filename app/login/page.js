'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send and receive cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.msg || 'Login failed');
        return;
      }

      await checkAuth();
      router.refresh();  // for Next.js 13+ app router
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20 flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold text-center mb-2">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="border px-4 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border px-4 py-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded">
        Login
      </button>
    </form>
  );
}
