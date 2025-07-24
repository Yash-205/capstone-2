'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const diets = [
  'Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian',
  'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo',
  'Primal', 'Low FODMAP', 'Whole30',""
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [diet, setDiet] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5050/api/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUser(data.user);
        setDiet(data.user?.dietPreference || '');
      } catch (err) {
        console.error(err);
        router.push('/login');
      }
    };

    fetchUser();
  }, []);

  const updateDiet = async () => {
  try {
    const res = await fetch('http://localhost:5050/api/auth/diet', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ dietPreference: diet }), // diet can be ""
    });

    if (!res.ok) throw new Error("Update failed");

    alert('Diet preference updated!');
  } catch (error) {
    alert("Error updating diet preference");
  }
};


  if (!user) return <p className="text-center mt-20">Loading your dashboard...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} 👋</h1>
      <p className="text-lg text-gray-600 mb-4">Email: {user.email}</p>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-2">Dietary Preference</h2>

        {user.dietPreference && (
          <p className="mb-2 text-sm text-green-600">
            Current Preference: <strong>{user.dietPreference}</strong>
          </p>
        )}

        <select
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        >
          <option value="">No Diet Preference</option>
          {diets.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <button
          onClick={updateDiet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Preference
        </button>
      </div>
    </div>
  );
}
