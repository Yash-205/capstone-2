"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loader from "../components/Loader";


const getVideoUrl = (id) => `https://www.youtube.com/embed/${id}`;

const defaultDishes = [
  "pasta",
  "salad",
  "soup",
  "noodles",
  "burger",
  "paneer",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/videos?query=${query}&number=9&offset=${randomOffset}`
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-gray-50">
      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col justify-center bg-cover bg-center w-full relative"
        style={{
          backgroundImage: "url('/photo2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-black/30"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-4xl animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter font-serif mb-6 leading-none">
              RECIPE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f1c40f]">VIDEOS</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mb-12 border-l-2 border-[#d4af37] pl-6">
              Master the art of cooking with our curated collection of step-by-step video tutorials.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-0 w-full max-w-2xl bg-transparent md:bg-[#0a0a0a] md:border md:border-[#d4af37] md:p-2 md:shadow-[0_0_50px_rgba(212,175,55,0.15)] transition-all duration-300 md:hover:shadow-[0_0_70px_rgba(212,175,55,0.25)] transform md:hover:-translate-y-1">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Search for recipe videos..."
                className="flex-grow bg-[#0a0a0a] md:bg-transparent border border-[#d4af37] md:border-none text-white placeholder-gray-500 focus:outline-none text-lg md:text-xl px-6 py-4 font-light tracking-wide mb-2 md:mb-0"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#d4af37] text-black font-bold tracking-widest hover:bg-[#f1c40f] transition-all duration-300 uppercase text-sm w-full md:w-auto"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Videos Grid Section */}
      <section className="w-full bg-[#0a0a0a] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center mb-16 md:mb-24"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#d4af37] uppercase tracking-[0.3em] text-sm font-medium mb-4 section-header-line"
            >
              Curated Collection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center font-serif tracking-tight leading-tight"
            >
              Featured Videos
            </motion.h2>
          </motion.div>

          {videos.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">No videos found.</p>
          ) : (
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <motion.div
                  key={video.youTubeId}
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  onClick={() => handleVideoClick(video)}
                  className="cursor-pointer group flex flex-col bg-[#111] border border-white/5 p-0 rounded-none shadow-xl transition-all duration-500 hover:shadow-[#d4af37]/20 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <motion.div
                      initial={{ scale: 1.2, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
                    >
                      <iframe
                        className="w-full h-64 pointer-events-none"
                        src={getVideoUrl(video.youTubeId)}
                        allowFullScreen
                        title={video.title}
                      />
                    </motion.div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                      className="text-xl font-serif text-white mb-4 line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300 tracking-wide"
                    >
                      {video.title}
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.15 + 0.4 }}
                      className="mt-auto"
                    >
                      <p className="text-sm text-gray-400 mb-4">
                        {Math.round(video.length / 60)} min • {video.views.toLocaleString()} views
                      </p>
                      <div className="pt-4 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        <button className="w-full py-3 bg-transparent border border-white/20 text-gray-300 text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all duration-300">
                          Watch Now
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RecipeVideosPage;
