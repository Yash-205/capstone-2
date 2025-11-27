# 🥗 NutriPlate

**Smart Recipe & Nutrition Management System**

> **Status**: 🚧 In Development / Midway

**NutriPlate** is a smart web platform designed to help users discover, save, and manage recipes while tracking nutrition. It combines recipe discovery, calorie tracking, ingredient substitution, and plating suggestions to help users make smarter, healthier eating decisions.

## 🌐 Live Demo

| Component               | URL             |
| ----------------------- | --------------- |
| 🖥️ Frontend (Next.js) | [Live Demo](https://recipe-finder-orpin-pi.vercel.app/)   |
| ⚙️ Backend (API)      | [API Link](https://capstone-2-3-hmts.onrender.com)   |
| 🗄️ Database (MongoDB) | [MongoDB Atlas](#) |

---

## 🚀 Problem Statement

Many people struggle to maintain balanced diets due to time limits and lack of personalized meal plans. Most recipe apps focus only on food ideas, not fitness goals.

**NutriPlate** solves this by providing a unified solution for:

* **Smart Recipe Discovery**: Finding recipes that match your health goals.
* **Nutrition Tracking**: Monitoring calories and macros effortlessly.
* **Personalization**: Tailoring suggestions to your dietary preferences.

## 🏗️ System Architecture

The application follows a modern **Client-Server** architecture:

**Frontend → Backend (API) → Database**

* **Frontend**: Next.js (App Router), Tailwind CSS
* **Backend**: Node.js + Express
* **Database**: MongoDB (NoSQL)
* **Authentication**: JWT-based login/signup
* **Hosting**: Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

## ✨ Key Features

| Category                     | Features                                                                  |
| ---------------------------- | ------------------------------------------------------------------------- |
| 🔐**Authentication**   | User registration, login, logout, and role-based access.                  |
| 🍲**Recipe Finder**    | Browse and search for recipes (Integration with Spoonacular API planned). |
| ❤️**Favorites**      | Save and manage preferred recipes for quick access.                       |
| 🛒**Shopping List**    | Add ingredients directly from recipes to your personal shopping list.     |
| 🥗**Calorie Tracking** | Track calories and nutritional information per recipe.                    |
| 💬**Community**        | Comment on recipes and share tips.                                        |
| 🔍**Advanced Search**  | Searching, sorting, and filtering based on dietary goals.                 |

## 🧠 Tech Stack

| Layer                      | Technologies                                |
| -------------------------- | ------------------------------------------- |
| **Frontend**         | Next.js 15, React 19, Tailwind CSS 4, Axios |
| **Backend**          | Node.js, Express.js                         |
| **Database**         | MongoDB, Mongoose                           |
| **Authentication**   | JWT (JSON Web Tokens)                       |
| **AI/External APIs** | OpenAI, Spoonacular (Planned)               |

## 🔗 API Overview

| Endpoint               | Method   | Description                      | Access        |
| ---------------------- | -------- | -------------------------------- | ------------- |
| `/api/auth/signup`   | POST     | Register a new user              | Public        |
| `/api/auth/login`    | POST     | Authenticate user & return JWT   | Public        |
| `/api/recipes`       | GET      | Get recipes based on goals       | Authenticated |
| `/api/favorites`     | GET/POST | Manage favorite recipes          | Authenticated |
| `/api/shopping-list` | GET/POST | Manage shopping list items       | Authenticated |
| `/api/comments`      | POST     | Submit a new comment on a recipe | Authenticated |
| `/api/users/:id`     | PUT      | Update user profile & goals      | Authenticated |

---

## ⚙️ Local Setup Guide

Follow these steps to run **NutriPlate** locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/capstone-2.git
cd capstone-2
```

### 2️⃣ Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

Open a new terminal, navigate to the root directory, and install dependencies:

```bash
# Ensure you are in the root directory 'capstone-2'
npm install
```

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend development server:

```bash
npm run dev
```

*The app will run on http://localhost:3000*
