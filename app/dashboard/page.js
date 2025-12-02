"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, ShoppingCart, Heart, Trash2, Save, LogOut, User, Activity, Target, Utensils } from "lucide-react";
import Image from "next/image";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const diets = [
  "Omnivore",      // Default - no dietary restrictions (empty string in DB)
  "Vegetarian",    // No meat
  "Vegan",         // No animal products
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [diet, setDiet] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  // Fitness tracking state
  const [dailyMacros, setDailyMacros] = useState(null);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [consumedProtein, setConsumedProtein] = useState(0);
  const [consumedCarbs, setConsumedCarbs] = useState(0);
  const [consumedFat, setConsumedFat] = useState(0);

  // AI Plans State
  const [dailyPlan, setDailyPlan] = useState(null);
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Calculate user's daily macros
  const calculateDailyMacros = (user) => {
    if (!user || !user.profileCompleted) return null;

    const { age, gender, weight, height, activityLevel, fitnessGoal } = user;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very active': 1.9
    };

    // Calculate TDEE
    const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    // Adjust calories based on fitness goal
    let targetCalories;
    if (fitnessGoal === 'weight loss') {
      targetCalories = tdee - 500;
    } else if (fitnessGoal === 'muscle gain') {
      targetCalories = tdee + 300;
    } else {
      targetCalories = tdee;
    }

    // Calculate macros
    const proteinPerKg = fitnessGoal === 'muscle gain' ? 2.0 : 1.8;
    const protein = weight * proteinPerKg;
    const fatCalories = targetCalories * 0.25;
    const fat = fatCalories / 9;
    const carbCalories = targetCalories - (protein * 4) - (fat * 9);
    const carbs = carbCalories / 4;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    };
  };

  const fetchShoppingList = async () => {
    try {
      const listRes = await fetch(`${API_BASE_URL}/api/shopping-list`, {
        credentials: "include",
      });
      if (!listRes.ok) throw new Error("Failed to fetch shopping list");
      const listData = await listRes.json();
      setShoppingList(listData.shoppingList || []);
    } catch (err) {
      console.error("[FETCH_SHOPPING_LIST]", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/favorites`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : data.favorites || []);
    } catch (err) {
      console.error("[FETCH_FAVORITES_ERROR]", err);
    }
  };

  const fetchTodaysMeals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/meals/today`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch today's meals");

      const data = await res.json();

      // Update consumed values with actual data
      setConsumedCalories(Math.round(data.totals.calories));
      setConsumedProtein(Math.round(data.totals.protein));
      setConsumedCarbs(Math.round(data.totals.carbs));
      setConsumedFat(Math.round(data.totals.fat));
    } catch (err) {
      console.error("[FETCH_TODAYS_MEALS_ERROR]", err);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setDiet(user.dietPreference === '' ? 'Omnivore' : user.dietPreference || 'Omnivore');
      fetchShoppingList();
      fetchFavorites();
      fetchTodaysMeals(); // Fetch actual meal data

      // Calculate daily macros if profile is completed
      if (user.profileCompleted) {
        const macros = calculateDailyMacros(user);
        setDailyMacros(macros);
      }
    }
  }, [user, router]);

  const updateDiet = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/diet`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dietPreference: diet }),
      });

      if (!res.ok) throw new Error("Update failed");
      alert("✅ Diet preference updated!");
    } catch (error) {
      console.error("[UPDATE_DIET_ERROR]", error);
      alert("❌ Error updating diet preference");
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/shopping-list`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setShoppingList((prev) => prev.filter((i) => i !== item));
    } catch (err) {
      alert("❌ Failed to delete item");
      console.error("[DELETE_ITEM ERROR]", err);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/favorites`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to remove favorite");

      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error("[REMOVE_FAVORITE_ERROR]", err);
    }
  };

  const generateDailyPlan = async () => {
    try {
      setLoadingPlan(true);
      const res = await fetch(`${API_BASE_URL}/api/ai/daily-plan`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setDailyPlan(data);
    } catch (err) {
      console.error("[DAILY_PLAN_ERROR]", err);
      alert("Failed to generate daily plan");
    } finally {
      setLoadingPlan(false);
    }
  };

  const generateWeeklyPlan = async () => {
    try {
      setLoadingPlan(true);
      const res = await fetch(`${API_BASE_URL}/api/ai/weekly-plan`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setWeeklyPlan(data);
    } catch (err) {
      console.error("[WEEKLY_PLAN_ERROR]", err);
      alert("Failed to generate weekly plan");
    } finally {
      setLoadingPlan(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Hero Section */}
      <section
        className="relative h-[30vh] md:h-[40vh] flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/photo2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0a0a]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 w-full"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto bg-[#d4af37] rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-[#d4af37]/20">
            <User className="w-8 h-8 md:w-12 md:h-12 text-black" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white font-serif tracking-tight mb-2 break-words">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm md:text-lg break-all">{user.email}</p>
        </motion.div>
      </section>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 w-full">
        {/* Tabs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'shopping', label: 'Shopping List', icon: ShoppingCart },
            { id: 'my-recipes', label: 'My Recipes', icon: Utensils },
            { id: 'ai-plans', label: 'AI Plans', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${activeTab === tab.id
                ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20"
                : "bg-[#111] text-gray-400 border border-white/10 hover:border-[#d4af37] hover:text-[#d4af37]"
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#111] border border-white/10 p-4 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-6 md:mb-8 border-b border-white/10 pb-4">
                  My Profile
                </h2>

                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                      <User className="w-5 h-5" />
                      <h3 className="text-xl font-semibold uppercase tracking-wide">Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Name</p>
                        <p className="text-white text-lg">{user.name || 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</p>
                        <p className="text-white text-lg break-all">{user.email || 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Age</p>
                        <p className="text-white text-lg">{user.age ? `${user.age} years` : 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Gender</p>
                        <p className="text-white text-lg capitalize">{user.gender || 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Height</p>
                        <p className="text-white text-lg">{user.height ? `${user.height} cm` : 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Weight</p>
                        <p className="text-white text-lg">{user.weight ? `${user.weight} kg` : 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fitness Tracking Dashboard */}
                  {dailyMacros && (
                    <div className="pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 text-[#d4af37] mb-6">
                        <Target className="w-5 h-5" />
                        <h3 className="text-xl font-semibold uppercase tracking-wide">Fitness Tracking</h3>
                      </div>

                      {/* Daily Targets */}
                      <div className="bg-[#0a0a0a] p-6 border border-white/5 mb-6">
                        <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Daily Targets</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase mb-1">Calories</p>
                            <p className="text-[#d4af37] text-2xl font-bold">{dailyMacros.calories}</p>
                            <p className="text-gray-600 text-xs mt-1">kcal/day</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase mb-1">Protein</p>
                            <p className="text-[#d4af37] text-2xl font-bold">{dailyMacros.protein}</p>
                            <p className="text-gray-600 text-xs mt-1">grams/day</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase mb-1">Carbs</p>
                            <p className="text-[#d4af37] text-2xl font-bold">{dailyMacros.carbs}</p>
                            <p className="text-gray-600 text-xs mt-1">grams/day</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-500 text-xs uppercase mb-1">Fat</p>
                            <p className="text-[#d4af37] text-2xl font-bold">{dailyMacros.fat}</p>
                            <p className="text-gray-600 text-xs mt-1">grams/day</p>
                          </div>
                        </div>
                      </div>

                      {/* Progress Tracking */}
                      <div className="bg-[#0a0a0a] p-6 border border-white/5 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-semibold uppercase text-sm tracking-wider">Today's Progress</h4>
                          <button
                            onClick={() => {
                              // Reset consumed values (for demo - in production, this would be stored in backend)
                              setConsumedCalories(0);
                              setConsumedProtein(0);
                              setConsumedCarbs(0);
                              setConsumedFat(0);
                            }}
                            className="text-xs text-gray-500 hover:text-[#d4af37] transition-colors"
                          >
                            Reset
                          </button>
                        </div>

                        {/* Calorie Progress */}
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-sm">Calories</span>
                            <span className="text-white text-sm font-medium">
                              {consumedCalories} / {dailyMacros.calories} kcal
                            </span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#d4af37] to-[#f1c40f] transition-all duration-500"
                              style={{ width: `${Math.min((consumedCalories / dailyMacros.calories) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {dailyMacros.calories - consumedCalories > 0
                              ? `${dailyMacros.calories - consumedCalories} kcal remaining`
                              : 'Target reached!'}
                          </p>
                        </div>

                        {/* Protein Progress */}
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-sm">Protein</span>
                            <span className="text-white text-sm font-medium">
                              {consumedProtein} / {dailyMacros.protein}g
                            </span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                              style={{ width: `${Math.min((consumedProtein / dailyMacros.protein) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Carbs Progress */}
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-sm">Carbs</span>
                            <span className="text-white text-sm font-medium">
                              {consumedCarbs} / {dailyMacros.carbs}g
                            </span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                              style={{ width: `${Math.min((consumedCarbs / dailyMacros.carbs) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Fat Progress */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-400 text-sm">Fat</span>
                            <span className="text-white text-sm font-medium">
                              {consumedFat} / {dailyMacros.fat}g
                            </span>
                          </div>
                          <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                              style={{ width: `${Math.min((consumedFat / dailyMacros.fat) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Info Message */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                          <div className="bg-[#111] p-4 border border-[#d4af37]/20 rounded">
                            <p className="text-gray-400 text-sm">
                              <span className="text-[#d4af37] font-semibold">💡 Tip:</span> Log meals by clicking the "Log Meal" button on recipe detail pages. Your daily intake will be tracked automatically!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Fitness Goal Progress */}
                      <div className="bg-[#0a0a0a] p-6 border border-white/5">
                        <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Fitness Goal</h4>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Current Goal</p>
                            <p className="text-[#d4af37] text-xl font-bold capitalize">{user.fitnessGoal}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-sm mb-1">Daily Calorie Target</p>
                            <p className="text-white text-xl font-bold">
                              {user.fitnessGoal === 'weight loss' && '↓ '}
                              {user.fitnessGoal === 'muscle gain' && '↑ '}
                              {dailyMacros.calories} kcal
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                          <div className="bg-[#111] p-3 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase mb-1">BMR</p>
                            <p className="text-white text-lg font-semibold">{dailyMacros.bmr} kcal</p>
                            <p className="text-gray-600 text-xs mt-1">Base metabolic rate</p>
                          </div>
                          <div className="bg-[#111] p-3 border border-white/5">
                            <p className="text-gray-500 text-xs uppercase mb-1">TDEE</p>
                            <p className="text-white text-lg font-semibold">{dailyMacros.tdee} kcal</p>
                            <p className="text-gray-600 text-xs mt-1">Total daily expenditure</p>
                          </div>
                        </div>
                        {user.fitnessGoal === 'weight loss' && (
                          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded">
                            <p className="text-red-400 text-sm">
                              <span className="font-semibold">Weight Loss Mode:</span> 500 calorie deficit for ~0.5kg/week loss
                            </p>
                          </div>
                        )}
                        {user.fitnessGoal === 'muscle gain' && (
                          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
                            <p className="text-green-400 text-sm">
                              <span className="font-semibold">Muscle Gain Mode:</span> 300 calorie surplus for lean muscle growth
                            </p>
                          </div>
                        )}
                        {user.fitnessGoal === 'balanced' && (
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                            <p className="text-blue-400 text-sm">
                              <span className="font-semibold">Balanced Mode:</span> Maintenance calories for weight stability
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Fitness Information */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                      <Activity className="w-5 h-5" />
                      <h3 className="text-xl font-semibold uppercase tracking-wide">Fitness Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Activity Level</p>
                        <p className="text-white text-lg capitalize">{user.activityLevel || 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Fitness Goal</p>
                        <p className="text-white text-lg capitalize">{user.fitnessGoal || 'Not set'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meal Preferences */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                      <Utensils className="w-5 h-5" />
                      <h3 className="text-xl font-semibold uppercase tracking-wide">Meal Preferences</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Dietary Preference</p>
                        <p className="text-white text-lg">{user.dietPreference === '' || !user.dietPreference ? 'Omnivore' : user.dietPreference}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Meals Per Day</p>
                        <p className="text-white text-lg">{user.mealsPerDay || 'Not set'}</p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Allergies</p>
                        <p className="text-white text-lg">
                          {user.allergies && user.allergies.length > 0
                            ? user.allergies.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ')
                            : 'None'}
                        </p>
                      </div>
                      <div className="bg-[#0a0a0a] p-4 border border-white/5 md:col-span-2">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Preferred Cuisines</p>
                        <p className="text-white text-lg">
                          {user.preferredCuisines && user.preferredCuisines.length > 0
                            ? user.preferredCuisines.join(', ')
                            : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Button */}
                  <div className="pt-6 border-t border-white/10">
                    <button
                      onClick={() => router.push('/profile-complete')}
                      className="w-full py-3 md:py-4 bg-transparent border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 md:pb-6 gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">My Favorites</h2>
                <span className="text-[#d4af37] font-medium text-sm md:text-base">{favorites.length} Recipes</span>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-12 md:py-20 bg-[#111] border border-white/5 rounded-lg px-4">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-base md:text-lg">No favorite recipes yet.</p>
                  <button
                    onClick={() => router.push('/')}
                    className="mt-4 md:mt-6 text-[#d4af37] hover:text-white underline transition-colors text-sm md:text-base"
                  >
                    Discover Recipes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {favorites.map((fav, index) => (
                    <motion.div
                      key={fav.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-[#111] border border-white/5 overflow-hidden hover:border-[#d4af37]/50 transition-all duration-300"
                    >
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        {fav.image && (
                          <Image
                            src={fav.image}
                            alt={fav.title}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <button
                          onClick={() => removeFavorite(fav.id)}
                          className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-serif text-white mb-3 md:mb-4 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                          {fav.title}
                        </h3>
                        <button
                          onClick={() => router.push(`/recipie/${fav.id}`)}
                          className="w-full py-2 md:py-3 border border-white/10 text-gray-300 text-xs md:text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all"
                        >
                          View Recipe
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shopping List Tab */}
          {activeTab === 'shopping' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#111] border border-white/10 p-4 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-6 md:mb-8 border-b border-white/10 pb-4">
                  Shopping List
                </h2>
                {shoppingList.length > 0 ? (
                  <ul className="space-y-3 md:space-y-4">
                    {shoppingList.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-center bg-[#0a0a0a] p-3 md:p-4 border border-white/5 hover:border-[#d4af37]/30 transition-colors group"
                      >
                        <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">{item}</span>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm md:text-base">Your shopping list is empty.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Plans Tab */}
          {activeTab === 'ai-plans' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-[#111] border border-white/10 p-4 md:p-8 rounded-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-serif mb-6 md:mb-8 border-b border-white/10 pb-4">
                  AI Nutrition Plans
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Daily Plan Card */}
                  <div className="bg-[#0a0a0a] p-6 border border-white/5 hover:border-[#d4af37]/30 transition-colors">
                    <h3 className="text-xl font-bold text-[#d4af37] mb-3">Daily Meal Structure</h3>
                    <p className="text-gray-400 text-sm mb-6">Get a personalized breakdown of your daily macros into specific meals with nutrient targets.</p>
                    <button
                      onClick={generateDailyPlan}
                      disabled={loadingPlan}
                      className="w-full py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loadingPlan ? <Loader className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                      Generate Daily Plan
                    </button>
                  </div>

                  {/* Weekly Plan Card */}
                  <div className="bg-[#0a0a0a] p-6 border border-white/5 hover:border-[#d4af37]/30 transition-colors">
                    <h3 className="text-xl font-bold text-[#d4af37] mb-3">Weekly Strategy</h3>
                    <p className="text-gray-400 text-sm mb-6">Get a 7-day nutritional roadmap tailored to your fitness goal with daily focus areas.</p>
                    <button
                      onClick={generateWeeklyPlan}
                      disabled={loadingPlan}
                      className="w-full py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-bold uppercase tracking-widest transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loadingPlan ? <Loader className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                      Generate Weekly Plan
                    </button>
                  </div>
                </div>

                {/* Display Daily Plan */}
                {dailyPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 bg-[#0a0a0a] border border-white/10 p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-[#d4af37]" />
                      Your Daily Meal Structure
                    </h3>

                    <div className="grid gap-4">
                      {dailyPlan.meals?.map((meal, idx) => (
                        <div key={idx} className="bg-[#111] p-4 border-l-2 border-[#d4af37]">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[#d4af37] font-bold uppercase tracking-wide">{meal.name}</h4>
                            <span className="text-white font-medium">{meal.calories} kcal</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm text-gray-400 mb-3">
                            <div>P: <span className="text-white">{meal.protein}</span></div>
                            <div>C: <span className="text-white">{meal.carbs}</span></div>
                            <div>F: <span className="text-white">{meal.fat}</span></div>
                          </div>
                          <p className="text-sm text-gray-300 italic">"{meal.suggestion}"</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Display Weekly Plan */}
                {weeklyPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a] border border-white/10 p-6"
                  >
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[#d4af37]" />
                      7-Day Nutritional Strategy
                    </h3>
                    <p className="text-gray-400 mb-6">{weeklyPlan.weeklyOverview}</p>

                    <div className="space-y-4">
                      {weeklyPlan.days?.map((day, idx) => (
                        <div key={idx} className="bg-[#111] p-4 border border-white/5">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                            <div>
                              <span className="text-[#d4af37] font-bold uppercase tracking-wide mr-3">{day.day}</span>
                              <span className="text-white font-medium">{day.focus}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {day.calories} kcal • P:{day.protein}g • C:{day.carbs}g • F:{day.fat}g
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 border-t border-white/5 pt-2 mt-2">
                            <span className="text-[#d4af37] font-semibold">Tip:</span> {day.tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          )}

          {/* My Recipes Tab */}
          {activeTab === 'my-recipes' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#111] border border-white/10 p-4 md:p-8 rounded-lg">
                <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white font-serif">
                    My Recipes
                  </h2>
                  <button
                    onClick={() => router.push('/create-recipe')}
                    className="flex items-center gap-2 bg-[#d4af37] text-black px-4 md:px-6 py-2 md:py-3 font-bold uppercase tracking-wider hover:bg-[#f1c40f] transition-colors text-sm"
                  >
                    <Utensils className="w-4 h-4" />
                    Create Recipe
                  </button>
                </div>

                <p className="text-gray-400 mb-6">
                  Create and manage your own custom recipes. Share your culinary creations with the community!
                </p>

                <div className="bg-[#0a0a0a] border border-white/5 p-6 text-center">
                  <Utensils className="w-16 h-16 text-[#d4af37] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Start Creating</h3>
                  <p className="text-gray-400 mb-6">
                    Click the "Create Recipe" button above to add your first custom recipe with images, ingredients, and instructions.
                  </p>
                  <button
                    onClick={() => router.push('/my-recipes')}
                    className="bg-transparent border border-[#d4af37] text-[#d4af37] px-6 py-3 hover:bg-[#d4af37] hover:text-black transition-all uppercase tracking-wider font-bold text-sm"
                  >
                    View All My Recipes
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div >
    </div >
  );
}
