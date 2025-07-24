"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FoodList from "../../components/FoodList";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_Key = "cabd2858df4e41159380a077065b6b27";

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

  // 1️⃣ Set selected diet from user's preference on first load
  useEffect(() => {
    if (user?.dietPreference) {
      setSelectedDiet(user.dietPreference);
    }
  }, [user]);

  // 2️⃣ Fetch recipes whenever dish or selected diet changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let apiURL = `${URL}?query=${dish}&number=9&apiKey=${API_Key}`;

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
    setSelectedDiet(diet === selectedDiet ? "" : diet); // toggle logic
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🥘 Hero Section */}
      <section
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.01)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')`,
        }}
      >
        <div className="flex-grow flex flex-col items-center justify-center px-4">
          <div className="p-4 max-w-xl w-full text-center bg-black/20 rounded-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Recipes for {dish}
            </h1>

            {selectedDiet && selectedDiet !== "No Diet" && (
              <p className="text-white mt-2 text-lg">
                Showing recipes for:{" "}
                <span className="font-semibold">{selectedDiet}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 🧃 Diet Filter (only shown if user has no saved preference) */}
      {!user?.dietPreference && (
        <div className="bg-amber-50 py-6 px-4">
          <h2 className="text-xl font-semibold text-amber-700 mb-3">Diets:</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {diets.map((diet) => (
              <button
                key={diet}
                onClick={() => handleDietSelect(diet)}
                className={`whitespace-nowrap px-5 py-2 rounded-full border-2 text-sm font-medium transition 
                  ${
                    selectedDiet === diet
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
                  }`}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🥗 Recipe List */}
      <div className="bg-amber-50 py-10 px-4">
        <FoodList foodData={foodData} />
      </div>
    </div>
  );
};

export default DishPage;
