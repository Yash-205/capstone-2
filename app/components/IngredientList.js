"use client";

import React, { useState } from "react";
import Image from "next/image";

const API_Key = "e98e8939d2144d3b85d71bf592bc4a61";

const IngredientList = ({ ingredients }) => {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);
  const [subError, setSubError] = useState("");

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

  return (
    <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-3xl font-semibold text-amber-800 mb-4">
        Ingredients{" "}
        <span className="text-sm text-amber-600">(Tap for substitutes)</span>
      </h2>

      {ingredients && ingredients.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {ingredients.map((item, index) => (
            <div
              key={`${index}-${item.id}`}
              onClick={() => fetchSubstitutes(item.name)}
              className="group cursor-pointer bg-white shadow-sm border-l-4 border-amber-400 rounded-lg p-4 shadow hover:shadow-lg hover:shadow-amber-400 transition-transform hover:scale-105 duration-300 h-full flex flex-col justify-between"
            >
              <div className="flex flex-col items-center text-center h-full">
                <Image
                  src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain mb-2 rounded group-hover:scale-125 transition-transform duration-300"
                />
                <h3 className="font-medium text-amber-700 text-base md:text-lg group-hover:text-amber-500">
                  {item.name}
                </h3>
                <p className="text-sm text-amber-600 group-hover:text-amber-400">
                  {item.amount} {item.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-amber-600">No ingredients available.</p>
      )}

      {selectedIngredient && (
        <div className="bg-white mt-6 p-4 rounded-lg border-l-4 border-amber-500 shadow-inner">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Substitutes for :{" "}
            <span className="text-amber-600">{selectedIngredient}</span>
          </h3>
          {substitutes.length > 0 ? (
            <ul className="list-disc list-inside text-amber-700">
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
  );
};

export default IngredientList;
