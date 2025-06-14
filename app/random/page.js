'use client';

import React, { useEffect, useState } from 'react';
import FoodDetail from '../components/FoodDetail'; // adjust if path differs

const API_Key = "85fd6d7dc9d846749e4897b4817b28f7";

const RandomRecipePage = () => {
  const [randomID, setRandomID] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandomRecipe = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/random?number=1&apiKey=${API_Key}`
      );
      const data = await res.json();
      setRandomID(data.recipes[0].id);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  if (loading || !randomID) {
    return <div className="text-center text-amber-600 p-6">Loading random recipe...</div>;
  }

  return <FoodDetail foodID={randomID} />;
};

export default RandomRecipePage;
