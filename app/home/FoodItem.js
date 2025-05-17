import Image from 'next/image';

const FoodItem = ({ food, setFoodID }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <Image 
        src={food.image}
        alt={food.title}
        width={312}  
        height={231} 
        className="object-cover rounded-lg mb-4"
      />
      <h1 className="text-xl font-semibold text-amber-800 mb-2">{food.title}</h1>
      <button
        onClick={() => setFoodID(food.id)} // works as scrollToDetail
        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
      >
        View Recipe
      </button>
    </div>
  );
};

export default FoodItem;
