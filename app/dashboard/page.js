"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
//fixed
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const diets = [
  "Gluten Free",
  "Ketogenic",
  "Vegetarian",
  "Lacto-Vegetarian",
  "Ovo-Vegetarian",
  "Vegan",
  "Pescetarian",
  "Paleo",
  "Primal",
  "Low FODMAP",
  "Whole30",
  "",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [diet, setDiet] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  const fetchShoppingList = async () => {
    try {
      const listRes = await fetch(`${API_BASE_URL}/api/shopping-list`, {
        credentials: "include",
      });
      if (!listRes.ok) throw new Error("Failed to fetch shopping list");
      const listData = await listRes.json();
      setShoppingList(listData.shoppingList || []);
    } catch (err) {
      console.error("[FETCH_SHOPPING_LIST]", err);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setDiet(user.dietPreference || "");
      fetchShoppingList();
    }
  }, [user, router]);

  const updateDiet = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/diet`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dietPreference: diet }),
      });

      if (!res.ok) throw new Error("Update failed");
      alert("✅ Diet preference updated!");
    } catch (error) {
      console.error("[UPDATE_DIET_ERROR]", error);
      alert("❌ Error updating diet preference");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/shopping-list`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setShoppingList((prev) => prev.filter((i) => i !== item));
      alert(`🗑️ Removed ${item} from shopping list`);
    } catch (err) {
      alert("❌ Failed to delete item");
      console.error("[DELETE_ITEM ERROR]", err);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="min-h-[60vh] flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')",
        }}
      >
        <div className="flex-grow flex flex-col items-center justify-center px-4">
          <div className="p-6 max-w-xl w-full text-center bg-black/40 rounded-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Welcome, {user.name} 👋
            </h1>
            <p className="text-white mt-2 text-lg">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="w-full bg-amber-50 py-10 px-6 space-y-10">
        {/* 🍽️ Diet Section */}
        <div className="bg-white p-6 rounded shadow border-l-4 border-amber-600">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            Dietary Preference
          </h2>
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
              <option key={d} value={d}>
                {d}
              </option>
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
        <div className="bg-white p-6 rounded shadow border-l-4 border-amber-600">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            🛒 Shopping List
          </h2>
          {shoppingList.length > 0 ? (
            <ul className="space-y-3">
              {shoppingList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-amber-50 p-3 rounded shadow border"
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
            <p className="text-sm text-gray-600">
              No items in your shopping list.
            </p>
          )}
        </div>

        {/* ❤️ Favorites */}
        <div className="bg-white p-6 rounded shadow border-l-4 border-amber-600">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            ❤️ Favorites
          </h2>

          {/* Show Favorites Button */}
          <button
            onClick={async () => {
              try {
                const res = await fetch(`${API_BASE_URL}/api/favorites`, {
                  credentials: "include", // ✅ sends cookies (needed for protect middleware)
                });

                if (!res.ok) throw new Error("Failed to fetch favorites");

                const data = await res.json();
                setFavorites(Array.isArray(data) ? data : data.favorites || []);
              } catch (err) {
                console.error("[FETCH_FAVORITES_ERROR]", err);
                alert("❌ Failed to load favorites");
              }
            }}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 mb-4"
          >
            Show Favorites
          </button>

          {/* Favorites List */}
          {favorites.length === 0 ? (
            <p className="text-gray-500">No favorites yet.</p>
          ) : (
            <ul className="space-y-4">
              {favorites.map((fav) => (
                <li
                  key={fav.id}
                  className="flex items-center justify-between bg-amber-50 p-3 rounded shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {fav.image && (
                      <Image
                        src={fav.image}
                        alt={fav.title}
                        width={64}
                        height={64}
                        className="rounded object-cover"
                      />
                    )}
                    <span className="font-medium text-amber-900">
                      {fav.title}
                    </span>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${API_BASE_URL}/api/favorites/remove`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include", // ✅ send cookies again
                            body: JSON.stringify({ id: fav.id }),
                          }
                        );

                        if (!res.ok)
                          throw new Error("Failed to remove favorite");

                        setFavorites((prev) =>
                          prev.filter((f) => f.id !== fav.id)
                        );
                      } catch (err) {
                        console.error("[REMOVE_FAVORITE_ERROR]", err);
                        alert("❌ Failed to remove favorite");
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
