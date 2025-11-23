'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Play, Eye, Clock, Star } from 'lucide-react';

export default function VideoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [similarVideos, setSimilarVideos] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedVideo');
    const similar = sessionStorage.getItem('similarVideos');
    if (stored) setVideo(JSON.parse(stored));
    if (similar) setSimilarVideos(JSON.parse(similar));
  }, [id]);

  useEffect(() => {
    const handleFsChange = () => {
      const fsElement =
        document.fullscreenElement || document.webkitFullscreenElement;
      if (!fsElement && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'pauseVideo',
            args: [],
          }),
          '*'
        );
        window.scrollBy({ top: 100, behavior: 'smooth' });
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const handlePlay = () => {
    setShowPlayer(true);
    setTimeout(() => {
      iframeRef.current?.requestFullscreen?.();
    }, 200);
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#d4af37] text-xl">Loading...</p>
      </div>
    );
  }

  const getVideoUrl = (id) =>
    `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Hero Section */}
      {!showPlayer ? (
        <div
          className="relative h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/40"></div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={handlePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 flex items-center gap-3 bg-[#d4af37] text-black px-10 py-5 font-bold uppercase tracking-widest hover:bg-[#f1c40f] transition-all duration-300 shadow-lg shadow-[#d4af37]/30"
          >
            <Play className="w-6 h-6" fill="currentColor" />
            Play Video
          </motion.button>
        </div>
      ) : (
        <div className="w-full h-screen bg-black">
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            src={getVideoUrl(video.youTubeId)}
            title={video.title}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      )}

      {/* Video Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full px-6 md:px-10 py-12 bg-[#111] border-y border-white/5"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 font-serif tracking-tight">
          {video.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {video.title !== video.shortTitle && (
              <div className="bg-[#0a0a0a] p-6 border border-white/5">
                <span className="block font-bold text-[#d4af37] mb-2 uppercase tracking-wider text-sm">Short Title</span>
                <p className="text-gray-300 text-lg">{video.shortTitle}</p>
              </div>
            )}
            <div className="bg-[#0a0a0a] p-6 border border-white/5 flex items-center gap-4">
              <Star className="w-6 h-6 text-[#d4af37]" />
              <div>
                <span className="block font-bold text-[#d4af37] mb-1 uppercase tracking-wider text-sm">Rating</span>
                <p className="text-gray-300 text-lg">{video.rating}</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-[#0a0a0a] p-6 border border-white/5 flex items-center gap-4">
              <Eye className="w-6 h-6 text-[#d4af37]" />
              <div>
                <span className="block font-bold text-[#d4af37] mb-1 uppercase tracking-wider text-sm">Views</span>
                <p className="text-gray-300 text-lg">{video.views.toLocaleString()} views</p>
              </div>
            </div>
            <div className="bg-[#0a0a0a] p-6 border border-white/5 flex items-center gap-4">
              <Clock className="w-6 h-6 text-[#d4af37]" />
              <div>
                <span className="block font-bold text-[#d4af37] mb-1 uppercase tracking-wider text-sm">Duration</span>
                <p className="text-gray-300 text-lg">
                  {Math.floor(video.length / 60)} min {video.length % 60} sec
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Similar Videos */}
      <section className="bg-[#0a0a0a] py-24 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-16"
          >
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm font-medium mb-4">
              More to Watch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center font-serif tracking-tight">
              Similar Videos
            </h2>
          </motion.div>

          {similarVideos.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">
              No similar videos found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarVideos.map((v, index) => (
                <motion.div
                  key={v.youTubeId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => {
                    sessionStorage.setItem('selectedVideo', JSON.stringify(v));
                    sessionStorage.setItem(
                      'similarVideos',
                      JSON.stringify(
                        similarVideos.filter((s) => s.youTubeId !== v.youTubeId)
                      )
                    );
                    router.push(`/videos/${v.youTubeId}`);
                  }}
                  className="cursor-pointer group flex flex-col bg-[#111] border border-white/5 p-0 shadow-xl transition-all duration-500 hover:shadow-[#d4af37]/20 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <iframe
                      className="w-full h-64 pointer-events-none"
                      src={`https://www.youtube.com/embed/${v.youTubeId}`}
                      allowFullScreen
                      title={v.title}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-serif text-white mb-4 line-clamp-2 group-hover:text-[#d4af37] transition-colors duration-300 tracking-wide">
                      {v.title}
                    </h3>
                    <div className="mt-auto pt-4 relative">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      <p className="text-sm text-gray-400">
                        {Math.round(v.length / 60)} min • {v.views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
