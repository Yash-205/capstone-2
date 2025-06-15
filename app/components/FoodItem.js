import Link from 'next/link';
import Image from 'next/image';

const FoodItem = ({ food }) => {
  return (
    <div className="group flex flex-col bg-white border-l-8 border-amber-400 p-4 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-amber-500/90 hover:scale-111">
      <Image
        src={food.image}
        alt={food.title}
        width={312}
        height={231}
        className="rounded-md object-cover w-full h-48 mb-4 transform transition-all duration-300 gropu-hover:scale-105 group-hover:shadow-md"
      />

      <h1 className="ml-5 mt-4 text-lg md:text-xl font-semibold text-amber-800 mb-3 line-clamp-2 group-hover:text-amber-600 transition-all duration-300">
        {food.title}
      </h1>

      <div className="mt-auto">
        <Link href={`/recipie/${food.id}`}>
          <button className="w-full px-4 py-2 bg-amber-500 text-white font-medium rounded-md transition-all duration-300 hover:bg-amber-400  hover:scale-105">
            View Recipe
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FoodItem;
