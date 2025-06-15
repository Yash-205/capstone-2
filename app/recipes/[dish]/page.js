"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FoodList from "../../components/FoodList";
import Loader from "../../components/Loader";

const URL = "https://api.spoonacular.com/recipes/complexSearch";
const API_Key = "cabd2858df4e41159380a077065b6b27";

const DishPage = () => {
  const params = useParams();
  const dish = decodeURIComponent(params.dish);
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${URL}?query=${dish}&number=9&apiKey=${API_Key}`);
        const data = await res.json();
        setFoodData(data.results || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dish) fetchData();
  }, [dish]);

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
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="p-4 max-w-xl w-full text-center bg-black/20 rounded-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              Recipes for {dish}
            </h1>
          </div>
        </div>
      </section>

      {/* Recipe List Section */}
      <div className="bg-amber-50 pb-10 min-h-screen flex items-center justify-center">
        <FoodList foodData={foodData} />
      </div>
    </div>
  );
};

export default DishPage;
