import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const FoodItem = ({ food, index = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col bg-[#111] border border-white/5 p-0 rounded-none shadow-xl transition-all duration-500 hover:shadow-[#d4af37]/20 hover:-translate-y-2"
    >
      <div className="relative overflow-hidden">
        <Image
          src={food.image}
          alt={food.title}
          width={312}
          height={231}
          className="object-cover w-full h-64 transform transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h1 className="text-xl font-serif text-white mb-4 line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300 tracking-wide">
          {food.title}
        </h1>

        <div className="mt-auto pt-6 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <Link href={`/recipie/${food.id}`}>
            <button className="w-full py-3 bg-transparent border border-white/20 text-gray-300 text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all duration-300">
              View Recipe
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodItem;
