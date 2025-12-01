"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import FoodList from "../components/FoodList";
import Loader from "../components/Loader";



const RecipesPage = () => {
    const searchParams = useSearchParams();
    const [foodData, setFoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchCriteria, setSearchCriteria] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Get all query parameters
                const minCalories = searchParams.get('minCalories');
                const maxCalories = searchParams.get('maxCalories');
                const minProtein = searchParams.get('minProtein');
                const maxProtein = searchParams.get('maxProtein');
                const minCarbs = searchParams.get('minCarbs');
                const maxCarbs = searchParams.get('maxCarbs');
                const minFat = searchParams.get('minFat');
                const maxFat = searchParams.get('maxFat');
                const diet = searchParams.get('diet');
                const excludeIngredients = searchParams.get('excludeIngredients');
                const number = searchParams.get('number') || '12';

                // Build API URL - use backend proxy
                let apiURL = `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/search?number=${number}`;

                // Add calorie parameters (most important)
                if (minCalories) apiURL += `&minCalories=${minCalories}`;
                if (maxCalories) apiURL += `&maxCalories=${maxCalories}`;

                // Add protein parameters (second most important for fitness)
                if (minProtein) apiURL += `&minProtein=${minProtein}`;
                if (maxProtein) apiURL += `&maxProtein=${maxProtein}`;

                // Note: Removed carbs and fat filters as they make search too restrictive
                // The AI still calculates them for user reference, but we don't filter by them

                // Add diet filter
                if (diet && diet !== '') {
                    apiURL += `&diet=${diet}`;
                }

                // Add excluded ingredients
                if (excludeIngredients && excludeIngredients !== '') {
                    apiURL += `&excludeIngredients=${excludeIngredients}`;
                }

                console.log('[RECIPES_SEARCH] API URL:', apiURL);

                const res = await fetch(apiURL);
                const data = await res.json();

                console.log('[RECIPES_SEARCH] Response:', data);

                setFoodData(data.results || []);

                // Store search criteria for display
                setSearchCriteria({
                    calories: minCalories && maxCalories ? `${minCalories}-${maxCalories} cal` : null,
                    protein: minProtein && maxProtein ? `${minProtein}-${maxProtein}g` : null,
                    carbs: minCarbs && maxCarbs ? `${minCarbs}-${maxCarbs}g` : null,
                    fat: minFat && maxFat ? `${minFat}-${maxFat}g` : null,
                    diet: diet || null,
                    excluded: excludeIngredients || null
                });
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

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
                            AI RECOMMENDED <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">RECIPES</span>
                        </h1>
                        <p className="md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mb-4 border-l-2 border-[#d4af37] pl-6">
                            {foodData.length > 0
                                ? `Found ${foodData.length} personalized ${foodData.length === 1 ? 'recipe' : 'recipes'} matching your profile.`
                                : 'Searching for recipes tailored to your goals...'
                            }
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Criteria Display */}
            {Object.values(searchCriteria).some(v => v) && (
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
                                Your Search Criteria
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {searchCriteria.calories && (
                                <div className="bg-[#111] border border-white/10 p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Calories</p>
                                    <p className="text-white font-medium">{searchCriteria.calories}</p>
                                </div>
                            )}
                            {searchCriteria.protein && (
                                <div className="bg-[#111] border border-white/10 p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Protein</p>
                                    <p className="text-white font-medium">{searchCriteria.protein}</p>
                                </div>
                            )}
                            {searchCriteria.carbs && (
                                <div className="bg-[#111] border border-white/10 p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Carbs</p>
                                    <p className="text-white font-medium">{searchCriteria.carbs}</p>
                                </div>
                            )}
                            {searchCriteria.fat && (
                                <div className="bg-[#111] border border-white/10 p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Fat</p>
                                    <p className="text-white font-medium">{searchCriteria.fat}</p>
                                </div>
                            )}
                            {searchCriteria.diet && (
                                <div className="bg-[#111] border border-white/10 p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Diet</p>
                                    <p className="text-white font-medium capitalize">{searchCriteria.diet}</p>
                                </div>
                            )}
                            {searchCriteria.excluded && (
                                <div className="bg-[#111] border border-white/10 p-4">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Excluded</p>
                                    <p className="text-white font-medium capitalize">{searchCriteria.excluded}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}

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
                            Personalized Results
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-4xl md:text-6xl font-bold text-white text-center font-serif tracking-tight leading-tight"
                        >
                            Discover Your Meals
                        </motion.h2>
                    </motion.div>
                    {foodData.length > 0 ? (
                        <FoodList foodData={foodData} />
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-xl">No recipes found matching your criteria.</p>
                            <p className="text-gray-500 mt-4">Try adjusting your search parameters.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RecipesPage;
