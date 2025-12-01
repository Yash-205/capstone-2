"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import FoodList from "../../components/FoodList";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/search`;

const diets = [
  "No Diet",
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
];

const DishPage = () => {
  const params = useParams();
  const dish = decodeURIComponent(params.dish);
  const { user } = useAuth();

  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState("");

  // Set selected diet from user's preference on first load
  useEffect(() => {
    if (user?.dietPreference) {
      setSelectedDiet(user.dietPreference);
    }
  }, [user]);

  // Fetch recipes whenever dish or selected diet changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let apiURL = `${URL}?query=${dish}&number=9`;

        if (selectedDiet && selectedDiet !== "No Diet") {
          apiURL += `&diet=${selectedDiet}`;
        }

        const res = await fetch(apiURL);
        const data = await res.json();
        setFoodData(data.results || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dish, selectedDiet]);

  const handleDietSelect = (diet) => {
    setSelectedDiet(diet === selectedDiet ? "" : diet);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/photo2.jpg')`,
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
              RECIPES FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">{dish.toUpperCase()}</span>
            </h1>
            <p className="md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mb-4 border-l-2 border-[#d4af37] pl-6">
              {foodData.length > 0
                ? `Found ${foodData.length} delicious ${foodData.length === 1 ? 'recipe' : 'recipes'} for you to explore.`
                : 'Searching for the perfect recipes...'
              }
            </p>
            {selectedDiet && selectedDiet !== "No Diet" && (
              <p className="md:text-lg text-[#d4af37] font-medium tracking-wide max-w-2xl pl-6">
                Filtered by: {selectedDiet}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Diet Filter */}
      {!user?.dietPreference && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0a0a0a] border-y border-white/5 py-12 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
              <h2 className="text-xl font-bold text-[#d4af37] font-serif tracking-tight uppercase">
                Dietary Preferences
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {diets.map((diet) => (
                <motion.button
                  key={diet}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDietSelect(diet)}
                  className={`px-4 py-3 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${selectedDiet === diet
                      ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30"
                      : "bg-[#111] text-gray-400 border border-white/10 hover:border-[#d4af37]/50 hover:text-[#d4af37]"
                    }`}
                >
                  {diet}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Recipe List */}
      <section className="w-full bg-[#0a0a0a] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center mb-16 md:mb-24"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#d4af37] uppercase tracking-[0.3em] text-sm font-medium mb-4 section-header-line"
            >
              Search Results
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white text-center font-serif tracking-tight leading-tight"
            >
              Discover Recipes
            </motion.h2>
          </motion.div>
          <FoodList foodData={foodData} />
        </div>
      </section>
    </div>
  );
};

export default DishPage;
