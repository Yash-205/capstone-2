import React from 'react';
import FoodItem from './FoodItem';

const FoodList = ({ foodData }) => {
  if (!foodData.length) {
    return (
      <div className="text-center py-10 text-amber-700 font-semibold text-lg">
        No recipes found.
      </div>
    );
  }

  return (
    <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {foodData.map((food) => (
        <FoodItem key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodList;
