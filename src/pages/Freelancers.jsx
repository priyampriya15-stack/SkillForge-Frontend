import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaSearch,
    FaStar,
    FaMapMarkerAlt,
    FaBriefcase,
    FaArrowRight,
    FaCheckCircle,
    FaTimesCircle,
    FaUsers,
    FaFilter,
    FaClock,
    FaRupeeSign,
    FaSlidersH,
    FaChevronDown,
} from "react-icons/fa";

import {
    getFreelancers,
    getFreelancerStats,
} from "../Services/freelancerServices";


// ======================================================
// HELPERS
// ======================================================

const normalizeFreelancer = (item = {}) => ({
    id: item._id || item.id,
    name: item.name || item.fullName || "Freelancer",
    email: item.email || "",
    bio: item.bio || "No bio available",
    skills: Array.isArray(item.skills)
        ? item.skills
        : typeof item.skills === "string"
            ? item.skills.split(",").map((skill) => skill.trim())
            : [],
    profileImage: item.profileImage || item.avatar || item.profilePicture || "",
    portfolio: item.portfolio || "",
    rating: Number(item.rating || item.averageRating || 0),
    reviews: Number(item.reviews || item.reviewCount || 0),
    completedJobs: Number(
        item.completedJobs || item.completedProjects || item.jobsCompleted || 0
    ),
    experience: item.experience || item.experienceYears || 0,
    rate: item.rate || item.hourlyRate || 0,
    location: item.location || "Remote",
    isVerified: Boolean(item.isVerified || item.verified),
    isAvailable:
        item.isAvailable === undefined
            ? true
            : Boolean(item.isAvailable),
});

const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "SF";

    return words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
};

const formatRate = (rate) => {
    if (!rate && rate !== 0) return "Rate not set";

    if (Number(rate) === 0) {
        return "Rate not set";
    }

    return `₹${Number(rate).toLocaleString("en-IN")}/hr`;
};

const formatExperience = (experience) => {
    if (
        experience === undefined ||
        experience === null ||
        experience === ""
    ) {
        return "Experience not specified";
    }

    const numericExperience = Number(experience);

    if (!Number.isNaN(numericExperience)) {
        return `${numericExperience} ${
            numericExperience === 1 ? "year" : "years"
        } experience`;
    }

    return experience;
};

const getImageUrl = (image) => {
    if (!image) return "";

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:")
    ) {
        return image;
    }

    const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    return `${apiUrl.replace(/\/api\/?$/, "")}/${image.replace(/^\/+/, "")}`;
};


// ======================================================
// COMPONENT
// ======================================================

const Freelancers = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [stats, setStats] = useState({});

    const [search, setSearch] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [selectedRating, setSelectedRating] = useState("");

    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    const [error, setError] = useState("");

    // ==================================================
    // LOAD FREELANCERS
    // ==================================================

    const loadFreelancers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getFreelancers({
                search,
                skill: selectedSkill,
                minRating: selectedRating,
            });

            const data =
                response?.data?.freelancers ||
                response?.data?.users ||
                response?.data ||
                response?.freelancers ||
                response?.users ||
                [];

            setFreelancers(
                Array.isArray(data)
                    ? data.map(normalizeFreelancer)
                    : []
            );
        } catch (err) {
            console.error("Failed to load freelancers:", err);

            setError(
                err?.response?.data?.message ||
                    "Unable to load freelancers. Please try again."
            );

            setFreelancers([]);
        } finally {
            setLoading(false);
        }
    };


    // ==================================================
    // LOAD STATS
    // ==================================================

    const loadStats = async () => {
        try {
            setStatsLoading(true);

            const response = await getFreelancerStats();

            const data =
                response?.data?.stats ||
                response?.data ||
                response?.stats ||
                {};

            setStats(data);
        } catch (err) {
            console.error("Failed to load freelancer stats:", err);
        } finally {
            setStatsLoading(false);
        }
    };


    // ==================================================
    // EFFECTS
    // ==================================================

    useEffect(() => {
        loadFreelancers();
    }, [search, selectedSkill, selectedRating]);

    useEffect(() => {
        loadStats();
    }, []);


    // ==================================================
    // SKILL OPTIONS
    // ==================================================

    const skillOptions = useMemo(() => {
        const skills = freelancers.flatMap(
            (freelancer) => freelancer.skills || []
        );

        return [...new Set(skills)]
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));
    }, [freelancers]);


    // ==================================================
    // CLIENT SIDE FALLBACK FILTER
    // ==================================================

    const filteredFreelancers = useMemo(() => {
        return freelancers.filter((freelancer) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                freelancer.name.toLowerCase().includes(searchText) ||
                freelancer.bio.toLowerCase().includes(searchText) ||
                freelancer.location.toLowerCase().includes(searchText) ||
                freelancer.skills.some((skill) =>
                    skill.toLowerCase().includes(searchText)
                );

            const matchesSkill =
                !selectedSkill ||
                freelancer.skills.some(
                    (skill) =>
                        skill.toLowerCase() ===
                        selectedSkill.toLowerCase()
                );

            const matchesRating =
                !selectedRating ||
                freelancer.rating >= Number(selectedRating);

            return (
                matchesSearch &&
                matchesSkill &&
                matchesRating
            );
        });
    }, [
        freelancers,
        search,
        selectedSkill,
        selectedRating,
    ]);


    // ==================================================
    // STATS
    // ==================================================

    const totalFreelancers =
        stats.totalFreelancers ??
        stats.total ??
        freelancers.length;

    const completedProjects =
        stats.completedProjects ??
        stats.completedJobs ??
        freelancers.reduce(
            (total, freelancer) =>
                total + freelancer.completedJobs,
            0
        );

    const averageRating =
        stats.averageRating ??
        stats.avgRating ??
        (
            freelancers.length
                ? freelancers.reduce(
                      (total, freelancer) =>
                          total + freelancer.rating,
                      0
                  ) / freelancers.length
                : 0
        );

    const successRate =
        stats.successRate ??
        (
            freelancers.length
                ? Math.min(
                      100,
                      Math.round(
                          freelancers.reduce(
                              (total, freelancer) =>
                                  total +
                                  freelancer.completedJobs,
                              0
                          ) /
                              freelancers.length
                      )
                  )
                : 0
        );


    // ==================================================
    // CLEAR FILTERS
    // ==================================================

    const clearFilters = () => {
        setSearch("");
        setSelectedSkill("");
        setSelectedRating("");
    };


    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900">

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="relative overflow-hidden bg-[#0f172a]">

                {/* Background decoration */}
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

                    <div className="max-w-3xl">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-indigo-200 backdrop-blur">
                            <FaUsers />
                            SkillForge Freelancer Marketplace
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Find the right
                            <span className="block text-indigo-400">
                                freelancer for your project
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            Discover skilled professionals, compare their
                            expertise, ratings and experience, and connect
                            with the right talent for your project.
                        </p>

                    </div>

                </div>
            </section>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">


                {/* ==================================================
                    STATS
                ================================================== */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Total freelancers */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Available Freelancers
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {statsLoading ? "—" : totalFreelancers}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <FaUsers size={20} />
                            </div>

                        </div>

                    </div>


                    {/* Projects */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Completed Projects
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {statsLoading ? "—" : completedProjects}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FaBriefcase size={20} />
                            </div>

                        </div>

                    </div>


                    {/* Rating */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Average Rating
                                </p>

                                <div className="mt-2 flex items-center gap-2">

                                    <span className="text-3xl font-bold text-slate-900">
                                        {statsLoading
                                            ? "—"
                                            : Number(averageRating).toFixed(1)}
                                    </span>

                                    <FaStar className="text-amber-400" />

                                </div>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                                <FaStar size={20} />
                            </div>

                        </div>

                    </div>


                    {/* Success rate */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Success Rate
                                </p>

                                <p className="mt-2 text-3xl font-bold text-slate-900">
                                    {statsLoading
                                        ? "—"
                                        : `${successRate}%`}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FaCheckCircle size={20} />
                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    SEARCH & FILTERS
                ================================================== */}

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <div className="flex items-center gap-2">

                                <FaSlidersH className="text-indigo-600" />

                                <h2 className="font-semibold text-slate-900">
                                    Find your freelancer
                                </h2>

                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Search and filter professionals based on
                                your project requirements.
                            </p>
                        </div>

                        {(search ||
                            selectedSkill ||
                            selectedRating) && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Clear all filters
                            </button>
                        )}

                    </div>


                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Search */}
                        <div className="relative md:col-span-1">

                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search by name, skill or location..."
                                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />

                        </div>


                        {/* Skill */}
                        <div className="relative">

                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <select
                                value={selectedSkill}
                                onChange={(e) =>
                                    setSelectedSkill(e.target.value)
                                }
                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            >

                                <option value="">
                                    All Skills
                                </option>

                                {skillOptions.map((skill) => (
                                    <option
                                        key={skill}
                                        value={skill}
                                    >
                                        {skill}
                                    </option>
                                ))}

                            </select>

                            <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                        </div>


                        {/* Rating */}
                        <div className="relative">

                            <FaStar className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" />

                            <select
                                value={selectedRating}
                                onChange={(e) =>
                                    setSelectedRating(e.target.value)
                                }
                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            >

                                <option value="">
                                    Any Rating
                                </option>

                                <option value="4">
                                    4.0+ Stars
                                </option>

                                <option value="4.5">
                                    4.5+ Stars
                                </option>

                                <option value="5">
                                    5.0 Stars
                                </option>

                            </select>

                            <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    RESULTS HEADER
                ================================================== */}

                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Freelancers
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {loading
                                ? "Finding freelancers..."
                                : `${filteredFreelancers.length} professionals found`}
                        </p>
                    </div>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && !loading && (
                    <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">

                        <div className="flex items-center gap-3">

                            <FaTimesCircle className="text-red-500" />

                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>

                        </div>

                        <button
                            onClick={loadFreelancers}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            Retry
                        </button>

                    </div>
                )}


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading && (
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                            >

                                <div className="flex gap-4">

                                    <div className="h-16 w-16 rounded-2xl bg-slate-200" />

                                    <div className="flex-1">
                                        <div className="h-4 w-32 rounded bg-slate-200" />
                                        <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
                                    </div>

                                </div>

                                <div className="mt-6 h-3 w-full rounded bg-slate-200" />
                                <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />

                                <div className="mt-6 flex gap-2">
                                    <div className="h-7 w-16 rounded-full bg-slate-200" />
                                    <div className="h-7 w-20 rounded-full bg-slate-200" />
                                    <div className="h-7 w-14 rounded-full bg-slate-200" />
                                </div>

                            </div>
                        ))}

                    </div>
                )}


                {/* ==================================================
                    EMPTY
                ================================================== */}

                {!loading &&
                    !error &&
                    filteredFreelancers.length === 0 && (
                        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <FaUsers size={26} />
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                No freelancers found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Try changing your search or filters to find
                                more professionals.
                            </p>

                            <button
                                onClick={clearFilters}
                                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}


                {/* ==================================================
                    FREELANCER CARDS
                ================================================== */}

                {!loading &&
                    filteredFreelancers.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {filteredFreelancers.map(
                                (freelancer) => {

                                    const imageUrl =
                                        getImageUrl(
                                            freelancer.profileImage
                                        );

                                    return (
                                        <article
                                            key={freelancer.id}
                                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                        >

                                            {/* Top accent */}
                                            <div className="h-1 bg-gradient-to-r from-indigo-600 to-violet-600" />

                                            <div className="p-6">

                                                {/* Profile */}
                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex min-w-0 items-center gap-4">

                                                        {imageUrl ? (
                                                            <img
                                                                src={imageUrl}
                                                                alt={freelancer.name}
                                                                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-slate-50"
                                                            />
                                                        ) : (
                                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white ring-4 ring-indigo-50">
                                                                {getInitials(
                                                                    freelancer.name
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">

                                                            <div className="flex items-center gap-1.5">

                                                                <h3 className="truncate text-base font-bold text-slate-900">
                                                                    {freelancer.name}
                                                                </h3>

                                                                {freelancer.isVerified && (
                                                                    <FaCheckCircle
                                                                        className="shrink-0 text-blue-500"
                                                                        title="Verified freelancer"
                                                                    />
                                                                )}

                                                            </div>

                                                            <div className="mt-1 flex items-center gap-1.5 text-sm">

                                                                <FaStar className="text-amber-400" />

                                                                <span className="font-semibold text-slate-800">
                                                                    {freelancer.rating.toFixed(
                                                                        1
                                                                    )}
                                                                </span>

                                                                <span className="text-slate-400">
                                                                    ({freelancer.reviews})
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Bio */}
                                                <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
                                                    {freelancer.bio}
                                                </p>


                                                {/* Location */}
                                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">

                                                    <FaMapMarkerAlt className="text-slate-400" />

                                                    <span>
                                                        {freelancer.location}
                                                    </span>

                                                </div>


                                                {/* Skills */}
                                                <div className="mt-5 flex flex-wrap gap-2">

                                                    {freelancer.skills
                                                        .slice(0, 4)
                                                        .map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}

                                                    {freelancer.skills.length >
                                                        4 && (
                                                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                                            +
                                                            {freelancer.skills
                                                                .length -
                                                                4}{" "}
                                                            more
                                                        </span>
                                                    )}

                                                </div>


                                                {/* Details */}
                                                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-slate-100 py-5">

                                                    <div>
                                                        <p className="text-xs font-medium text-slate-400">
                                                            Experience
                                                        </p>

                                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                                            {formatExperience(
                                                                freelancer.experience
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-medium text-slate-400">
                                                            Hourly Rate
                                                        </p>

                                                        <p className="mt-1 flex items-center text-sm font-semibold text-slate-800">
                                                            <FaRupeeSign className="mr-0.5 text-xs" />
                                                            {formatRate(
                                                                freelancer.rate
                                                            ).replace(
                                                                "₹",
                                                                ""
                                                            )}
                                                        </p>
                                                    </div>

                                                </div>


                                                {/* Availability */}
                                                <div className="flex items-center justify-between">

                                                    <div
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                            freelancer.isAvailable
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >

                                                        <span
                                                            className={`h-2 w-2 rounded-full ${
                                                                freelancer.isAvailable
                                                                    ? "bg-emerald-500"
                                                                    : "bg-slate-400"
                                                            }`}
                                                        />

                                                        {freelancer.isAvailable
                                                            ? "Available for work"
                                                            : "Currently unavailable"}

                                                    </div>

                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <FaClock />
                                                        Remote
                                                    </div>

                                                </div>


                                                {/* CTA */}
                                                <Link
                                                    to={`/freelancers/${freelancer.id}`}
                                                    className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white transition group-hover:bg-indigo-600"
                                                >
                                                    View Profile

                                                    <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />

                                                </Link>

                                            </div>

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </main>

        </div>
    );
};

export default Freelancers;