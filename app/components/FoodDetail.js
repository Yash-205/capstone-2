"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Users, Leaf, Sprout, DollarSign, Heart, Target } from "lucide-react";
import IngredientList from "./IngredientList";
import Loader from "./Loader";
import CommentBox from "./CommentBox";

const FoodDetail = ({ foodID }) => {
  const [food, setFood] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${foodID}?includeNutrition=true`
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setFood(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (foodID) fetchRecipe();
  }, [foodID]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-red-500 text-center text-xl">{error}</div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      {/* Hero Section */}
      {food.image && (
        <section
          className="min-h-screen flex flex-col justify-center bg-cover bg-center relative"
          style={{
            backgroundImage: `url('${food.image}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30"></div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter font-serif mb-6 leading-none">
                {food.title}
              </h1>
              {food.summary && (
                <p
                  className="md:text-xl text-gray-300 font-light tracking-wide max-w-2xl border-l-2 border-[#d4af37] pl-6"
                  dangerouslySetInnerHTML={{
                    __html: food.summary.split('.')[0] + '.'
                  }}
                />
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <div className="w-full max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* Summary */}
        {food.summary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#111] p-8 border border-white/5 shadow-xl"
          >
            <h2 className="text-4xl font-bold text-[#d4af37] mb-6 font-serif tracking-tight">
              Description
            </h2>
            <div
              className="text-gray-300 text-lg leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: food.summary }}
            />
          </motion.div>
        )}

        {/* Add to Favorites Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onClick={async () => {
            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    id: food.id,
                    title: food.title,
                    image: food.image,
                  }),
                }
              );
              const data = await res.json();
              if (!res.ok) throw new Error(data.msg || "Failed");
              alert("❤️ Added to favorites!");
            } catch (err) {
              alert("❌ " + err.message);
            }
          }}
          className="w-full md:w-auto px-8 py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5" />
          Add to Favorites
        </motion.button>

        {/* Log Meal Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={async () => {
            try {
              // Extract nutrition data from the recipe
              const nutrition = food.nutrition?.nutrients || [];
              const calories = nutrition.find(n => n.name === "Calories")?.amount || 0;
              const protein = nutrition.find(n => n.name === "Protein")?.amount || 0;
              const carbs = nutrition.find(n => n.name === "Carbohydrates")?.amount || 0;
              const fat = nutrition.find(n => n.name === "Fat")?.amount || 0;

              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/meals`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    recipeId: food.id,
                    recipeName: food.title,
                    recipeImage: food.image,
                    calories: Math.round(calories),
                    protein: Math.round(protein),
                    carbs: Math.round(carbs),
                    fat: Math.round(fat),
                    mealType: 'snack' // Default to snack, user can categorize later
                  }),
                }
              );
              const data = await res.json();
              if (!res.ok) throw new Error(data.msg || "Failed");
              alert("✅ Meal logged! Check your dashboard to see your progress.");
            } catch (err) {
              alert("❌ " + err.message);
            }
          }}
          className="w-full md:w-auto px-8 py-4 bg-[#d4af37] text-black hover:bg-[#f1c40f] transition-all duration-300 uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-2"
        >
          <Target className="w-5 h-5" />
          Log Meal
        </motion.button>

        {/* Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`grid gap-6 ${food.vegan
            ? "grid-cols-2 md:grid-cols-4"
            : "grid-cols-2 md:grid-cols-3"
            }`}
        >
          <div className="bg-[#111] border border-white/5 shadow-xl p-6 text-center">
            <Clock className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
            <div className="text-[#d4af37] font-bold text-lg">{food.readyInMinutes}</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Minutes</div>
          </div>
          <div className="bg-[#111] border border-white/5 shadow-xl p-6 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
            <div className="text-[#d4af37] font-bold text-lg">{food.servings}</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Servings</div>
          </div>
          <div className="bg-[#111] border border-white/5 shadow-xl p-6 text-center">
            <Leaf className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
            <div className="text-[#d4af37] font-bold text-sm uppercase tracking-wider">
              {food.vegetarian ? "Vegetarian" : "Non-Veg"}
            </div>
          </div>
          {food.vegan && (
            <div className="bg-[#111] border border-white/5 shadow-xl p-6 text-center">
              <Sprout className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
              <div className="text-[#d4af37] font-bold text-sm uppercase tracking-wider">
                Vegan
              </div>
            </div>
          )}
        </motion.div>

        {/* Price Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#111] border border-white/5 p-6 shadow-xl flex items-center gap-4"
        >
          <DollarSign className="w-8 h-8 text-[#d4af37]" />
          <div>
            <span className="text-gray-400 text-sm uppercase tracking-wider block">Price per serving</span>
            {food.pricePerServing ? (
              <span className="text-[#d4af37] text-2xl font-bold">
                ${(food.pricePerServing / 100).toFixed(2)}
              </span>
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        </motion.div>

        {/* Ingredients */}
        {food.extendedIngredients && (
          <IngredientList ingredients={food.extendedIngredients} />
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#111] p-8 border border-white/5 shadow-xl"
        >
          <h2 className="text-4xl font-bold text-[#d4af37] mb-8 font-serif tracking-tight">
            Instructions
          </h2>
          {food.analyzedInstructions?.[0]?.steps?.length > 0 ? (
            <div className="space-y-6">
              {food.analyzedInstructions[0].steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 bg-[#0a0a0a] border-l-2 border-[#d4af37] relative"
                >
                  <div className="absolute -left-8 top-6 w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center text-black font-bold">
                    {i + 1}
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed ml-8">
                    {step.step}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No instructions available.</p>
          )}
        </motion.div>

        <CommentBox foodID={foodID} />
      </div>
    </div>
  );
};

export default FoodDetail;
