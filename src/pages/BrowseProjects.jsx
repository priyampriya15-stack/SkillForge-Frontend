import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
    FaBriefcase,
    FaMagnifyingGlass,
    FaArrowRight,
    FaIndianRupeeSign,
} from "react-icons/fa6";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BrowseProjects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API_URL}/projects`,
                {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {},
                }
            );

            console.log("PROJECT API RESPONSE:", response.data);

            const projectData =
                response.data.projects ||
                response.data.data ||
                response.data ||
                [];

            setProjects(projectData);
            setFilteredProjects(projectData);
        } catch (err) {
            console.error("FETCH PROJECTS ERROR:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FILTER
    // =====================================================

    useEffect(() => {
        let result = [...projects];

        // Search
        if (search.trim()) {
            const keyword = search.toLowerCase();

            result = result.filter((project) =>
                `${project.title || ""} ${
                    project.description || ""
                } ${project.category || ""}`
                    .toLowerCase()
                    .includes(keyword)
            );
        }

        // Category
        if (category !== "all") {
            result = result.filter(
                (project) =>
                    String(project.category || "").toLowerCase() ===
                    category.toLowerCase()
            );
        }

        setFilteredProjects(result);
    }, [search, category, projects]);

    // =====================================================
    // CATEGORIES
    // =====================================================

    const categories = [
        ...new Set(
            projects
                .map((project) => project.category)
                .filter(Boolean)
        ),
    ];

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500"></div>

                    <p className="text-slate-400">
                        Loading projects...
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
                        <h2 className="text-xl font-bold text-red-400">
                            Unable to load projects
                        </h2>

                        <p className="mt-2 text-slate-400">
                            {error}
                        </p>

                        <button
                            onClick={fetchProjects}
                            className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-semibold hover:bg-emerald-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-10">
                    <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                        <FaBriefcase size={22} />
                    </div>

                    <h1 className="text-4xl font-bold">
                        Browse Projects
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Find projects that match your skills and submit your proposal.
                    </p>
                </div>

                {/* SEARCH + FILTER */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:flex-row">

                    {/* SEARCH */}
                    <div className="relative flex-1">
                        <FaMagnifyingGlass
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search projects..."
                            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition focus:border-emerald-500"
                        />
                    </div>

                    {/* CATEGORY */}
                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                    >
                        <option value="all">
                            All Categories
                        </option>

                        {categories.map((item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* RESULT COUNT */}
                <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm text-slate-400">
                        {filteredProjects.length} project
                        {filteredProjects.length !== 1
                            ? "s"
                            : ""}{" "}
                        found
                    </p>
                </div>

                {/* EMPTY */}
                {filteredProjects.length === 0 && (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-14 text-center">
                        <FaBriefcase className="mx-auto mb-5 text-4xl text-slate-600" />

                        <h2 className="text-xl font-semibold">
                            No projects found
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Try changing your search or category.
                        </p>
                    </div>
                )}

                {/* PROJECTS */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {filteredProjects.map((project) => (
                        <div
                            key={project._id}
                            className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40"
                        >

                            {/* ICON */}
                            <div className="mb-5 flex items-center justify-between">

                                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                                    <FaBriefcase />
                                </div>

                                {project.category && (
                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                                        {project.category}
                                    </span>
                                )}
                            </div>

                            {/* TITLE */}
                            <h2 className="line-clamp-2 text-xl font-bold">
                                {project.title ||
                                    project.name ||
                                    "Untitled Project"}
                            </h2>

                            {/* DESCRIPTION */}
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                                {project.description ||
                                    "No description available."}
                            </p>

                            {/* BUDGET */}
                            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Budget
                                    </p>

                                    <p className="mt-1 flex items-center gap-1 font-semibold text-emerald-400">
                                        <FaIndianRupeeSign />

                                        {Number(
                                            project.budget || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>
                                </div>

                                {/* VIEW BUTTON */}
                                <Link
                                    to={`/projects/${project._id}`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold transition hover:bg-emerald-500"
                                >
                                    View
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrowseProjects;