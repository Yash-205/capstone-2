'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../public/loader-animation.json';

const triviaList = [
  "Peaches are the third most popular fruit grown in America.",
  "A cluster of bananas is called a ‘hand’. A single banana is called a ‘finger’.",
  "The largest item on any menu in the world is the roast camel.",
  "Turnips are high in fibre, Vitamin C, Calcium and Potassium.",
  "There are more than 600 pasta shapes produced worldwide.",
  "Eating a lot of beetroot turns your pee into a pink colour.",
  "Coconut water can be used as blood plasma.",
  "The world’s most expensive chocolate costs $2600 per kilogram.",
  "One of the most popular pizza toppings in Brazil is green peas.",
  "Radishes are members of the same family as cabbages.",
  "Onion is Latin for ‘large pearl’."
];

const Loader = () => {
  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * triviaList.length);
    setRandomFact(triviaList[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 px-4 text-center">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-80 lg:h-80"
      />
      <p className="mt-6 text-lg sm:text-xl text-amber-800 max-w-lg font-medium">
        {randomFact}
      </p>
    </div>
  );
};

export default Loader;
