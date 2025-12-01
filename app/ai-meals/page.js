'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ChefHat, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AIRecommendationsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const [selectedMealType, setSelectedMealType] = useState('breakfast');
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const [error, setError] = useState(null);

    const mealTypes = [
        { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
        { value: 'lunch', label: 'Lunch', emoji: '☀️' },
        { value: 'dinner', label: 'Dinner', emoji: '🌙' }
    ];

    const getRecommendations = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!user.profileCompleted) {
            alert('Please complete your profile first to get personalized recommendations!');
            router.push('/profile-complete');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/ai/recommendations?mealType=${selectedMealType}`, {
                credentials: 'include'
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.msg || 'Failed to get recommendations');
            }

            const data = await res.json();
            setRecommendations(data);
        } catch (err) {
            console.error('[AI_RECOMMENDATIONS_ERROR]', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const searchRecipes = () => {
        if (!recommendations) return;

        // Build query parameters for recipe search
        const params = new URLSearchParams({
            minCalories: recommendations.nutrientTargets.minCalories,
            maxCalories: recommendations.nutrientTargets.maxCalories,
            minProtein: recommendations.nutrientTargets.minProtein,
            maxProtein: recommendations.nutrientTargets.maxProtein,
            minCarbs: recommendations.nutrientTargets.minCarbs,
            maxCarbs: recommendations.nutrientTargets.maxCarbs,
            minFat: recommendations.nutrientTargets.minFat,
            maxFat: recommendations.nutrientTargets.maxFat,
            diet: recommendations.diet,
            excludeIngredients: recommendations.excludeIngredients.join(','),
            number: recommendations.numberOfRecipes || 12
        });

        router.push(`/recipes?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-10 h-10 text-[#d4af37]" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">
                            AI Meal Planner
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Get personalized meal recommendations based on your profile and fitness goals
                    </p>
                </motion.div>

                {/* Meal Type Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-[#111] border border-white/10 p-8 rounded-lg mb-8"
                >
                    <h2 className="text-2xl font-bold text-white font-serif mb-6">
                        Select Meal Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mealTypes.map((meal) => (
                            <button
                                key={meal.value}
                                onClick={() => setSelectedMealType(meal.value)}
                                className={`p-6 border-2 transition-all duration-300 ${selectedMealType === meal.value
                                        ? 'border-[#d4af37] bg-[#d4af37]/10'
                                        : 'border-white/10 hover:border-[#d4af37]/50'
                                    }`}
                            >
                                <div className="text-4xl mb-2">{meal.emoji}</div>
                                <div className={`text-lg font-bold uppercase tracking-wider ${selectedMealType === meal.value ? 'text-[#d4af37]' : 'text-white'
                                    }`}>
                                    {meal.label}
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={getRecommendations}
                        disabled={loading}
                        className="w-full mt-8 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-[#f1c40f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Recommendations...
                            </>
                        ) : (
                            <>
                                <ChefHat className="w-5 h-5" />
                                Get AI Recommendations
                            </>
                        )}
                    </button>
                </motion.div>

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 p-6 rounded-lg mb-8"
                    >
                        <p className="text-red-400 text-center">{error}</p>
                    </motion.div>
                )}

                {/* Recommendations Display */}
                {recommendations && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-[#111] border border-white/10 p-8 rounded-lg"
                    >
                        <h2 className="text-2xl font-bold text-white font-serif mb-6 border-b border-white/10 pb-4">
                            Your Personalized {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Plan
                        </h2>

                        {/* Daily Macros */}
                        <div className="mb-8">
                            <h3 className="text-[#d4af37] text-sm uppercase tracking-wider mb-4">Your Daily Macros</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Calories</p>
                                    <p className="text-white text-2xl font-bold">{recommendations.userMacros.calories}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Protein</p>
                                    <p className="text-white text-2xl font-bold">{recommendations.userMacros.protein}g</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Carbs</p>
                                    <p className="text-white text-2xl font-bold">{recommendations.userMacros.carbs}g</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Fat</p>
                                    <p className="text-white text-2xl font-bold">{recommendations.userMacros.fat}g</p>
                                </div>
                            </div>
                        </div>

                        {/* Meal Targets */}
                        <div className="mb-8">
                            <h3 className="text-[#d4af37] text-sm uppercase tracking-wider mb-4">
                                Target for This Meal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-2">Calories Range</p>
                                    <p className="text-white text-lg">
                                        {recommendations.nutrientTargets.minCalories} - {recommendations.nutrientTargets.maxCalories} cal
                                    </p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-2">Protein Range</p>
                                    <p className="text-white text-lg">
                                        {recommendations.nutrientTargets.minProtein} - {recommendations.nutrientTargets.maxProtein}g
                                    </p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-2">Carbs Range</p>
                                    <p className="text-white text-lg">
                                        {recommendations.nutrientTargets.minCarbs} - {recommendations.nutrientTargets.maxCarbs}g
                                    </p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-2">Fat Range</p>
                                    <p className="text-white text-lg">
                                        {recommendations.nutrientTargets.minFat} - {recommendations.nutrientTargets.maxFat}g
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="mb-8">
                            <h3 className="text-[#d4af37] text-sm uppercase tracking-wider mb-4">Your Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Diet Type</p>
                                    <p className="text-white text-lg capitalize">{recommendations.diet}</p>
                                </div>
                                <div className="bg-[#0a0a0a] p-4 border border-white/5">
                                    <p className="text-gray-500 text-xs uppercase mb-1">Excluded Ingredients</p>
                                    <p className="text-white text-lg">
                                        {recommendations.excludeIngredients.length > 0
                                            ? recommendations.excludeIngredients.join(', ')
                                            : 'None'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={searchRecipes}
                            className="w-full py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <ChefHat className="w-5 h-5" />
                            Find Matching Recipes
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
