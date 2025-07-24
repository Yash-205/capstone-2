"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const CommentBox = ({ foodID }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false); // 👈 new loading state

  const fetchComments = async () => {
    const res = await fetch(`https://capstone-2-3-hmts.onrender.com/api/comments/${foodID}`, {
      credentials: "include",
    });
    const data = await res.json();
    setComments(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsPosting(true); // 👈 Start loading
    try {
      await fetch("https://capstone-2-3-hmts.onrender.com/api/comments", {
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
      setIsPosting(false); // 👈 Stop loading
    }
  };

  useEffect(() => {
    fetchComments();
  }, [foodID]);

  return (
    <div className="p-6 rounded-lg shadow-lg border-l-4 bg-amber-50 border-amber-600">
      <h3 className="text-2xl font-semibold text-amber-800 mb-4">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment..."
            className="w-full px-4 py-3 rounded-lg border border-amber-400 bg-white text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={3}
          />
          <button
            type="submit"
            disabled={isPosting}
            className={`${
              isPosting
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600"
            } text-white font-semibold py-2 px-6 rounded-lg transition flex items-center justify-center gap-2`}
          >
            {isPosting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              "Post Comment"
            )}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-600">
          Please{" "}
          <a
            href="/login"
            className="text-amber-600 underline hover:text-amber-800"
          >
            log in
          </a>{" "}
          to post a comment.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-400"
          >
            <p className="font-semibold text-amber-800">
              {comment.user?.name || "Anonymous"}
            </p>
            <p className="text-amber-900 mt-1">{comment.text}</p>
            <p className="text-xs text-amber-600 mt-2">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentBox;
