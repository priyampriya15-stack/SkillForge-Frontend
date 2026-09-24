import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  User,
  IndianRupee,
  Tag,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const AdminProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch project");
        }

        setProject(data.project || data);
      } catch (error) {
        console.error("Project details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-xl font-semibold text-slate-800">
          Project not found
        </h2>

        <button
          onClick={() => navigate("/admin/projects")}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const status = project.status?.toLowerCase();

  const getStatusStyle = () => {
    if (status === "completed") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "cancelled") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/projects")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={18} />
            Back to Projects
          </button>

          <span
            className={`px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getStatusStyle()}`}
          >
            {project.status || "Open"}
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Project Header */}
          <div className="p-7 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-2">
                  PROJECT DETAILS
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                  {project.title}
                </h1>

                <p className="mt-2 text-slate-500">
                  Project ID: {project._id || id}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-500">Project Budget</p>

                <p className="text-2xl font-bold text-slate-900 flex items-center justify-end gap-1">
                  <IndianRupee size={20} />
                  {Number(project.budget || 0).toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>

          {/* Project Information */}
          <div className="p-7">

            <h2 className="text-lg font-bold text-slate-900 mb-5">
              Project Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

              <InfoCard
                icon={<User size={19} />}
                title="Client"
                value={
                  project.client?.name ||
                  project.clientName ||
                  project.client?.username ||
                  "N/A"
                }
              />

              <InfoCard
                icon={<CalendarDays size={19} />}
                title="Created Date"
                value={
                  project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : "N/A"
                }
              />

              <InfoCard
                icon={<Clock size={19} />}
                title="Deadline"
                value={
                  project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : "Not specified"
                }
              />

              <InfoCard
                icon={<Tag size={19} />}
                title="Category"
                value={project.category || "General"}
              />

            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText size={20} />
                Description
              </h2>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-slate-600 leading-7">
                  {project.description || "No project description available."}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {(project.skills || []).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium"
                  >
                    {typeof skill === "string" ? skill : skill.name}
                  </span>
                ))}

                {(!project.skills || project.skills.length === 0) && (
                  <span className="text-slate-400">
                    No skills specified
                  </span>
                )}
              </div>
            </div>

            {/* Freelancer */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Assigned Freelancer
              </h2>

              <div className="border border-slate-200 rounded-xl p-5 flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {(
                    project.freelancer?.name ||
                    project.freelancerName ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {project.freelancer?.name ||
                      project.freelancerName ||
                      "Not assigned"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {project.freelancer?.email || "No freelancer assigned"}
                  </p>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3">

              <button
                onClick={() => navigate("/admin/projects")}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Back
              </button>

              {status === "open" && (
                <button
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  Manage Project
                </button>
              )}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <p className="font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default AdminProjectDetails;