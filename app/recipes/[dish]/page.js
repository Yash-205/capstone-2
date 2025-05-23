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

    if (dish) fetchData();
  }, [dish]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with background image and dish name card */}
      <section
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative"
        style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.01)), url('/chicken-larb-plate-with-dried-chilies-tomatoes-spring-onions-lettuce.jpg')`,
        }}
        >

        <div className="flex-grow flex items-center justify-center px-4">
          <div className="p-4 max-w-xl w-full text-center  bg-black/20 rounded-xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-4 drop-shadow-lg max-w-3xl">
           Recipes for {dish}
          </h1>
          </div>
        </div>
      </section>

      {/* Recipe List Section */}
      <div className="bg-amber-50 pb-10">
        <FoodList foodData={foodData} setFoodID={setFoodID} />
      </div>
    </div>
  );
};

export default DishPage;


