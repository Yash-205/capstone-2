import User from "../models/User.js";

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const {
            age,
            gender,
            height,
            weight,
            activityLevel,
            fitnessGoal,
            dietPreference,
            allergies,
            preferredCuisines,
            mealsPerDay
        } = req.body;

        // Validate required fields (dietPreference is optional, defaults to empty string)
        if (!age || !gender || !height || !weight || !activityLevel || !fitnessGoal) {
            return res.status(400).json({ msg: "Please provide all required fields" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                age,
                gender,
                height,
                weight,
                activityLevel,
                fitnessGoal,
                dietPreference: dietPreference || '',
                allergies: allergies || [],
                preferredCuisines: preferredCuisines || [],
                mealsPerDay: mealsPerDay || 3,
                profileCompleted: true
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({
            msg: "Profile updated successfully",
            user
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ msg: "Error updating profile" });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ user });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ msg: "Error fetching profile" });
    }
};
