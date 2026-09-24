import React, { useState } from "react";
import ReviewForm from "../components/ReviewForm";

const Reviews = () => {
  // Project ID
  // Testing-ku unga completed project ID inga podunga
  const [projectId, setProjectId] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">

        {/* ================= PAGE HEADER ================= */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Reviews & Ratings
          </h1>

          <p className="mt-2 text-slate-400">
            Share your experience with the freelancer
          </p>
        </div>

        {/* ================= PROJECT ID ================= */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

          <label className="mb-2 block text-sm font-medium text-slate-300">
            Project ID
          </label>

          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="Enter your project ID"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            Enter the completed project ID to submit a review.
          </p>

        </div>

        {/* ================= REVIEW FORM ================= */}

        {projectId ? (
          <ReviewForm projectId={projectId} />
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center">
            <div className="text-4xl">
              ⭐
            </div>

            <h2 className="mt-3 text-lg font-semibold text-white">
              Ready to Review?
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Enter a project ID above to give your review.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Reviews;