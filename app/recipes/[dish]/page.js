"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FoodList from "../../components/FoodList";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_Key = "e98e8939d2144d3b85d71bf592bc4a61";

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

  const fetchData = async (dietParam = "") => {
    try {
      setLoading(true);
      let apiURL = `${URL}?query=${dish}&number=9&apiKey=${API_Key}`;

      const diet = user?.dietPreference || dietParam;
      if (diet && diet !== "No Diet") {
        apiURL += `&diet=${diet}`;
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

  useEffect(() => {
    fetchData(selectedDiet);
  }, [dish, user, selectedDiet]);

  const handleDietSelect = (diet) => {
    setSelectedDiet(diet === selectedDiet ? "" : diet); // Toggle
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
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

            {user?.dietPreference && (
              <p className="text-white mt-2 text-lg">
                Showing recipes for your diet preference:{" "}
                <span className="font-semibold">{user.dietPreference}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Diet Filter Strip for Guests */}
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

      {/* Recipe List Section */}
      <div className="bg-amber-50 py-10 px-4">
        <FoodList foodData={foodData} />
      </div>
    </div>
  );
};

export default DishPage;
