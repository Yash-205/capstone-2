"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const RecipeFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
    const [dishType, setDishType] = useState(searchParams.get('type') || '');
    const [maxCookingTime, setMaxCookingTime] = useState(searchParams.get('maxReadyTime') || '');

    const cuisineOptions = [
        { value: '', label: 'All Cuisines' },
        { value: 'Italian', label: 'Italian' },
        { value: 'Mexican', label: 'Mexican' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Indian', label: 'Indian' },
        { value: 'Japanese', label: 'Japanese' },
        { value: 'Thai', label: 'Thai' },
        { value: 'Greek', label: 'Greek' },
        { value: 'French', label: 'French' },
        { value: 'American', label: 'American' },
        { value: 'Mediterranean', label: 'Mediterranean' },
    ];

    const dishTypeOptions = [
        { value: '', label: 'All Types' },
        { value: 'main course', label: 'Main Course' },
        { value: 'dessert', label: 'Dessert' },
        { value: 'appetizer', label: 'Appetizer' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'soup', label: 'Soup' },
        { value: 'salad', label: 'Salad' },
        { value: 'side dish', label: 'Side Dish' },
        { value: 'snack', label: 'Snack' },
    ];

    const timeOptions = [
        { value: '', label: 'Any Time' },
        { value: '15', label: '15 min or less' },
        { value: '30', label: '30 min or less' },
        { value: '45', label: '45 min or less' },
        { value: '60', label: '1 hour or less' },
    ];

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Add/remove cuisine filter
        if (cuisine) {
            params.set('cuisine', cuisine);
        } else {
            params.delete('cuisine');
        }

        // Add/remove dish type filter
        if (dishType) {
            params.set('type', dishType);
        } else {
            params.delete('type');
        }

        // Add/remove max cooking time filter
        if (maxCookingTime) {
            params.set('maxReadyTime', maxCookingTime);
        } else {
            params.delete('maxReadyTime');
        }

        router.push(`/recipes?${params.toString()}`);
    };

    const clearFilters = () => {
        setCuisine('');
        setDishType('');
        setMaxCookingTime('');

        const params = new URLSearchParams(searchParams.toString());
        params.delete('cuisine');
        params.delete('type');
        params.delete('maxReadyTime');

        router.push(`/recipes?${params.toString()}`);
    };

    const hasActiveFilters = cuisine || dishType || maxCookingTime;

    return (
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
                        Filter Recipes
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Cuisine Filter */}
                    <div className="relative">
                        <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                            Cuisine
                        </label>
                        <select
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                                     focus:outline-none focus:border-[#d4af37] transition-colors
                                     cursor-pointer hover:border-white/20"
                        >
                            {cuisineOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dish Type Filter */}
                    <div className="relative">
                        <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                            Dish Type
                        </label>
                        <select
                            value={dishType}
                            onChange={(e) => setDishType(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                                     focus:outline-none focus:border-[#d4af37] transition-colors
                                     cursor-pointer hover:border-white/20"
                        >
                            {dishTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Max Cooking Time Filter */}
                    <div className="relative">
                        <label className="block text-gray-400 text-sm uppercase mb-2 tracking-wider">
                            Max Cooking Time
                        </label>
                        <select
                            value={maxCookingTime}
                            onChange={(e) => setMaxCookingTime(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 text-white px-4 py-3 
                                     focus:outline-none focus:border-[#d4af37] transition-colors
                                     cursor-pointer hover:border-white/20"
                        >
                            {timeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end">
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-transparent border border-white/10 text-gray-400
                                     hover:bg-white/5 hover:border-white/20 transition-all"
                        >
                            Clear Filters
                        </button>
                    )}
                    <button
                        onClick={applyFilters}
                        className="px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#f1c40f] text-black 
                                 font-medium hover:from-[#f1c40f] hover:to-[#d4af37] transition-all
                                 shadow-lg shadow-[#d4af37]/20"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RecipeFilters;
