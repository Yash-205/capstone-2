"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const FoodDetail = ({ foodID }) => {
  const [food, setFood] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);
  const [subError, setSubError] = useState("");

  const url = `https://api.spoonacular.com/recipes/${foodID}/information`;
  const API_Key = "85fd6d7dc9d846749e4897b4817b28f7";

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setIsLoading(true);
        const res = await fetch(`${url}?apiKey=${API_Key}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setFood(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to load recipe details.");
        setIsLoading(false);
      }
    }

    if (foodID) {
      fetchRecipe();
    }
  }, [foodID, url]);

  const fetchSubstitutes = async (ingredientName) => {
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
    }
  };

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : (
        <>
          {food.image && (
            <section
              className="min-h-screen flex items-center justify-center bg-cover bg-center relative text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('${food.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg max-w-3xl">
                {food.title}
              </h1>
            </section>
          )}

          <div className="max-w-4xl mx-auto p-6">
            {/* Meta Info */}
            <div className="flex justify-between flex-wrap gap-2 items-center text-sm text-gray-600 mb-4">
              <span className="flex items-center">🧑‍🍳 <strong className="ml-1">{food.readyInMinutes} Minutes</strong></span>
              <span className="flex items-center">🍽️ Serves: <strong className="ml-1">{food.servings}</strong></span>
              <span className="flex items-center">{food.vegetarian ? "🥗 Vegetarian" : "🍗 Non-Vegetarian"}</span>
              {food.vegan && <span className="flex items-center">🌱 Vegan</span>}
            </div>

            {/* Price */}
            <div className="text-lg text-gray-800 mb-6">
              <span className="font-semibold">Price:</span>{" "}
              {food.pricePerServing ? `$${(food.pricePerServing / 100).toFixed(2)} Per Serving` : "N/A"}
            </div>

            {/* Ingredients Section */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-inner mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ingredients (Click to find substitutes)</h2>
              {food.extendedIngredients && food.extendedIngredients.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {food.extendedIngredients.map((item,index) => (
                    <div
                      key={`${index}-${item.id}`}
                      onClick={() => fetchSubstitutes(item.name)}
                      className="cursor-pointer bg-white rounded-lg p-4 shadow-sm flex flex-col items-center text-center hover:shadow-md transition"
                    >
                      <Image
                        src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-20 w-20 object-contain mb-2 rounded"
                      />
                      <h3 className="font-medium text-gray-700">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.amount} {item.unit}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No ingredients available.</p>
              )}

              {/* Substitutes Section */}
              {selectedIngredient && (
                <div className="bg-white p-4 mt-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Substitutes for: <span className="text-blue-600">{selectedIngredient}</span>
                  </h3>
                  {substitutes.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-700">
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

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Instructions</h2>
              {food.analyzedInstructions && food.analyzedInstructions.length > 0 && food.analyzedInstructions[0].steps.length > 0 ? (
                food.analyzedInstructions[0].steps.map((step, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg shadow-sm mb-3">
                    <span className="text-gray-700">{i + 1}. {step.step}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No instructions available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FoodDetail;
