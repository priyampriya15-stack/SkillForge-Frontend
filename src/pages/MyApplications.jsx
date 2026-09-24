import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaBriefcase,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa6";

import {
  CheckCircle,
  XCircle,
} from "lucide-react";

import { getMyApplications } from "../Services/applicationService";


const MyApplications = () => {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH MY APPLICATIONS
  // =====================================================

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getMyApplications();

        console.log("MY APPLICATIONS:", data);

        setApplications(data.applications || []);

      } catch (error) {

        console.error("APPLICATION FETCH ERROR:", error);

        setError(
          error.message || "Failed to fetch your applications"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchApplications();

  }, []);


  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {

    switch (status?.toLowerCase()) {

      case "accepted":

        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

      case "rejected":

        return "bg-red-500/10 text-red-400 border-red-500/20";

      default:

        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

    }

  };


  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {

    switch (status?.toLowerCase()) {

      case "accepted":

        return <CheckCircle size={16} />;

      case "rejected":

        return <XCircle size={16} />;

      default:

        return <FaClock />;

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">

      <div className="mx-auto max-w-6xl">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          to="/browse-projects"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <FaArrowLeft />

          Browse Projects
        </Link>


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-10">

          <div className="mb-4 inline-flex rounded-full bg-blue-500/10 p-3 text-blue-400">

            <FaPaperPlane />

          </div>


          <h1 className="text-3xl font-bold md:text-4xl">

            My Applications

          </h1>


          <p className="mt-2 text-slate-400">

            Track all the projects you have applied for.

          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>


              <p className="text-sm text-slate-400">

                Loading your applications...

              </p>

            </div>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">

            <p className="text-red-400">

              {error}

            </p>


            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
            >

              Try Again

            </button>

          </div>

        )}


        {/* =================================================
            EMPTY APPLICATIONS
        ================================================= */}

        {!loading &&
          !error &&
          applications.length === 0 && (

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

              <FaBriefcase className="mx-auto mb-5 text-4xl text-slate-600" />


              <h2 className="text-xl font-semibold">

                No applications yet

              </h2>


              <p className="mt-2 text-sm text-slate-400">

                Browse projects and submit your first application.

              </p>


              <Link
                to="/browse-projects"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >

                Browse Projects

              </Link>

            </div>

          )}


        {/* =================================================
            APPLICATION LIST
        ================================================= */}

        {!loading &&
          !error &&
          applications.length > 0 && (

            <div className="space-y-5">


              {applications.map((application, index) => (

                <motion.div
                  key={application._id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >


                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">


                    {/* =================================================
                        PROJECT INFORMATION
                    ================================================= */}

                    <div className="flex-1">


                      <div className="mb-3 flex items-center gap-3">


                        {/* Icon */}

                        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">

                          <FaBriefcase />

                        </div>


                        {/* Project Name */}

                        <div>

                          <h2 className="text-xl font-bold">

                            {application.project?.title ||
                              application.project?.name ||
                              "Project"}

                          </h2>


                          <p className="text-xs text-slate-500">

                            Application ID: {application._id}

                          </p>

                        </div>

                      </div>


                      {/* =================================================
                          PROPOSAL
                      ================================================= */}

                      <div className="mt-5">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">

                          Your Proposal

                        </p>


                        <p className="text-sm leading-6 text-slate-300">

                          {application.proposal}

                        </p>

                      </div>


                      {/* =================================================
                          BID + STATUS
                      ================================================= */}

                      <div className="mt-6 flex flex-wrap gap-3">


                        {/* Bid */}

                        <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2">

                          <p className="text-xs text-slate-500">

                            Your Bid

                          </p>


                          <p className="font-semibold text-emerald-400">

                            ₹
                            {application.bidAmount?.toLocaleString(
                              "en-IN"
                            )}

                          </p>

                        </div>


                        {/* Status */}

                        <div
                          className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold capitalize ${getStatusStyle(
                            application.status
                          )}`}
                        >

                          {getStatusIcon(
                            application.status
                          )}

                          {application.status}

                        </div>


                      </div>


                      {/* =================================================
                          DATE
                      ================================================= */}

                      {application.createdAt && (

                        <p className="mt-5 text-xs text-slate-500">

                          Applied on{" "}

                          {new Date(
                            application.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}

                        </p>

                      )}

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          )}

      </div>

    </div>

  );

};


export default MyApplications;