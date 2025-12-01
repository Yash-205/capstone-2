"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Loader from "../components/Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function UserRecipes() {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false
    });

    useEffect(() => {
        fetchRecipes();
    }, [filters]);

    const fetchRecipes = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, "true");
            });

            const res = await fetch(`${API_BASE_URL}/api/user-recipes?${params}`);
            if (!res.ok) throw new Error("Failed to fetch recipes");
            const data = await res.json();
            setRecipes(data.recipes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes();
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero */}
            <section className="min-h-screen flex flex-col justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/photo2.jpg')" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter font-serif mb-6 leading-none">
                            COMMUNITY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">RECIPES</span>
                        </h1>
                        <p className="text-xl text-gray-300 font-light tracking-wide max-w-2xl mb-12 border-l-2 border-[#d4af37] pl-6">
                            Discover delicious recipes created by our community of food enthusiasts
                        </p>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search recipes..."
                                className="flex-1 bg-[#0a0a0a] border border-[#d4af37] text-white px-6 py-4 focus:outline-none text-lg"
                            />
                            <button type="submit" className="px-8 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-[#f1c40f] transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Results */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="bg-[#111] border border-white/10 p-6 mb-12">
                        <h3 className="text-[#d4af37] font-bold uppercase tracking-wider mb-4">Dietary Filters</h3>
                        <div className="flex flex-wrap gap-4">
                            {Object.keys(filters).map(key => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters[key]}
                                        onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Recipe Grid */}
                    {recipes.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-xl">No recipes found. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recipes.map((recipe, index) => (
                                <motion.div
                                    key={recipe._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => router.push(`/user-recipes/${recipe._id}`)}
                                    className="bg-[#111] border border-white/10 overflow-hidden group hover:border-[#d4af37]/30 transition-all cursor-pointer"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 bg-[#d4af37] text-black px-3 py-1 text-xs font-bold uppercase">
                                            Community
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#d4af37] transition-colors">{recipe.title}</h3>
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{recipe.summary}</p>
                                        <p className="text-gray-500 text-xs mb-4">By {recipe.author?.name || "Anonymous"}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{recipe.servings} servings</span>
                                            <span>•</span>
                                            <span>{recipe.readyInMinutes} min</span>
                                            <span>•</span>
                                            <span>{recipe.nutrition.calories} cal</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
