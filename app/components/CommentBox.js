"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, User, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CommentBox = ({ foodID }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchComments = useCallback(async () => {
    const res = await fetch(
      `${API_BASE_URL}/api/comments/${foodID}`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    setComments(data);
  }, [foodID, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsPosting(true);
    try {
      await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ foodId: foodID, text }),
      });

      setText("");
      await fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#111] border border-white/5 p-8 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="w-8 h-8 text-[#d4af37]" />
        <h3 className="text-4xl font-bold text-[#d4af37] font-serif tracking-tight">Comments</h3>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="w-full px-6 py-4 bg-[#0a0a0a] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
            rows={4}
          />
          <button
            type="submit"
            disabled={isPosting}
            className={`${
              isPosting
                ? "bg-[#d4af37]/50 cursor-not-allowed"
                : "bg-transparent border-2 border-[#d4af37] hover:bg-[#d4af37]"
            } text-[#d4af37] hover:text-black font-bold py-3 px-8 transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2`}
          >
            {isPosting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post Comment
              </>
            )}
          </button>
        </form>
      ) : (
        <p className="text-gray-400 mb-8">
          Please{" "}
          <a
            href="/login"
            className="text-[#d4af37] underline hover:text-[#f1c40f] transition-colors"
          >
            log in
          </a>{" "}
          to post a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#0a0a0a] p-6 border-l-2 border-[#d4af37]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#d4af37]/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#d4af37]" />
                </div>
                <div>
                  <p className="font-bold text-white">
                    {comment.user?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed ml-13">{comment.text}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </motion.div>
  );
};

export default CommentBox;
