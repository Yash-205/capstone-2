"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API_Key = "cabd2858df4e41159380a077065b6b27";

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
        const res = await fetch("https://capstone-2-3-hmts.onrender.com/api/shopping-list", {
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
        `https://api.spoonacular.com/food/ingredients/substitutes?ingredientName=${ingredientName}&apiKey=${API_Key}`
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
      const res = await fetch("https://capstone-2-3-hmts.onrender.com/api/shopping-list", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: ingredientName }),
      });

      if (!res.ok) throw new Error("Add failed");

      setAddedItems((prev) => [...prev, ingredientName]);
    } catch (err) {
      console.error("Add error", err);
      alert("Failed to add item");
    }
  };

  const handleDeleteFromList = async (ingredientName) => {
    try {
      const res = await fetch("https://capstone-2-3-hmts.onrender.com/api/shopping-list", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: ingredientName }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setAddedItems((prev) => prev.filter((item) => item !== ingredientName));
    } catch (err) {
      console.error("Delete error", err);
      alert("Failed to remove item");
    }
  };

  return (
    <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-3xl font-semibold text-amber-800 mb-4">
        Ingredients{" "}
        <span className="text-sm text-amber-600">
          (Click Substitute to see alternatives)
        </span>
      </h2>

      {ingredients && ingredients.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {ingredients.map((item, index) => {
            const isAdded = addedItems.includes(item.name);

            return (
              <div
                key={`${index}-${item.id}`}
                className="group bg-white shadow-sm border-l-4 border-amber-400 rounded-lg p-4 hover:shadow-lg hover:shadow-amber-400 transition-transform hover:scale-105 duration-300 h-full flex flex-col justify-between"
              >
                <div className="flex flex-col items-center text-center h-full">
                  <Image
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain mb-2 rounded group-hover:scale-125 transition-transform duration-300"
                  />
                  <h3 className="font-medium text-amber-700 text-base md:text-lg group-hover:text-amber-500">
                    {item.name}
                  </h3>
                  <p className="text-sm text-amber-600 group-hover:text-amber-400">
                    {item.amount} {item.unit}
                  </p>
                </div>

                <div className="mt-4 flex gap-2 items-center">
                  {isAdded ? (
                    <button
                      onClick={() => handleDeleteFromList(item.name)}
                      className="bg-red-500 text-white px-1 py-1 rounded text-sm hover:bg-red-600 shadow w-full"
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToList(item.name)}
                      className="bg-green-500 text-white px-1 py-1 rounded text-sm hover:bg-green-600 shadow w-full"
                    >
                      Add
                    </button>
                  )}

                  <button
                    onClick={() => fetchSubstitutes(item.name)}
                    className={`${
                      loadingIngredient === item.name
                        ? "bg-amber-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    } text-white px-1 py-1 rounded text-sm shadow w-full flex items-center justify-center gap-1`}
                    disabled={loadingIngredient === item.name}
                  >
                    {loadingIngredient === item.name ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Substitute"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-amber-600">No ingredients available.</p>
      )}

      {selectedIngredient && (
        <div className="bg-white mt-6 p-4 rounded-lg border-l-4 border-amber-500 shadow-inner">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Substitutes for:{" "}
            <span className="text-amber-600">{selectedIngredient}</span>
          </h3>
          {substitutes.length > 0 ? (
            <ul className="list-disc list-inside text-amber-700">
              {substitutes.map((sub, index) => (
                <li key={index}>{sub}</li>
              ))}
            </ul>
          ) : (
            <p className="text-red-500">{subError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default IngredientList;
