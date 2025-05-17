'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function Home() {
  const [dish, setDish] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (dish.trim()) {
      router.push(`/recipes/${encodeURIComponent(dish.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section
        className="min-h-screen flex flex-col bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.01), rgba(255,255,255,0.01)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')",
        }}
      >
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="p-4 max-w-xl w-full text-center space-y-6 bg-white/10  rounded-xl">
            <h2 className="text-3xl font-bold text-shadow-black">
              Find Delicious Recipes
            </h2>
            <div className="flex items-center gap-4">
              <input
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                type="text"
                placeholder="Search for recipes..."
                className="w-full p-4 border border-amber-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-300"
              />
              <button
                onClick={handleSearch}
                className="p-4 bg-amber-400 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
