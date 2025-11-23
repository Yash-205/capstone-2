"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, ShoppingCart, Heart, Trash2, Save, LogOut, User } from "lucide-react";
import Image from "next/image";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

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
  const [activeTab, setActiveTab] = useState("favorites");

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

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/favorites`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : data.favorites || []);
    } catch (err) {
      console.error("[FETCH_FAVORITES_ERROR]", err);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setDiet(user.dietPreference || "");
      fetchShoppingList();
      fetchFavorites();
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
    } catch (err) {
      alert("❌ Failed to delete item");
      console.error("[DELETE_ITEM ERROR]", err);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/favorites/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id }),
        }
      );

      if (!res.ok) throw new Error("Failed to remove favorite");

      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error("[REMOVE_FAVORITE_ERROR]", err);
      alert("❌ Failed to remove favorite");
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Hero Section */}
      <section
        className="relative h-[30vh] md:h-[40vh] flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/photo2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 w-full"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-[#d4af37] rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-[#d4af37]/20">
            <User className="w-8 h-8 md:w-12 md:h-12 text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white font-serif tracking-tight mb-2 break-words">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-lg break-all">{user.email}</p>
        </motion.div>
      </section>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          {[
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
            { id: 'settings', label: 'Preferences', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
                activeTab === tab.id
                  ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20"
                  : "bg-[#111] text-gray-400 border border-white/10 hover:border-[#d4af37] hover:text-[#d4af37]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 md:pb-6 gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">My Favorites</h2>
                <span className="text-[#d4af37] font-medium text-sm md:text-base">{favorites.length} Recipes</span>
              </div>
              
              {favorites.length === 0 ? (
                <div className="text-center py-12 md:py-20 bg-[#111] border border-white/5 rounded-lg px-4">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-base md:text-lg">No favorite recipes yet.</p>
                  <button 
                    onClick={() => router.push('/')}
                    className="mt-4 md:mt-6 text-[#d4af37] hover:text-white underline transition-colors text-sm md:text-base"
                  >
                    Discover Recipes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {favorites.map((fav, index) => (
                    <motion.div
                      key={fav.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-[#111] border border-white/5 overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300"
                    >
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        {fav.image && (
                          <Image
                            src={fav.image}
                            alt={fav.title}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <button
                          onClick={() => removeFavorite(fav.id)}
                          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-serif text-white mb-3 md:mb-4 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                          {fav.title}
                        </h3>
                        <button
                          onClick={() => router.push(`/recipie/${fav.id}`)}
                          className="w-full py-2 md:py-3 border border-white/10 text-gray-300 text-xs md:text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all"
                        >
                          View Recipe
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shopping List Tab */}
          {activeTab === 'shopping' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#111] border border-white/10 p-4 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-6 md:mb-8 border-b border-white/10 pb-4">
                  Shopping List
                </h2>
                {shoppingList.length > 0 ? (
                  <ul className="space-y-3 md:space-y-4">
                    {shoppingList.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-center bg-[#0a0a0a] p-3 md:p-4 border border-white/5 hover:border-[#d4af37]/30 transition-colors group"
                      >
                        <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">{item}</span>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm md:text-base">Your shopping list is empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#111] border border-white/10 p-4 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-6 md:mb-8 border-b border-white/10 pb-4">
                  Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[#d4af37] text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4">
                      Dietary Preference
                    </label>
                    <div className="relative">
                      <select
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-3 md:px-4 text-sm md:text-base appearance-none focus:outline-none focus:border-[#d4af37] transition-colors"
                      >
                        <option value="">No Diet Preference</option>
                        {diets.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={updateDiet}
                    className="w-full py-3 md:py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-[#f1c40f] transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Save className="w-4 h-4 md:w-5 md:h-5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
