"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Loader from "../components/Loader"; // Adjust path if needed

const API_KEY = "e98e8939d2144d3b85d71bf592bc4a61";
const getVideoUrl = (id) => `https://www.youtube.com/embed/${id}`;

const defaultDishes = [
  "pasta",
  "biryani",
  "salad",
  "soup",
  "noodles",
  "burger",
  "paneer",
  "chicken",
  "rice",
  "pizza",
];

const RecipeVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchVideos = async (query) => {
    try {
      setLoading(true);
      const randomOffset = Math.floor(Math.random() * 100);
      const res = await fetch(
        `https://api.spoonacular.com/food/videos/search?query=${query}&number=18&offset=${randomOffset}&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Video fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dish =
      defaultDishes[Math.floor(Math.random() * defaultDishes.length)];
    fetchVideos(dish);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      fetchVideos(input.trim());
    }
  };

  const handleVideoClick = (video) => {
    sessionStorage.setItem("selectedVideo", JSON.stringify(video));
    sessionStorage.setItem(
      "similarVideos",
      JSON.stringify(videos.filter((v) => v.youTubeId !== video.youTubeId))
    );
    router.push(`/videos/${video.youTubeId}`);
  };

  // 👇 Full Screen Loader while loading
  if (loading) {
    return (
        <Loader />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/pexels-mvdheuvel-2284166.jpg')",
        }}
      >
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="p-4 max-w-xl w-full text-center space-y-6 bg-black/40 rounded-xl">
            <h2 className="text-4xl font-bold text-amber-50 drop-shadow-lg">
              Watch Videos
            </h2>
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Search for videos..."
                className="w-full p-4 border border-amber-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-amber-50 text-amber-100 bg-transparent"
              />
              <button
                type="submit"
                className="p-4 bg-amber-400 text-white rounded-lg hover:bg-amber-600"
              >
                <Search className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="bg-amber-50 py-10 px-4 min-h-screen">
        {videos.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No videos found.</p>
        ) : (
          <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video) => (
              <div
                key={video.youTubeId}
                onClick={() => handleVideoClick(video)}
                className="cursor-pointer group flex flex-col bg-white border-l-8 border-amber-400 p-4 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-amber-500/90 hover:scale-105"
              >
                <iframe
                  className="rounded-md w-full h-48 mb-4 pointer-events-none"
                  src={getVideoUrl(video.youTubeId)}
                  allowFullScreen
                  title={video.title}
                />
                <h3 className="text-lg font-semibold text-amber-800 mb-2 group-hover:text-amber-600 transition-all">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {Math.round(video.length / 60)} min • {video.views} views
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default RecipeVideosPage;
