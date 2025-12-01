'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Activity, Target, Utensils, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileCompletePage() {
    const router = useRouter();
    const { checkAuth } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    // Form state
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        height: '',
        weight: '',
        activityLevel: '',
        fitnessGoal: '',
        mealType: '',
        allergies: [],
        preferredCuisines: [],
        mealsPerDay: 3
    });

    const [loading, setLoading] = useState(false);

    // Options for dropdowns
    const genderOptions = ['male', 'female', 'other'];
    const activityLevelOptions = [
        { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
        { value: 'light', label: 'Light (exercise 1-3 days/week)' },
        { value: 'moderate', label: 'Moderate (exercise 3-5 days/week)' },
        { value: 'active', label: 'Active (exercise 6-7 days/week)' },
        { value: 'very active', label: 'Very Active (intense exercise daily)' }
    ];
    const fitnessGoalOptions = ['weight loss', 'balanced', 'muscle gain'];
    const mealTypeOptions = ['veg', 'non-veg', 'vegan'];
    const allergyOptions = ['peanut', 'milk', 'gluten', 'eggs', 'soy', 'fish', 'shellfish', 'tree nuts'];
    const cuisineOptions = ['Indian', 'Italian', 'Chinese', 'Mexican', 'Thai', 'Japanese', 'Mediterranean', 'American'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: prev[name].includes(value)
                ? prev[name].filter(item => item !== value)
                : [...prev[name], value]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    age: parseInt(formData.age),
                    height: parseInt(formData.height),
                    weight: parseInt(formData.weight),
                    mealsPerDay: parseInt(formData.mealsPerDay)
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.msg || 'Failed to update profile');
                setLoading(false);
                return;
            }

            // Refresh auth state
            await checkAuth();

            // Redirect to home
            router.push('/');
        } catch (err) {
            console.error('Profile update error:', err);
            alert('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-20"
            style={{
                backgroundImage: "url('/photo2.jpg')",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/40"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-4xl"
            >
                <form
                    onSubmit={handleSubmit}
                    className="bg-[#111] border border-white/10 p-10 shadow-2xl space-y-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-white font-serif tracking-tight mb-2">
                            Complete Your Profile
                        </h2>
                        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-4"></div>
                        <p className="text-gray-400 text-sm">Help us personalize your fitness and nutrition journey</p>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                            <User className="w-5 h-5" />
                            <h3 className="text-xl font-semibold uppercase tracking-wide">Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Age *</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                    min="1"
                                    max="120"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Gender *</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    {genderOptions.map(option => (
                                        <option key={option} value={option} className="bg-[#0a0a0a]">
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Height (cm) *</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                    min="50"
                                    max="300"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Weight (kg) *</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                    min="20"
                                    max="500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fitness Information */}
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                            <Activity className="w-5 h-5" />
                            <h3 className="text-xl font-semibold uppercase tracking-wide">Fitness Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Activity Level *</label>
                                <select
                                    name="activityLevel"
                                    value={formData.activityLevel}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                >
                                    <option value="">Select Activity Level</option>
                                    {activityLevelOptions.map(option => (
                                        <option key={option.value} value={option.value} className="bg-[#0a0a0a]">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Fitness Goal *</label>
                                <select
                                    name="fitnessGoal"
                                    value={formData.fitnessGoal}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                >
                                    <option value="">Select Fitness Goal</option>
                                    {fitnessGoalOptions.map(option => (
                                        <option key={option} value={option} className="bg-[#0a0a0a]">
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Meal Preferences */}
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                            <Utensils className="w-5 h-5" />
                            <h3 className="text-xl font-semibold uppercase tracking-wide">Meal Preferences</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Meal Type *</label>
                                <select
                                    name="mealType"
                                    value={formData.mealType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                                    required
                                >
                                    <option value="">Select Meal Type</option>
                                    {mealTypeOptions.map(option => (
                                        <option key={option} value={option} className="bg-[#0a0a0a]">
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Meals Per Day</label>
                                <input
                                    type="number"
                                    name="mealsPerDay"
                                    value={formData.mealsPerDay}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                                    min="1"
                                    max="10"
                                />
                            </div>
                        </div>

                        {/* Allergies */}
                        <div>
                            <label className="block text-gray-400 text-sm mb-3">Allergies (Select all that apply)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {allergyOptions.map(allergy => (
                                    <label
                                        key={allergy}
                                        className="flex items-center gap-2 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.allergies.includes(allergy)}
                                            onChange={() => handleCheckboxChange('allergies', allergy)}
                                            className="w-4 h-4 bg-[#0a0a0a] border border-white/10 text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0"
                                        />
                                        <span className="text-gray-300 text-sm group-hover:text-[#d4af37] transition-colors">
                                            {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Preferred Cuisines */}
                        <div>
                            <label className="block text-gray-400 text-sm mb-3">Preferred Cuisines (Select all that apply)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {cuisineOptions.map(cuisine => (
                                    <label
                                        key={cuisine}
                                        className="flex items-center gap-2 cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.preferredCuisines.includes(cuisine)}
                                            onChange={() => handleCheckboxChange('preferredCuisines', cuisine)}
                                            className="w-4 h-4 bg-[#0a0a0a] border border-white/10 text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0"
                                        />
                                        <span className="text-gray-300 text-sm group-hover:text-[#d4af37] transition-colors">
                                            {cuisine}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
