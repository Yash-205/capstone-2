# 🥗 NutriPlate: AI-Powered Nutrition & Recipe Engine

**NutriPlate** is a state-of-the-art web platform that revolutionizes meal planning through Generative AI. By merging biometric data analysis with advanced LLMs, it provides hyper-personalized nutritional strategies, smart recipe discovery, and comprehensive health tracking.

> [!NOTE]
> This project is designed to demonstrate high-level proficiency in **GenAI integration**, **Modern Full-Stack Architecture**, and **Premium UX Design**.

---

## 🧠 GenAI & Intelligence Layer

The core of NutriPlate is its intelligence engine, which transforms raw user data into actionable health insights.

- **LLM Engine:** Powered by **Llama-3.3-70b-versatile** via the **Groq SDK**, delivering ultra-low latency responses for complex nutritional reasoning.
- **Structured Intelligence:** Utilizes **Strict JSON Mode** for AI outputs, ensuring seamless integration between the LLM and the application's backend logic.
- **Personalization Algorithm:** Implements the **Mifflin-St Jeor Equation** to calculate BMR and TDEE, which are then used as context for AI-driven meal recommendations.
- **Prompt Engineering:** Sophisticated system prompting that manages dietary restrictions, allergies, and caloric targets to generate safe and goal-aligned meal plans.

---

## 🛠️ In-Depth Tech Stack

### Frontend: The Presentation Layer
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) for optimized rendering and SEO.
- **Core:** [React 19](https://react.dev/) utilizing the latest concurrent features and hooks.
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) for a utility-first, high-performance design system.
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [Lottie-React](https://github.com/LottieFiles/lottie-react) for premium micro-interactions and fluid transitions.
- **State Management:** React Context API & [NextAuth.js](https://next-auth.js.org/) for robust session handling.

### Backend: The Logic Layer
- **Runtime:** [Node.js](https://nodejs.org/) with **ES Modules** support.
- **Framework:** [Express 5](https://expressjs.com/) (Beta) for streamlined middleware handling and RESTful API design.
- **AI SDK:** [Groq SDK](https://github.com/groq/groq-typescript) for high-speed inference.
- **Security:** [JWT](https://jwt.io/) (JSON Web Tokens) for stateless authentication and **bcryptjs** for advanced password hashing.
- **File Management:** [Cloudinary SDK](https://cloudinary.com/documentation/node_integration) for automated image optimization and storage.

### Database: The Persistence Layer
- **Primary DB:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (NoSQL) for flexible, document-based data modeling.
- **ODM:** [Mongoose 8](https://mongoosejs.com/) for schema validation and advanced querying.

---

## ✨ Key Features

| Feature | Description | Tech Used |
| :--- | :--- | :--- |
| **AI Meal Planner** | Generates daily/weekly meal plans based on macros. | Llama 3.3, Groq |
| **Smart Macro Calc** | Dynamic BMR/TDEE calculation from user profile. | JavaScript Logic |
| **Recipe Discovery** | Search and filter recipes based on specific health goals. | MongoDB Aggregations |
| **Premium Auth** | Secure login/signup with role-based access control. | NextAuth.js, JWT |
| **Media Engine** | Seamless image uploads for custom user recipes. | Cloudinary, Multer |
| **Motion UI** | A fully animated, glassmorphic user interface. | Framer Motion, Tailwind 4 |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Groq API Key
- Cloudinary Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/capstone-2.git
   cd capstone-2
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   # Create .env with MONGODB_URI, JWT_SECRET, GROQ_API_KEY, CLOUDINARY_URL
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ..
   npm install
   # Create .env.local with NEXT_PUBLIC_API_URL
   npm run dev
   ```

---

## 📄 License

This project is developed as part of a Capstone initiative. All rights reserved.
