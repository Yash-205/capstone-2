'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
          <div className="absolute inset-0 bg-black/60" />
          <button
            onClick={handlePlay}
            className="relative z-10 text-white bg-black/60 px-8 py-4 rounded-full text-xl font-bold hover:bg-black transition"
          >
            ▶ Play Video
          </button>
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
        <div className="w-full px-10 py-8 bg-amber-50 border-y shadow-sm">
        <h1 className="text-3xl font-bold text-amber-700 mb-6">
            {video.title}
        </h1>

        <div className="flex flex-col sm:flex-row justify-between gap-y-8 text-gray-800 text-lg">
            {/* Left Column */}
            <div className="w-full sm:w-[45%]">
            {video.title !== video.shortTitle && (
                <div className="mb-4">
                <span className="block font-semibold text-amber-700">Short Title:</span>
                <p>{video.shortTitle}</p>
                </div>
            )}
            <div>
                <span className="block font-semibold text-amber-700">Rating:</span>
                <p>{video.rating}</p>
            </div>
            </div>

            {/* Right Column */}
            <div className="w-full sm:w-[45%] sm:text-right">
            <div className="mb-4">
                <span className="block font-semibold text-amber-700">Views:</span>
                <p>{video.views.toLocaleString()} views</p>
            </div>
            <div>
                <span className="block font-semibold text-amber-700">Length:</span>
                <p>
                {Math.floor(video.length / 60)} min {video.length % 60} sec
                </p>
            </div>
            </div>
        </div>
        </div>

      {/* Similar Videos */}
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
