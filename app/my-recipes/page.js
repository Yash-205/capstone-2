"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Edit, Trash2, Plus } from "lucide-react";
import Loader from "../components/Loader";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyRecipes() {
    const { user } = useAuth();
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyRecipes = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/user-recipes/my/recipes`, {
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to fetch recipes");
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }
        fetchMyRecipes();
    }, [user, fetchMyRecipes]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/user-recipes/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to delete");
            setRecipes(recipes.filter(r => r._id !== id));
            alert("✅ Recipe deleted successfully");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to delete recipe");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-2">
                            My <span className="text-[#d4af37]">Recipes</span>
                        </h1>
                        <p className="text-gray-400">Manage your culinary creations</p>
                    </div>
                    <button
                        onClick={() => router.push("/create-recipe")}
                        className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 font-bold uppercase tracking-wider hover:bg-[#f1c40f] transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Recipe
                    </button>
                </div>

                {recipes.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl mb-6">You haven&apos;t created any recipes yet.</p>
                        <button
                            onClick={() => router.push("/create-recipe")}
                            className="bg-[#d4af37] text-black px-8 py-4 font-bold uppercase tracking-wider hover:bg-[#f1c40f] transition-colors"
                        >
                            Create Your First Recipe
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe, index) => (
                            <motion.div
                                key={recipe._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-[#111] border border-white/10 overflow-hidden group hover:border-[#d4af37]/30 transition-all"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{recipe.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{recipe.summary}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span>{recipe.servings} servings</span>
                                        <span>•</span>
                                        <span>{recipe.readyInMinutes} min</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/user-recipes/${recipe._id}`)}
                                            className="flex-1 py-2 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all text-sm font-bold uppercase"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recipe._id)}
                                            className="px-4 py-2 bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
