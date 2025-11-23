'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import FoodList from '../components/FoodList';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

export default function Home() {
  const [dish, setDish] = useState('');
  const [recipes, setRecipes] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    dessert: [],
  });
  const [scrollingDown, setScrollingDown] = useState(true);
  const router = useRouter();

  // Track scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollingDown(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      const categories = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
      const newRecipes = { ...recipes };

      try {
        // Fetch by type
        for (const category of categories) {
          const res = await fetch(
            `https://api.spoonacular.com/recipes/random?number=6&tags=${category}&apiKey=${API_KEY}`
          );
          const data = await res.json();
          if (data.recipes) {
            newRecipes[category] = data.recipes;
          }
        }

        setRecipes(newRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = () => {
    if (dish.trim()) {
      router.push(`/recipes/${encodeURIComponent(dish.trim())}`);
    }
  };

  const sections = [
    { title: 'Start Your Day', category: 'breakfast', subtitle: 'Breakfast Delights' },
    { title: 'Midday Fuel', category: 'lunch', subtitle: 'Lunch Favorites' },
    { title: 'Evening Feast', category: 'dinner', subtitle: 'Dinner Specialties' },
    { title: 'Quick Bites', category: 'snack', subtitle: 'Tasty Snacks' },
    { title: 'Sweet Endings', category: 'dessert', subtitle: 'Decadent Desserts' },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      
      <section
        className="min-h-screen flex flex-col justify-center bg-cover bg-center w-full relative"
        style={{
          backgroundImage:
            "url('/photo2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-4xl animate-fade-in-up">
            <h2 className="text-7xl md:text-8xl font-bold text-white tracking-tighter font-serif mb-6 leading-none">
              CULINARY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">EXCELLENCE</span>
            </h2>
            <p className="md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mb-12 border-l-2 border-[#d4af37] pl-6">
              Discover the art of cooking with our curated collection of exquisite recipes for the modern epicurean.
            </p>
            
            <div className="flex items-center gap-0 w-full max-w-2xl bg-[#0a0a0a] border border-[#d4af37] p-2 shadow-[0_0_50px_rgba(212,175,55,0.15)] transition-all duration-300 hover:shadow-[0_0_70px_rgba(212,175,55,0.25)] transform hover:-translate-y-1">
              <input
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                type="text"
                placeholder="Search for recipes..."
                className="flex-grow bg-transparent text-white placeholder-gray-500 focus:outline-none text-xl px-6 py-4 font-light tracking-wide"
              />
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-[#d4af37] text-black font-bold tracking-widest hover:bg-[#f1c40f] transition-all duration-300 uppercase text-sm"
              >
                SEARCH
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full bg-[#0a0a0a] pb-24">
        {sections.map((section, index) => (
          <section key={section.category} className={`py-16 md:py-24 ${index % 2 === 0 ? 'bg-[#0a0a0a]' : 'bg-[#111]'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center mb-16">
                <div className="flex items-center justify-center w-full mb-4">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-100px" }}
                    variants={{
                      hidden: { width: "50%" },
                      visible: { width: "100px", transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    className="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#d4af37]"
                  />
                  <motion.span
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-100px" }}
                    variants={{
                      hidden: { opacity: 0, scaleX: 0 },
                      visible: { opacity: 1, scaleX: 1, transition: { duration: 0.5, delay: 0.3 } }
                    }}
                    className="text-[#d4af37] uppercase tracking-[0.3em] text-sm font-medium mx-5 whitespace-nowrap"
                  >
                    {section.subtitle}
                  </motion.span>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-100px" }}
                    variants={{
                      hidden: { width: "50%" },
                      visible: { width: "100px", transition: { duration: 0.6, ease: "easeOut" } }
                    }}
                    className="h-[1px] bg-gradient-to-r from-[#d4af37] via-[#d4af37] to-transparent"
                  />
                </div>
                <motion.h2 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: "-100px" }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } }
                  }}
                  className="text-4xl md:text-5xl font-bold text-white text-center font-serif tracking-tight leading-tight"
                >
                  {section.title}
                </motion.h2>
              </div>
              <FoodList foodData={recipes[section.category]} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
