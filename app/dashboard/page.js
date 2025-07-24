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
  const [shoppingList, setShoppingList] = useState([]);
  const router = useRouter();

  const fetchUserAndShoppingList = async () => {
    try {
      const userRes = await fetch('http://localhost:5050/api/auth/me', {
        credentials: 'include',
      });

      if (!userRes.ok) throw new Error('Not authenticated');

      const userData = await userRes.json();
      setUser(userData.user);
      setDiet(userData.user?.dietPreference || '');

      const listRes = await fetch('http://localhost:5050/api/shopping-list', {
        credentials: 'include',
      });

      const listData = await listRes.json();
      if (listRes.ok) setShoppingList(listData.shoppingList || []);
    } catch (err) {
      console.error(err);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUserAndShoppingList();
  }, []);

  const updateDiet = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/auth/diet', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dietPreference: diet }),
      });

      if (!res.ok) throw new Error("Update failed");
      alert('Diet preference updated!');
    } catch (error) {
      alert("Error updating diet preference");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const res = await fetch("http://localhost:5050/api/shopping-list", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setShoppingList((prev) => prev.filter((i) => i !== item));
    } catch (err) {
      alert("Failed to delete item");
      console.error(err);
    }
  };

  if (!user) return <p className="text-center mt-20">Loading your dashboard...</p>;

  return (
    <div className="w-full bg-amber-50/50 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-10 border-l-4 border-amber-600">
        <div>
          <h1 className="text-4xl font-bold text-amber-800 mb-2">Welcome, {user.name} 👋</h1>
          <p className="text-gray-700 text-lg">Email: {user.email}</p>
        </div>

        {/* 🍽️ Diet Section */}
        <div className="bg-amber-50 p-5 rounded shadow-md border-l-4 border-amber-600">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">Dietary Preference</h2>
          {user.dietPreference && (
            <p className="text-green-700 mb-3">
              Current Preference: <strong>{user.dietPreference}</strong>
            </p>
          )}

          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="">No Diet Preference</option>
            {diets.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <button
            onClick={updateDiet}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          >
            Save Preference
          </button>
        </div>

        {/* 🛒 Shopping List */}
        <div className="bg-amber-50 p-5 rounded shadow-md border-l-4 border-amber-600">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">🛒 Shopping List</h2>
          {shoppingList.length > 0 ? (
            <ul className="space-y-3">
              {shoppingList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-white p-3 rounded shadow border"
                >
                  <span className="text-amber-900">{item}</span>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">No items in your shopping list.</p>
          )}
        </div>
      </div>
    </div>
  );
}
