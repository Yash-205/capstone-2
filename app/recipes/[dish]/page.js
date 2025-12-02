"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import FoodList from "../../components/FoodList";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/search`;

const diets = [
  "Omnivore",      // Default - no dietary restrictions
  "Vegetarian",    // No meat
  "Vegan",         // No animal products
];

const DishPage = () => {
  const params = useParams();
  const dish = decodeURIComponent(params.dish);
  const { user } = useAuth();

  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [dishType, setDishType] = useState("");
  const [maxCookingTime, setMaxCookingTime] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Set selected diet from user's preference on first load
  useEffect(() => {
    if (user?.dietPreference) {
      setSelectedDiet(user.dietPreference);
    }
  }, [user]);

  // Fetch recipes whenever dish, selected diet, filters, or page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let apiURL = `${URL}?query=${dish}&page=${currentPage}&limit=6`;

        if (selectedDiet && selectedDiet !== '') {
          apiURL += `&diet=${selectedDiet}`;
        }

        // Add backend filters
        if (cuisine && cuisine !== '') {
          apiURL += `&cuisine=${cuisine}`;
        }
        if (dishType && dishType !== '') {
          apiURL += `&type=${dishType}`;
        }
        if (maxCookingTime && maxCookingTime !== '') {
          apiURL += `&maxReadyTime=${maxCookingTime}`;
        }
        if (sortBy && sortBy !== '') {
          apiURL += `&sortBy=${sortBy}`;
        }

        const res = await fetch(apiURL);
        const data = await res.json();
        setFoodData(data.results || []);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalResults || 0);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dish, selectedDiet, cuisine, dishType, maxCookingTime, sortBy, currentPage]);

  const handleDietSelect = (diet) => {
    // Convert "Omnivore" to empty string for backend compatibility
    const dietValue = diet === "Omnivore" ? "" : diet;
    setSelectedDiet(dietValue === selectedDiet ? "" : dietValue);
    setCurrentPage(1); // Reset to page 1 when diet changes
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col justify-center bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/photo2.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter font-serif mb-6 leading-none">
              RECIPES FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">{dish.toUpperCase()}</span>
            </h1>
            <p className="md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mb-4 border-l-2 border-[#d4af37] pl-6">
              {totalResults > 0
                ? `Found ${totalResults} delicious ${totalResults === 1 ? 'recipe' : 'recipes'} for you to explore.`
                : 'Searching for the perfect recipes...'
              }
            </p>
            {(selectedDiet !== null && selectedDiet !== undefined) && (
              <p className="md:text-lg text-[#d4af37] font-medium tracking-wide max-w-2xl pl-6">
                Filtered by: {selectedDiet === "" ? "Omnivore" : selectedDiet}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Diet Filter Removed - moved to main filters */}

      {/* Additional Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0a0a0a] border-y border-white/5 py-12 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            <h2 className="text-xl font-bold text-[#d4af37] font-serif tracking-tight uppercase">
              Filter Results
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Diet Filter */}
            <div className="relative">
              <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                Dietary Preference
              </label>
              <select
                value={selectedDiet === "" ? "Omnivore" : selectedDiet}
                onChange={(e) => handleDietSelect(e.target.value)}
                className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                         focus:outline-none focus:border-[#d4af37] transition-colors
                         cursor-pointer hover:border-white/20"
              >
                {diets.map((diet) => (
                  <option key={diet} value={diet}>
                    {diet}
                  </option>
                ))}
              </select>
            </div>
            {/* Cuisine Filter */}
            <div className="relative">
              <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                Cuisine
              </label>
              <select
                value={cuisine}
                onChange={(e) => { setCuisine(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                         focus:outline-none focus:border-[#d4af37] transition-colors
                         cursor-pointer hover:border-white/20"
              >
                <option value="">All Cuisines</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Japanese">Japanese</option>
                <option value="Thai">Thai</option>
                <option value="Greek">Greek</option>
                <option value="French">French</option>
                <option value="American">American</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            </div>

            {/* Dish Type Filter */}
            <div className="relative">
              <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                Dish Type
              </label>
              <select
                value={dishType}
                onChange={(e) => { setDishType(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                         focus:outline-none focus:border-[#d4af37] transition-colors
                         cursor-pointer hover:border-white/20"
              >
                <option value="">All Types</option>
                <option value="main course">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="appetizer">Appetizer</option>
                <option value="breakfast">Breakfast</option>
                <option value="soup">Soup</option>
                <option value="salad">Salad</option>
                <option value="side dish">Side Dish</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Max Cooking Time Filter */}
            <div className="relative">
              <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                Max Cooking Time
              </label>
              <select
                value={maxCookingTime}
                onChange={(e) => { setMaxCookingTime(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                         focus:outline-none focus:border-[#d4af37] transition-colors
                         cursor-pointer hover:border-white/20"
              >
                <option value="">Any Time</option>
                <option value="15">15 min or less</option>
                <option value="30">30 min or less</option>
                <option value="45">45 min or less</option>
                <option value="60">1 hour or less</option>
              </select>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="border-t border-white/10 pt-6">
            <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
              Sort Results
            </label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="w-full md:w-1/2 bg-[#111] border border-white/10 text-white px-4 py-3 
                       focus:outline-none focus:border-[#d4af37] transition-colors
                       cursor-pointer hover:border-white/20"
            >
              <option value="">Default Order</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="time-asc">Cooking Time (Shortest First)</option>
              <option value="time-desc">Cooking Time (Longest First)</option>
              <option value="calories-asc">Calories (Lowest First)</option>
              <option value="calories-desc">Calories (Highest First)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(cuisine || dishType || maxCookingTime || sortBy) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setCuisine('');
                  setDishType('');
                  setMaxCookingTime('');
                  setSortBy('');
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-transparent border border-white/10 text-gray-400
                         hover:bg-white/5 hover:border-white/20 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recipe List */}
      <section className="w-full bg-[#0a0a0a] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center mb-16 md:mb-24"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#d4af37] uppercase tracking-[0.3em] text-sm font-medium mb-4 section-header-line"
            >
              Search Results
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-white text-center font-serif tracking-tight leading-tight"
            >
              Discover Recipes
            </motion.h2>
          </motion.div>
          <FoodList foodData={foodData} />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center gap-4 mt-16"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-wider font-bold text-sm"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 ${currentPage === pageNum
                          ? 'bg-[#d4af37] text-black'
                          : 'bg-transparent border border-white/30 text-white hover:border-[#d4af37]'
                          } transition-all font-bold`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-gray-500">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-wider font-bold text-sm"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Page Info */}
          <p className="text-center text-gray-400 mt-6">
            Page {currentPage} of {totalPages} • Showing {foodData.length} of {totalResults} recipes
          </p>
        </div>
      </section>
    </div>
  );
};

export default DishPage;
