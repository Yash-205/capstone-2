"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import the Next.js Image component

const FoodDetail = ({ foodID }) => {
    const [food, setFood] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = `https://api.spoonacular.com/recipes/${foodID}/information`;
    const API_Key = "85fd6d7dc9d846749e4897b4817b28f7";

    async function fetchRecipe() {
        try {
            const res = await fetch(`${url}?apiKey=${API_Key}`);
            
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await res.json();
            console.log(data); // Log the response to see if it's being fetched properly
            setFood(data);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setError("Failed to load recipe details.");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (foodID) {
            fetchRecipe();
        }
    }, [foodID]);

    if (error) {
        return <div className="text-red-600 text-center">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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

                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span className="flex items-center">
                            🧑‍🍳 <strong className="ml-1">{food.readyInMinutes} Minutes</strong>
                        </span>
                        <span className="flex items-center">
                            🍽️ Serves: <strong className="ml-1">{food.servings}</strong>
                        </span>
                        <span className="flex items-center">
                            {food.vegetarian ? "🥗 Vegetarian" : "🍗 Non-Vegetarian"}
                        </span>
                        <span className="flex items-center">
                            {food.vegan ? "🐮 Vegan" : ""}
                        </span>
                    </div>

                    <div className="text-lg text-gray-800">
                        <span className="font-semibold">Price:</span> 
                        {food.pricePerServing ? `$${(food.pricePerServing / 100).toFixed(2)} Per Serving` : "N/A"}
                    </div>

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
