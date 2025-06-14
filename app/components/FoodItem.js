import Link from 'next/link';
import Image from 'next/image';

const FoodItem = ({ food }) => {
  return (
    <div className="group bg-white border-b-8 border-amber-400 p-4 rounded-xl shadow-2xl transition-all duration-300 hover:scale-111">
      <Image
        src={food.image}
        alt={food.title}
        width={312}
        height={231}
        className="rounded-md object-cover w-full h-48 mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-amber-500/50"
      />

      <h1 className="text-lg md:text-xl font-semibold text-amber-800 mb-3 line-clamp-2 group-hover:text-amber-700/90 transition-all duration-300 scale-111">
        {food.title}
      </h1>

      <Link href={`/recipie/${food.id}`}>
        <button className="w-full px-4 py-2 bg-amber-500 text-white font-medium rounded-md transition-all duration-300 group-hover:bg-amber-400 group-hover:scale-110">
          View Recipe
        </button>
      </Link>
    </div>
  );
};

export default FoodItem;
