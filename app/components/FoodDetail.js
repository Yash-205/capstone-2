"use client";

import React, { useEffect, useState } from 'react';
import IngredientList from './IngredientList';

const FoodDetail = ({ foodID }) => {
  const [food, setFood] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (error) {
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  }

  return (
    <div className="w-full bg-amber-50/50 min-h-screen">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center text-amber-700">
          Loading...
        </div>
      ) : (
        <>
          {/* 🖼️ Hero Section */}
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

          {/* Content Section */}
          <div className="w-full px-6 py-10 space-y-10 bg-amber-50/10">
            {/* 📊 Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-amber-800">
              <div className="bg-white shadow p-4 rounded border-l-4 border-amber-600 font-medium">
                🧑‍🍳 {food.readyInMinutes} Minutes
              </div>
              <div className="bg-white shadow p-4 rounded border-l-4 border-amber-600 font-medium">
                🍽️ Serves: {food.servings}
              </div>
              <div className="bg-white shadow p-4 rounded border-l-4 border-amber-600 font-medium">
                {food.vegetarian ? "🥗 Vegetarian" : "🍗 Non-Vegetarian"}
              </div>
              {food.vegan && (
                <div className="bg-white shadow p-4 rounded border-l-4 border-amber-600 font-medium">
                  🌱 Vegan
                </div>
              )}
            </div>

            {/* 💲 Price */}
            <div className="text-lg text-amber-800 bg-white border-l-4 border-amber-600 p-4 rounded shadow">
              <span className="font-semibold">Price:</span>{" "}
              {food.pricePerServing ? (
                <span>${(food.pricePerServing / 100).toFixed(2)} per serving</span>
              ) : (
                "N/A"
              )}
            </div>

            {/* 🍳 Ingredients List */}
              <IngredientList ingredients={food.extendedIngredients} />

            {/* 📝 Instructions */}
            <div className="bg-amber-50 p-6 rounded-lg shadow w-full border-l-4 border-amber-600">
              <h2 className="text-3xl font-semibold text-amber-800 mb-4">Instructions</h2>
              {food.analyzedInstructions?.[0]?.steps?.length > 0 ? (
                <div className="space-y-3">
                  {food.analyzedInstructions[0].steps.map((step, i) => (
                    <div key={i} className="p-4 bg-white border-l-4 border-amber-400 rounded">
                      <span className="text-amber-600 font-medium">
                        Step {i + 1} :  
                        <span className="text-amber-800 font-medium">
                           &nbsp;{step.step}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-amber-600">No instructions available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FoodDetail;
