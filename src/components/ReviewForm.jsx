import React, { useState } from "react";
import { createReview } from "../Services/reviewServices";

const ReviewForm = ({ projectId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setMessage("Please enter your review");
      return;
    }

    if (!projectId) {
      setMessage("Project ID is missing");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const reviewData = {
        rating: Number(rating),
        comment: comment.trim(),
      };

      const response = await createReview(
        projectId,
        reviewData
      );

      setMessage(
        response.message || "Review created successfully!"
      );

      setComment("");
      setRating(5);

    } catch (error) {
      setMessage(
        error.message || "Failed to create review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

      <h2 className="text-xl font-semibold text-white">
        Give Your Review
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-5"
      >

        {/* Rating */}

        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Rating
          </label>

          <select
            value={rating}
            onChange={(e) =>
              setRating(Number(e.target.value))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white outline-none focus:border-indigo-500"
          >
            <option value={5}>⭐⭐⭐⭐⭐ - 5</option>
            <option value={4}>⭐⭐⭐⭐ - 4</option>
            <option value={3}>⭐⭐⭐ - 3</option>
            <option value={2}>⭐⭐ - 2</option>
            <option value={1}>⭐ - 1</option>
          </select>

        </div>

        {/* Comment */}

        <div className="mb-5">

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Comment
          </label>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            placeholder="Write your review..."
            rows="5"
            className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />

        </div>

        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting..."
            : "Submit Review"}
        </button>

      </form>

      {/* Message */}

      {message && (
        <p className="mt-4 text-center text-sm text-slate-300">
          {message}
        </p>
      )}

    </div>
  );
};

export default ReviewForm;