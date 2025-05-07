"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import FoodList from "../components/FoodList";
import FoodDetail from "./FoodDetail";
import Footer from "../components/footer";
import Header from "../components/header";

const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_Key = "85fd6d7dc9d846749e4897b4817b28f7";

const HomePage = () => {
  const [dish, setDish] = useState("");
  const [foodData, setFoodData] = useState([]);
  const [foodID, setFoodID] = useState("");
  const [query, setQuery] = useState(false);

  async function demo() {
    const res = await fetch(`${URL}?query=${query}&apiKey=${API_Key}`);
    const data = await res.json();
    setFoodData(data.results);
  }

  useEffect(() => {
    if (query) {
      demo();
    }
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with background image */}
      <section
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Header />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="  p-8  max-w-xl w-full text-center space-y-6">
            <h2 className="text-3xl font-bold text-shadow-black">
              Find Delicious Recipes
            </h2>
            <div className="flex items-center gap-4">
            <input
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                type="text"
                className="w-full p-4 border border-amber-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-400"
                placeholder="Search for recipes..."
              />

              <button
                onClick={() => setQuery(dish)}
                className="p-4 bg-amber-400 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with light background */}
      <div className="bg-amber-50">
        <FoodList foodData={foodData} setFoodID={setFoodID} />
        <FoodDetail foodID={foodID} />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
