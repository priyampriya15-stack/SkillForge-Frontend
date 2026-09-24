import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaMoneyBillWave,
} from "react-icons/fa6";

import { applyToProject } from "../Services/projectService";

const ApplyProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!proposal.trim()) {
      setError("Please enter your proposal");
      return;
    }

    if (!bidAmount) {
      setError("Please enter your bid amount");
      return;
    }

    try {
      setLoading(true);

      const data = await applyToProject(id, {
        proposal: proposal.trim(),
        bidAmount: Number(bidAmount),
      });

      console.log("APPLICATION SUCCESS:", data);

      setSuccess("Application submitted successfully!");

      setProposal("");
      setBidAmount("");

      setTimeout(() => {
        navigate("/my-applications");
      }, 1500);
    } catch (error) {
      console.error("APPLICATION ERROR:", error);

      setError(
        error.message || "Failed to submit application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <Link
          to={`/projects/${id}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <FaArrowLeft />
          Back to Project
        </Link>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-10"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 inline-flex rounded-full bg-blue-500/10 p-3 text-blue-400">
              <FaPaperPlane />
            </div>

            <h1 className="text-3xl font-bold">
              Apply for Project
            </h1>

            <p className="mt-2 text-slate-400">
              Send your proposal to the client and tell them
              why you are the right freelancer for this project.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Proposal */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Your Proposal
              </label>

              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="Explain your experience, skills and how you will complete this project..."
                rows={7}
                className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Write a clear and professional proposal.
              </p>
            </div>

            {/* Bid Amount */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Your Bid Amount
              </label>

              <div className="relative">
                <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />

                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid amount"
                  min="1"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-4 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <FaPaperPlane />
                  Submit Application
                </>
              )}
            </button>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ApplyProject;