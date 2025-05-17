"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const FoodDetail = ({ foodID }) => {
    const [food, setFood] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = `https://api.spoonacular.com/recipes/${foodID}/information`;
    const API_Key = "85fd6d7dc9d846749e4897b4817b28f7";

    useEffect(() => {
        async function fetchRecipe() {
            try {
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
        return <div className="text-red-600 text-center">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg pb-4">
            {foodID && (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800">{food.title}</h1>

                    {/* Food Image */}
                    <div className="flex justify-center">
                        <Image
                            src={food.image || "/placeholder-image.jpg"}
                            alt="Food"
                            width={500}
                            height={500}
                            className="rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Meta Info */}
                    <div className="flex justify-between flex-wrap gap-2 items-center text-sm text-gray-600">
                        <span className="flex items-center">
                            🧑‍🍳 <strong className="ml-1">{food.readyInMinutes} Minutes</strong>
                        </span>
                        <span className="flex items-center">
                            🍽️ Serves: <strong className="ml-1">{food.servings}</strong>
                        </span>
                        <span className="flex items-center">
                            {food.vegetarian ? "🥗 Vegetarian" : "🍗 Non-Vegetarian"}
                        </span>
                        {food.vegan && (
                            <span className="flex items-center">
                                🌱 Vegan
                            </span>
                        )}
                    </div>

                    {/* Price */}
                    <div className="text-lg text-gray-800">
                        <span className="font-semibold">Price:</span>{" "}
                        {food.pricePerServing ? `$${(food.pricePerServing / 100).toFixed(2)} Per Serving` : "N/A"}
                    </div>

                    {/* Ingredients Section */}
                    <div className="bg-amber-50 p-6 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ingredients</h2>
                        {isLoading ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {food.extendedIngredients?.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
                                        <Image
                                            src={`https://spoonacular.com/cdn/ingredients_100x100/${item.image}`}
                                            alt={item.name}
                                            width={80}
                                            height={80}
                                            className="object-contain mb-2 rounded"
                                            />

                                        <h3 className="font-medium text-gray-700">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.amount} {item.unit}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Instructions</h2>
                        <div className="mt-3 space-y-2">
                            {isLoading ? (
                                <p className="text-center text-gray-500">Loading...</p>
                            ) : (
                                food.analyzedInstructions && food.analyzedInstructions.length > 0 ? (
                                    food.analyzedInstructions[0]?.steps.map((step, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                                            <span className="text-gray-700">{i + 1}. {step.step}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No instructions available</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodDetail;
