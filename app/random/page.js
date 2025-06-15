'use client';

import React, { useEffect, useState } from 'react';
import FoodDetail from '../components/FoodDetail'; // adjust if needed
import Loader from '../components/Loader'; // import your full-page loader

const API_Key = "e98e8939d2144d3b85d71bf592bc4a61";

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  if (loading || !randomID) {
    return <Loader />;
  }

  return <FoodDetail foodID={randomID} />;
};

export default RandomRecipePage;
