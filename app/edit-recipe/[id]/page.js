"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Plus, X, Loader as LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditRecipePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const recipeId = params.id;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [servings, setServings] = useState(1);
    const [cookTime, setCookTime] = useState(30);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [ingredients, setIngredients] = useState([{ name: "", amount: "", unit: "" }]);
    const [instructions, setInstructions] = useState([{ step: "", number: 1 }]);
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [vegetarian, setVegetarian] = useState(false);
    const [vegan, setVegan] = useState(false);
    const [glutenFree, setGlutenFree] = useState(false);
    const [dairyFree, setDairyFree] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchRecipe = async () => {
            try {
                const localId = recipeId.replace('user-', '');
                const res = await fetch(`${API_BASE_URL}/api/user-recipes/${localId}`, {
                    credentials: "include"
                });

                if (!res.ok) throw new Error("Failed to fetch recipe");

                const recipe = await res.json();

                // Check if user is the owner
                if (recipe.author._id !== user._id) {
                    alert("You are not authorized to edit this recipe");
                    router.push(`/recipie/${recipeId}`);
                    return;
                }

                // Populate form
                setTitle(recipe.title);
                setSummary(recipe.summary);
                setServings(recipe.servings);
                setCookTime(recipe.readyInMinutes);
                setImagePreview(recipe.image);
                setIngredients(recipe.ingredients);
                setInstructions(recipe.instructions.map(inst => ({ step: inst.step, number: inst.number })));
                setCalories(recipe.nutrition.calories.toString());
                setProtein(recipe.nutrition.protein.toString());
                setCarbs(recipe.nutrition.carbs.toString());
                setFat(recipe.nutrition.fat.toString());
                setVegetarian(recipe.vegetarian);
                setVegan(recipe.vegan);
                setGlutenFree(recipe.glutenFree);
                setDairyFree(recipe.dairyFree);

                setLoading(false);
            } catch (err) {
                console.error(err);
                alert("Failed to load recipe");
                router.push("/dashboard");
            }
        };

        fetchRecipe();
    }, [recipeId, user, router]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            if (imageFile) {
                formData.append("image", imageFile);
            }
            formData.append("title", title);
            formData.append("summary", summary);
            formData.append("servings", servings);
            formData.append("readyInMinutes", cookTime);
            formData.append("ingredients", JSON.stringify(ingredients));
            formData.append("instructions", JSON.stringify(instructions.map((inst, idx) => ({ ...inst, number: idx + 1 }))));
            formData.append("nutrition", JSON.stringify({
                calories: parseInt(calories) || 0,
                protein: parseInt(protein) || 0,
                carbs: parseInt(carbs) || 0,
                fat: parseInt(fat) || 0
            }));
            formData.append("vegetarian", vegetarian);
            formData.append("vegan", vegan);
            formData.append("glutenFree", glutenFree);
            formData.append("dairyFree", dairyFree);

            const localId = recipeId.replace('user-', '');
            const res = await fetch(`${API_BASE_URL}/api/user-recipes/${localId}`, {
                method: "PUT",
                credentials: "include",
                body: formData
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.msg || "Failed to update recipe");
            }

            alert("✅ Recipe updated successfully!");
            router.push(`/user-recipes/${localId}`);
        } catch (err) {
            console.error(err);
            alert("❌ " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addInstruction = () => {
        setInstructions([...instructions, { step: "", number: instructions.length + 1 }]);
    };

    const removeInstruction = (index) => {
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const updateInstruction = (index, value) => {
        const updated = [...instructions];
        updated[index].step = value;
        setInstructions(updated);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#d4af37] hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border border-white/10 p-8 rounded-lg"
                >
                    <h1 className="text-4xl font-bold text-white mb-8 font-serif">Edit Recipe</h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-[#d4af37] mb-2 font-semibold">Recipe Image</label>
                            <div className="relative">
                                {imagePreview && (
                                    <div className="mb-4 relative w-full h-64">
                                        <Image
                                            src={imagePreview}
                                            alt="Recipe preview"
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setImageFile(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <label className="flex items-center justify-center gap-2 bg-[#0a0a0a] border-2 border-dashed border-white/20 hover:border-[#d4af37] p-8 rounded-lg cursor-pointer transition-colors">
                                    <Upload className="w-6 h-6 text-[#d4af37]" />
                                    <span className="text-gray-400">
                                        {imagePreview && !imageFile ? "Change Image" : "Upload new image (optional)"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Title & Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[#d4af37] mb-2 font-semibold">Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[#d4af37] mb-2 font-semibold">Summary *</label>
                                <textarea
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    required
                                    rows={3}
                                    className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Servings & Cook Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[#d4af37] mb-2 font-semibold">Servings *</label>
                                <input
                                    type="number"
                                    value={servings}
                                    onChange={(e) => setServings(parseInt(e.target.value))}
                                    required
                                    min="1"
                                    className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[#d4af37] mb-2 font-semibold">Cook Time (minutes) *</label>
                                <input
                                    type="number"
                                    value={cookTime}
                                    onChange={(e) => setCookTime(parseInt(e.target.value))}
                                    required
                                    min="1"
                                    className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                />
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-[#d4af37] font-semibold">Ingredients *</label>
                                <button
                                    type="button"
                                    onClick={addIngredient}
                                    className="flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Ingredient
                                </button>
                            </div>
                            <div className="space-y-3">
                                {ingredients.map((ing, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={ing.name}
                                            onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                                            required
                                            className="flex-1 bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={ing.amount}
                                            onChange={(e) => updateIngredient(idx, "amount", e.target.value)}
                                            required
                                            className="w-24 bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Unit"
                                            value={ing.unit}
                                            onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                                            required
                                            className="w-24 bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                        />
                                        {ingredients.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(idx)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-[#d4af37] font-semibold">Instructions *</label>
                                <button
                                    type="button"
                                    onClick={addInstruction}
                                    className="flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Step
                                </button>
                            </div>
                            <div className="space-y-3">
                                {instructions.map((inst, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-[#d4af37] text-black font-bold rounded">
                                            {idx + 1}
                                        </div>
                                        <textarea
                                            placeholder="Instruction step"
                                            value={inst.step}
                                            onChange={(e) => updateInstruction(idx, e.target.value)}
                                            required
                                            rows={2}
                                            className="flex-1 bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none resize-none"
                                        />
                                        {instructions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeInstruction(idx)}
                                                className="text-red-500 hover:text-red-400"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition */}
                        <div>
                            <label className="block text-[#d4af37] mb-4 font-semibold">Nutrition Information *</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Calories</label>
                                    <input
                                        type="number"
                                        value={calories}
                                        onChange={(e) => setCalories(e.target.value)}
                                        required
                                        className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Protein (g)</label>
                                    <input
                                        type="number"
                                        value={protein}
                                        onChange={(e) => setProtein(e.target.value)}
                                        required
                                        className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Carbs (g)</label>
                                    <input
                                        type="number"
                                        value={carbs}
                                        onChange={(e) => setCarbs(e.target.value)}
                                        required
                                        className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Fat (g)</label>
                                    <input
                                        type="number"
                                        value={fat}
                                        onChange={(e) => setFat(e.target.value)}
                                        required
                                        className="w-full bg-[#0a0a0a] border border-white/20 text-white p-3 rounded focus:border-[#d4af37] outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dietary Flags */}
                        <div>
                            <label className="block text-[#d4af37] mb-4 font-semibold">Dietary Flags</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Vegetarian", value: vegetarian, setter: setVegetarian },
                                    { label: "Vegan", value: vegan, setter: setVegan },
                                    { label: "Gluten Free", value: glutenFree, setter: setGlutenFree },
                                    { label: "Dairy Free", value: dairyFree, setter: setDairyFree }
                                ].map((flag) => (
                                    <label key={flag.label} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={flag.value}
                                            onChange={(e) => flag.setter(e.target.checked)}
                                            className="w-5 h-5 accent-[#d4af37]"
                                        />
                                        <span className="text-gray-300">{flag.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-[#d4af37] text-black py-4 font-bold uppercase tracking-wider hover:bg-[#f1c40f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <LoaderIcon className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Recipe"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
