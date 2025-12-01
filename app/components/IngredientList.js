"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const IngredientList = ({ ingredients }) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);
  const [subError, setSubError] = useState("");
  const [loadingIngredient, setLoadingIngredient] = useState(null);
  const [addedItems, setAddedItems] = useState([]);

  const { user } = useAuth();
  const router = useRouter();

  // Load shopping list if logged in
  useEffect(() => {
    const fetchShoppingList = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/shopping-list`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const items = data.items?.map((i) => i.item) || [];
          setAddedItems(items);
        } else {
          console.warn("Failed to fetch shopping list");
        }
      } catch (err) {
        console.error("Error fetching shopping list:", err);
      }
    };

    fetchShoppingList();
  }, [user]);

  const fetchSubstitutes = async (ingredientName) => {
    setLoadingIngredient(ingredientName);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/substitutes?ingredientName=${ingredientName}`
      );
      const data = await res.json();

      if (data.substitutes) {
        setSubstitutes(data.substitutes);
        setSubError("");
      } else {
        setSubstitutes([]);
        setSubError("No substitutes found.");
      }

      setSelectedIngredient(ingredientName);
    } catch (error) {
      console.error(error);
      setSubstitutes([]);
      setSubError("Failed to fetch substitutes.");
      setSelectedIngredient(ingredientName);
    } finally {
      setLoadingIngredient(null);
    }
  };

  const handleAddToList = async (ingredientName) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/shopping-list`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: ingredientName }),
      });

      if (!res.ok) throw new Error("Add failed");

      setAddedItems((prev) => [...prev, ingredientName]);
      alert(`✅ Added ${ingredientName} to shopping list`);
    } catch (err) {
      console.error("Add error", err);
      alert("Failed to add item");
    }
  };

  const handleDeleteFromList = async (ingredientName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/shopping-list`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: ingredientName }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setAddedItems((prev) => prev.filter((item) => item !== ingredientName));
      alert(`🗑️ Removed ${ingredientName} from shopping list`);
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to remove item");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#111] border border-white/5 p-8 shadow-xl w-full"
    >
      <h2 className="text-4xl font-bold text-[#d4af37] mb-2 font-serif tracking-tight">
        Ingredients
      </h2>
      <p className="text-gray-400 text-sm mb-8 uppercase tracking-wider">
        Click substitute to see alternatives
      </p>

      {ingredients && ingredients.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {ingredients.map((item, index) => {
            const isAdded = addedItems.includes(item.name);

            return (
              <motion.div
                key={`${index}-${item.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-[#0a0a0a] border border-white/5 p-4 hover:border-[#d4af37]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#d4af37]/10 h-full flex flex-col justify-between"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <Image
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain mb-3 rounded group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="font-medium text-white text-base group-hover:text-[#d4af37] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.amount} {item.unit}
                  </p>
                </div>

                <div className="mt-4 flex gap-2 items-center">
                  {isAdded ? (
                    <button
                      onClick={() => handleDeleteFromList(item.name)}
                      className="bg-red-600/20 border border-red-600/50 text-red-400 px-2 py-2 text-xs hover:bg-red-600/30 transition-all w-full flex items-center justify-center gap-1 uppercase tracking-wider"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToList(item.name)}
                      className="bg-green-600/20 border border-green-600/50 text-green-400 px-2 py-2 text-xs hover:bg-green-600/30 transition-all w-full flex items-center justify-center gap-1 uppercase tracking-wider"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  )}

                  <button
                    onClick={() => fetchSubstitutes(item.name)}
                    className={`${loadingIngredient === item.name
                      ? "bg-[#d4af37]/20 cursor-not-allowed"
                      : "bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border-[#d4af37]/50"
                      } border text-[#d4af37] px-2 py-2 text-xs transition-all w-full flex items-center justify-center gap-1 uppercase tracking-wider`}
                    disabled={loadingIngredient === item.name}
                  >
                    {loadingIngredient === item.name ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Loading
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3 h-3" />
                        Sub
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No ingredients available.</p>
      )}

      {selectedIngredient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#0a0a0a] mt-8 p-6 border border-[#d4af37]/30 shadow-lg"
        >
          <h3 className="text-xl font-bold text-[#d4af37] mb-3 font-serif">
            Substitutes for:{" "}
            <span className="text-white">{selectedIngredient}</span>
          </h3>
          {substitutes.length > 0 ? (
            <ul className="space-y-2">
              {substitutes.map((sub, index) => (
                <li key={index} className="text-gray-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>
                  {sub}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-400">{subError}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default IngredientList;
