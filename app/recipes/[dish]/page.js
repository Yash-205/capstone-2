"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FoodList from "../../components/FoodList";
import FoodDetail from "../../components/FoodDetail";

const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_Key = "85fd6d7dc9d846749e4897b4817b28f7";

const DishPage = () => {
  const params = useParams();
  const dish = decodeURIComponent(params.dish);
  const [foodData, setFoodData] = useState([]);
  const [foodID, setFoodID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${URL}?query=${dish}&number=9&apiKey=${API_Key}`);
        const data = await res.json();
        setFoodData(data.results);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    // if (dish) fetchData();
  }, [dish]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with background image and dish name card */}
      <section
        className="min-h-screen flex flex-col bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')",
        }}
      >

        <div className="flex-grow flex items-center justify-center px-4">
          <div className="p-4 max-w-xl w-full text-center space-y-6 bg-white/10  rounded-xl">
            <h2 className="text-3xl font-bold text-shadow-black">
              Recipes for {dish}
            </h2>
          </div>
        </div>
      </section>

      {/* Recipe List Section */}
      <div className="bg-amber-50 pb-10">
        <FoodList foodData={foodData} setFoodID={setFoodID} />
        <FoodDetail foodID={foodID} />
      </div>
    </div>
  );
};

export default DishPage;


