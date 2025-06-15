'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function VideoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState(null);
  const [similarVideos, setSimilarVideos] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
      const inFullscreen = !!fsElement;
      setIsFullscreen(inFullscreen);

      if (!inFullscreen && iframeRef.current) {
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const getVideoUrl = (id) =>
    `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      {!showPlayer ? (
        <div
          className="relative h-screen bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        >
          <button
            onClick={handlePlay}
            className="text-white bg-black/60 px-8 py-4 rounded-full text-xl font-bold hover:bg-black transition"
          >
            ▶ Play Video
          </button>
        </div>
      ) : (
        <div
          className={`w-full h-screen bg-black transition-opacity duration-300 ${
            isFullscreen ? 'opacity-100' : 'opacity-70'
          }`}
        >
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
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">{video.title}</h1>
        <p className="text-gray-600 mt-1">
          {Math.round(video.length / 60)} min • {video.views} views
        </p>
      </div>

      {/* Similar Videos Grid */}
      <section className="bg-amber-50 py-10 px-4 min-h-screen">
        <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">
          Similar Videos
        </h2>
        {similarVideos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No similar videos found.
          </p>
        ) : (
          <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {similarVideos.map((v) => (
              <div
                key={v.youTubeId}
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
                className="cursor-pointer group flex flex-col bg-white border-l-8 border-amber-400 p-4 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-amber-500/90 hover:scale-105"
              >
                <iframe
                  className="rounded-md w-full h-48 mb-4 pointer-events-none"
                  src={`https://www.youtube.com/embed/${v.youTubeId}`}
                  allowFullScreen
                  title={v.title}
                />
                <h3 className="text-lg font-semibold text-amber-800 mb-2 group-hover:text-amber-600 transition-all">
                  {v.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {Math.round(v.length / 60)} min • {v.views} views
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
