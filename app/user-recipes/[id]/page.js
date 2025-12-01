"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Clock, Users, Leaf, Sprout, Heart, Target, Edit, Trash2 } from "lucide-react";
import Loader from "../../components/Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserRecipeDetail() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchRecipe();
    }, [params.id]);

    const fetchRecipe = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user-recipes/${params.id}`);
            if (!res.ok) throw new Error("Failed to fetch recipe");
            const data = await res.json();
            setRecipe(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/user-recipes/${params.id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to delete");
            alert("✅ Recipe deleted successfully");
            router.push("/my-recipes");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to delete recipe");
        }
    };

    const handleAddToFavorites = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/favorites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id: `user-${recipe._id}`,
                    title: recipe.title,
                    image: recipe.image,
                }),
            });
            if (!res.ok) throw new Error("Failed");
            alert("❤️ Added to favorites!");
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    const handleLogMeal = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/meals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    recipeId: `user-${recipe._id}`,
                    recipeName: recipe.title,
                    recipeImage: recipe.image,
                    calories: recipe.nutrition.calories,
                    protein: recipe.nutrition.protein,
                    carbs: recipe.nutrition.carbs,
                    fat: recipe.nutrition.fat,
                    mealType: 'snack'
                }),
            });
            if (!res.ok) throw new Error("Failed");
            alert("✅ Meal logged! Check your dashboard.");
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    if (loading) return <Loader />;
    if (!recipe) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><p className="text-white">Recipe not found</p></div>;

    const isOwner = user && recipe.author._id === user._id;

    // Debug logging
    console.log('Ownership check:', {
        hasUser: !!user,
        userId: user?._id,
        authorId: recipe.author._id,
        isOwner
    });


    return (
        <div className="w-full bg-[#0a0a0a] min-h-screen">
            {/* Hero */}
            <section className="min-h-screen flex flex-col justify-center bg-cover bg-center relative" style={{ backgroundImage: `url('${recipe.image}')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-[#d4af37] text-black px-3 py-1 text-xs font-bold uppercase">Community Recipe</span>
                            {recipe.vegetarian && <span className="bg-green-600 text-white px-3 py-1 text-xs font-bold uppercase">Vegetarian</span>}
                            {recipe.vegan && <span className="bg-green-700 text-white px-3 py-1 text-xs font-bold uppercase">Vegan</span>}
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter font-serif mb-6 leading-none">{recipe.title}</h1>
                        <p className="text-xl text-gray-300 font-light tracking-wide max-w-2xl border-l-2 border-[#d4af37] pl-6">
                            Created by {recipe.author.name}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <div className="w-full max-w-7xl mx-auto px-6 py-16 space-y-12">
                {/* Summary */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#111] p-8 border border-white/5">
                    <h2 className="text-4xl font-bold text-[#d4af37] mb-6 font-serif">Description</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">{recipe.summary}</p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    {user && (
                        <>
                            <button onClick={handleAddToFavorites} className="px-8 py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all uppercase tracking-widest font-bold text-sm flex items-center gap-2">
                                <Heart className="w-5 h-5" /> Add to Favorites
                            </button>
                            <button onClick={handleLogMeal} className="px-8 py-4 bg-[#d4af37] text-black hover:bg-[#f1c40f] transition-all uppercase tracking-widest font-bold text-sm flex items-center gap-2">
                                <Target className="w-5 h-5" /> Log Meal
                            </button>
                        </>
                    )}
                    {isOwner && (
                        <>
                            <button
                                onClick={() => router.push(`/edit-recipe/user-${params.id}`)}
                                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest font-bold text-sm flex items-center gap-2"
                            >
                                <Edit className="w-5 h-5" /> Edit Recipe
                            </button>
                            <button onClick={handleDelete} className="px-8 py-4 bg-red-600/20 border-2 border-red-600/50 text-red-400 hover:bg-red-600/30 transition-all uppercase tracking-widest font-bold text-sm flex items-center gap-2">
                                <Trash2 className="w-5 h-5" /> Delete Recipe
                            </button>
                        </>
                    )}
                </div>

                {/* Meta Info */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-[#111] border border-white/5 p-6 text-center">
                        <Clock className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
                        <div className="text-[#d4af37] font-bold text-lg">{recipe.readyInMinutes}</div>
                        <div className="text-gray-400 text-sm uppercase tracking-wider">Minutes</div>
                    </div>
                    <div className="bg-[#111] border border-white/5 p-6 text-center">
                        <Users className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
                        <div className="text-[#d4af37] font-bold text-lg">{recipe.servings}</div>
                        <div className="text-gray-400 text-sm uppercase tracking-wider">Servings</div>
                    </div>
                    <div className="bg-[#111] border border-white/5 p-6 text-center">
                        <Leaf className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
                        <div className="text-[#d4af37] font-bold text-sm uppercase tracking-wider">{recipe.vegetarian ? "Vegetarian" : "Non-Veg"}</div>
                    </div>
                    {recipe.vegan && (
                        <div className="bg-[#111] border border-white/5 p-6 text-center">
                            <Sprout className="w-10 h-10 mx-auto mb-3 text-[#d4af37]" />
                            <div className="text-[#d4af37] font-bold text-sm uppercase tracking-wider">Vegan</div>
                        </div>
                    )}
                </motion.div>

                {/* Nutrition */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#111] p-8 border border-white/5">
                    <h2 className="text-4xl font-bold text-[#d4af37] mb-6 font-serif">Nutrition (per serving)</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-[#d4af37] text-3xl font-bold">{recipe.nutrition.calories}</div>
                            <div className="text-gray-400 text-sm uppercase mt-2">Calories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[#d4af37] text-3xl font-bold">{recipe.nutrition.protein}g</div>
                            <div className="text-gray-400 text-sm uppercase mt-2">Protein</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[#d4af37] text-3xl font-bold">{recipe.nutrition.carbs}g</div>
                            <div className="text-gray-400 text-sm uppercase mt-2">Carbs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[#d4af37] text-3xl font-bold">{recipe.nutrition.fat}g</div>
                            <div className="text-gray-400 text-sm uppercase mt-2">Fat</div>
                        </div>
                    </div>
                </motion.div>

                {/* Ingredients */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#111] p-8 border border-white/5">
                    <h2 className="text-4xl font-bold text-[#d4af37] mb-6 font-serif">Ingredients</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipe.ingredients.map((ing, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-300">
                                <span className="w-2 h-2 bg-[#d4af37] rounded-full"></span>
                                <span>{ing.amount} {ing.unit} {ing.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Instructions */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#111] p-8 border border-white/5">
                    <h2 className="text-4xl font-bold text-[#d4af37] mb-8 font-serif">Instructions</h2>
                    <div className="space-y-6">
                        {recipe.instructions.map((inst, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="p-6 bg-[#0a0a0a] border-l-2 border-[#d4af37] relative">
                                <div className="absolute -left-8 top-6 w-12 h-12 bg-[#d4af37] rounded-full flex items-center justify-center text-black font-bold">{inst.number}</div>
                                <p className="text-gray-300 text-lg leading-relaxed ml-8">{inst.step}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
