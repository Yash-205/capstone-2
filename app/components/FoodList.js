import React from 'react';
import FoodItem from './FoodItem';

const FoodList = ({ foodData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-10 bg-amber-50 min-h-screen">
      {foodData.map((food) => (
        <FoodItem key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodList;
