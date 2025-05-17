import React from 'react'
import FoodItem from './FoodItem'

const FoodList = ({ foodData,setFoodID }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {foodData.map((food, i) => {
        return <FoodItem key={food.id} food={food} setFoodID={setFoodID}/>
      })}
    </div>
  )
}

export default FoodList
