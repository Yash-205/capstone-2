"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Minus, Upload, Loader as LoaderIcon, X } from "lucide-react";
import Loader from "../components/Loader";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CreateRecipe() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        servings: 1,
        readyInMinutes: 30,
        image: null,
        ingredients: [{ name: "", amount: "", unit: "" }],
        instructions: [{ step: "", number: 1 }],
        nutrition: { calories: "", protein: "", carbs: "", fat: "" },
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        pricePerServing: ""
    });

    if (!user) {
        router.push("/login");
        return <Loader />;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { name: "", amount: "", unit: "" }]
        });
    };

    const removeIngredient = (index) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((_, i) => i !== index)
        });
    };

    const updateIngredient = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData({ ...formData, ingredients: newIngredients });
    };

    const addInstruction = () => {
        setFormData({
            ...formData,
            instructions: [...formData.instructions, { step: "", number: formData.instructions.length + 1 }]
        });
    };

    const removeInstruction = (index) => {
        const newInstructions = formData.instructions
            .filter((_, i) => i !== index)
            .map((inst, i) => ({ ...inst, number: i + 1 }));
        setFormData({ ...formData, instructions: newInstructions });
    };

    const updateInstruction = (index, value) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index].step = value;
        setFormData({ ...formData, instructions: newInstructions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("image", formData.image);
            data.append("title", formData.title);
            data.append("summary", formData.summary);
            data.append("servings", formData.servings);
            data.append("readyInMinutes", formData.readyInMinutes);
            data.append("ingredients", JSON.stringify(formData.ingredients));
            data.append("instructions", JSON.stringify(formData.instructions));
            data.append("nutrition", JSON.stringify(formData.nutrition));
            data.append("vegetarian", formData.vegetarian);
            data.append("vegan", formData.vegan);
            data.append("glutenFree", formData.glutenFree);
            data.append("dairyFree", formData.dairyFree);
            if (formData.pricePerServing) data.append("pricePerServing", formData.pricePerServing);

            const res = await fetch(`${API_BASE_URL}/api/user-recipes`, {
                method: "POST",
                credentials: "include",
                body: data
            });

            if (!res.ok) throw new Error("Failed to create recipe");

            const recipe = await res.json();
            alert("✅ Recipe created successfully!");
            router.push(`/user-recipes/${recipe._id}`);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to create recipe");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-4">
                        Create Your <span className="text-[#d4af37]">Recipe</span>
                    </h1>
                    <p className="text-gray-400 mb-12">Share your culinary creation with the community</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Image Upload */}
                        <div className="bg-[#111] border border-white/10 p-6">
                            <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-4">
                                Recipe Image *
                            </label>
                            <div className="flex flex-col items-center">
                                {imagePreview ? (
                                    <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden border border-white/10">
                                        <Image
                                            src={imagePreview}
                                            alt="Recipe preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setFormData({ ...formData, image: null });
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full h-64 border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-[#d4af37] transition-colors">
                                        <Upload className="w-12 h-12 text-gray-500 mb-2" />
                                        <span className="text-gray-400">Click to upload image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            required
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="bg-[#111] border border-white/10 p-6 space-y-4">
                            <div>
                                <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-2">
                                    Summary *
                                </label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#d4af37] h-32"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-2">
                                        Servings *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.servings}
                                        onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-2">
                                        Cook Time (min) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.readyInMinutes}
                                        onChange={(e) => setFormData({ ...formData, readyInMinutes: parseInt(e.target.value) })}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#d4af37]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-[#111] border border-white/10 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[#d4af37] text-sm font-bold uppercase tracking-wider">
                                    Ingredients *
                                </label>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 text-sm font-bold uppercase hover:bg-[#f1c40f] transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.ingredients.map((ing, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={ing.name}
                                            onChange={(e) => updateIngredient(index, "name", e.target.value)}
                                            className="flex-1 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                            required
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Amount"
                                            value={ing.amount}
                                            onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                                            className="w-24 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Unit"
                                            value={ing.unit}
                                            onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                                            className="w-24 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                            required
                                        />
                                        {formData.ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                                className="bg-red-600/20 border border-red-600/50 text-red-400 px-3 py-2 hover:bg-red-600/30"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-[#111] border border-white/10 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[#d4af37] text-sm font-bold uppercase tracking-wider">
                                    Instructions *
                                </label>
                                <button
                                    type="button"
                                    onClick={addInstruction}
                                    className="flex items-center gap-2 bg-[#d4af37] text-black px-4 py-2 text-sm font-bold uppercase hover:bg-[#f1c40f] transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Step
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.instructions.map((inst, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="flex items-center justify-center w-10 h-10 bg-[#d4af37] text-black font-bold">
                                            {index + 1}
                                        </div>
                                        <textarea
                                            value={inst.step}
                                            onChange={(e) => updateInstruction(index, e.target.value)}
                                            className="flex-1 bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37] h-20"
                                            placeholder="Describe this step..."
                                            required
                                        />
                                        {formData.instructions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeInstruction(index)}
                                                className="bg-red-600/20 border border-red-600/50 text-red-400 px-3 py-2 hover:bg-red-600/30 h-10"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition */}
                        <div className="bg-[#111] border border-white/10 p-6">
                            <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-4">
                                Nutrition (per serving) *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">Calories</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.nutrition.calories}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutrition: { ...formData.nutrition, calories: e.target.value }
                                        })}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">Protein (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.nutrition.protein}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutrition: { ...formData.nutrition, protein: e.target.value }
                                        })}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">Carbs (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.nutrition.carbs}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutrition: { ...formData.nutrition, carbs: e.target.value }
                                        })}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs mb-2">Fat (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.nutrition.fat}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutrition: { ...formData.nutrition, fat: e.target.value }
                                        })}
                                        className="w-full bg-[#0a0a0a] border border-white/10 text-white px-3 py-2 focus:outline-none focus:border-[#d4af37]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dietary Flags */}
                        <div className="bg-[#111] border border-white/10 p-6">
                            <label className="block text-[#d4af37] text-sm font-bold uppercase tracking-wider mb-4">
                                Dietary Information
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {["vegetarian", "vegan", "glutenFree", "dairyFree"].map((flag) => (
                                    <label key={flag} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData[flag]}
                                            onChange={(e) => setFormData({ ...formData, [flag]: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-white capitalize">{flag.replace(/([A-Z])/g, ' $1')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-[#f1c40f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <LoaderIcon className="w-5 h-5 animate-spin" />
                                    Creating Recipe...
                                </>
                            ) : (
                                "Create Recipe"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
