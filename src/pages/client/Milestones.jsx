import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    FaPlus,
    FaSpinner,
    FaCheck,
    FaClock,
    FaLayerGroup,
    FaMoneyBillWave,
    FaCircleCheck,
    FaRocket,
    FaCalendarDays,
    FaUserCheck,
    FaPaperPlane,
} from "react-icons/fa6";

import { getProjects } from "../../Services/projectService";

import {
    getMilestones,
    createMilestone,
    updateMilestone,
} from "../../Services/milestoneServices";

const Milestones = () => {
    // =====================================================
    // STATE
    // =====================================================

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [milestones, setMilestones] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingMilestones, setLoadingMilestones] = useState(false);
    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    // =====================================================
    // FORM STATE
    // =====================================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");

    // =====================================================
    // MESSAGE STATE
    // =====================================================

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // CURRENT USER
    // =====================================================

    const getCurrentUserId = () => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            return (
                user?._id ||
                user?.id ||
                user?.userId ||
                null
            );
        } catch (err) {
            console.error("USER PARSE ERROR:", err);
            return null;
        }
    };

    // =====================================================
    // ERROR MESSAGE
    // =====================================================

    const getErrorMessage = (err, fallback) => {
        return (
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            fallback
        );
    };

    // =====================================================
    // NORMALIZE PROJECT RESPONSE
    // =====================================================

    const normalizeProjects = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.projects)) {
            return response.projects;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.data?.projects)) {
            return response.data.projects;
        }

        if (Array.isArray(response?.data?.data)) {
            return response.data.data;
        }

        return [];
    };

    // =====================================================
    // NORMALIZE MILESTONE RESPONSE
    // =====================================================

    const normalizeMilestones = (response) => {
        if (Array.isArray(response)) {
            return response;
        }

        if (Array.isArray(response?.milestones)) {
            return response.milestones;
        }

        if (Array.isArray(response?.data)) {
            return response.data;
        }

        if (Array.isArray(response?.data?.milestones)) {
            return response.data.milestones;
        }

        if (Array.isArray(response?.data?.data)) {
            return response.data.data;
        }

        return [];
    };

    // =====================================================
    // LOAD CLIENT PROJECTS
    // =====================================================

    useEffect(() => {
        const loadProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProjects();

                console.log(
                    "================================="
                );
                console.log("PROJECT API RESPONSE:", response);
                console.log(
                    "================================="
                );

                const allProjects =
                    normalizeProjects(response);

                console.log(
                    "ALL PROJECTS:",
                    allProjects
                );

                const currentUserId =
                    getCurrentUserId();

                console.log(
                    "CURRENT USER ID:",
                    currentUserId
                );

                // FILTER CLIENT PROJECTS
                let clientProjects =
                    allProjects.filter((project) => {
                        const projectClient =
                            project?.client;

                        const clientId =
                            typeof projectClient ===
                            "object"
                                ? projectClient?._id ||
                                  projectClient?.id
                                : projectClient;

                        return (
                            String(clientId) ===
                            String(currentUserId)
                        );
                    });

                // FALLBACK
                if (
                    clientProjects.length === 0 &&
                    allProjects.length > 0
                ) {
                    console.log(
                        "CLIENT FILTER RETURNED 0."
                    );

                    console.log(
                        "USING ALL PROJECTS AS FALLBACK."
                    );

                    clientProjects =
                        allProjects;
                }

                console.log(
                    "FINAL CLIENT PROJECTS:",
                    clientProjects
                );

                setProjects(clientProjects);

                // SELECT FIRST PROJECT
                if (clientProjects.length > 0) {
                    const firstProject =
                        clientProjects[0];

                    const firstProjectId =
                        firstProject?._id ||
                        firstProject?.id;

                    setSelectedProject(
                        firstProjectId || ""
                    );
                } else {
                    setSelectedProject("");
                }
            } catch (err) {
                console.error(
                    "LOAD PROJECTS ERROR:",
                    err
                );

                setError(
                    getErrorMessage(
                        err,
                        "Failed to load your projects."
                    )
                );

                setProjects([]);
                setSelectedProject("");
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    // =====================================================
    // LOAD MILESTONES
    // =====================================================

    useEffect(() => {
        if (!selectedProject) {
            setMilestones([]);
            return;
        }

        const loadMilestones = async () => {
            try {
                setLoadingMilestones(true);
                setError("");

                console.log(
                    "================================="
                );

                console.log(
                    "LOADING MILESTONES FOR PROJECT:",
                    selectedProject
                );

                const response =
                    await getMilestones(
                        selectedProject
                    );

                console.log(
                    "MILESTONE API RESPONSE:",
                    response
                );

                const milestoneData =
                    normalizeMilestones(response);

                console.log(
                    "NORMALIZED MILESTONES:",
                    milestoneData
                );

                setMilestones(
                    milestoneData
                );
            } catch (err) {
                console.error(
                    "LOAD MILESTONES ERROR:",
                    err
                );

                setError(
                    getErrorMessage(
                        err,
                        "Failed to load milestones."
                    )
                );

                setMilestones([]);
            } finally {
                setLoadingMilestones(false);
            }
        };

        loadMilestones();
    }, [selectedProject]);

    // =====================================================
    // REFRESH MILESTONES
    // =====================================================

    const refreshMilestones = async () => {
        if (!selectedProject) {
            return;
        }

        try {
            setLoadingMilestones(true);

            const response =
                await getMilestones(
                    selectedProject
                );

            console.log(
                "REFRESH MILESTONE RESPONSE:",
                response
            );

            const milestoneData =
                normalizeMilestones(response);

            setMilestones(
                milestoneData
            );
        } catch (err) {
            console.error(
                "REFRESH MILESTONES ERROR:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to refresh milestones."
                )
            );
        } finally {
            setLoadingMilestones(false);
        }
    };

    // =====================================================
    // CREATE MILESTONE
    // =====================================================

    const handleCreateMilestone = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedProject) {
            setError(
                "Please select a project."
            );
            return;
        }

        if (!title.trim()) {
            setError(
                "Milestone title is required."
            );
            return;
        }

        if (
            !amount ||
            Number(amount) <= 0
        ) {
            setError(
                "Please enter a valid milestone amount."
            );
            return;
        }

        if (!dueDate) {
            setError(
                "Please select a milestone due date."
            );
            return;
        }

        try {
            setCreating(true);

            const milestoneData = {
                title: title.trim(),

                description:
                    description.trim(),

                amount: Number(amount),

                dueDate,
            };

            console.log(
                "================================="
            );

            console.log(
                "CREATE MILESTONE REQUEST"
            );

            console.log(
                "PROJECT ID:",
                selectedProject
            );

            console.log(
                "DATA:",
                milestoneData
            );

            const response =
                await createMilestone(
                    selectedProject,
                    milestoneData
                );

            console.log(
                "CREATE MILESTONE RESPONSE:",
                response
            );

            setSuccess(
                "Milestone created successfully!"
            );

            setTitle("");
            setDescription("");
            setAmount("");
            setDueDate("");

            await refreshMilestones();

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(
                "CREATE MILESTONE ERROR:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to create milestone."
                )
            );
        } finally {
            setCreating(false);
        }
    };

    // =====================================================
    // UPDATE MILESTONE STATUS
    // =====================================================

    const handleStatusUpdate = async (
        milestoneId,
        status
    ) => {
        try {
            setUpdatingId(milestoneId);
            setError("");
            setSuccess("");

            console.log(
                "UPDATING MILESTONE:",
                {
                    milestoneId,
                    status,
                }
            );

            const response =
                await updateMilestone(
                    milestoneId,
                    {
                        status,
                    }
                );

            console.log(
                "UPDATE MILESTONE RESPONSE:",
                response
            );

            setSuccess(
                "Milestone status updated successfully!"
            );

            await refreshMilestones();

            setTimeout(() => {
                setSuccess("");
            }, 3000);
        } catch (err) {
            console.error(
                "UPDATE MILESTONE ERROR:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Failed to update milestone."
                )
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // =====================================================
    // SELECTED PROJECT
    // =====================================================

    const selectedProjectData =
        projects.find((project) => {
            const projectId =
                project?._id ||
                project?.id;

            return (
                String(projectId) ===
                String(selectedProject)
            );
        });

    // =====================================================
    // SELECTED FREELANCER
    // =====================================================

    const selectedFreelancer =
        selectedProjectData?.selectedFreelancer ||
        selectedProjectData?.freelancer ||
        selectedProjectData?.assignedFreelancer ||
        null;

    const hasSelectedFreelancer =
        Boolean(
            selectedFreelancer?._id ||
            selectedFreelancer?.id ||
            selectedFreelancer
        );

    // =====================================================
    // STATISTICS
    // =====================================================

    const completedCount =
        milestones.filter(
            (item) =>
                item?.status ===
                "completed"
        ).length;

    const inProgressCount =
        milestones.filter(
            (item) =>
                item?.status ===
                "in_progress"
        ).length;

    const submittedCount =
        milestones.filter(
            (item) =>
                item?.status ===
                "submitted"
        ).length;

    const pendingCount =
        milestones.filter(
            (item) =>
                !item?.status ||
                item?.status ===
                    "pending"
        ).length;

    const totalMilestoneAmount =
        milestones.reduce(
            (total, milestone) =>
                total +
                Number(
                    milestone?.amount || 0
                ),
            0
        );

    const progress =
        milestones.length > 0
            ? Math.round(
                  (completedCount /
                      milestones.length) *
                      100
              )
            : 0;

    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (
        status
    ) => {
        if (!status) {
            return "Pending";
        }

        return status
            .replaceAll("_", " ")
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };

    // =====================================================
    // STATUS CLASSES
    // =====================================================

    const getStatusClasses = (
        status
    ) => {
        switch (status) {
            case "completed":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "approved":
                return "bg-blue-50 text-blue-700 border-blue-200";

            case "submitted":
                return "bg-purple-50 text-purple-700 border-purple-200";

            case "in_progress":
                return "bg-amber-50 text-amber-700 border-amber-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (
        status
    ) => {
        switch (status) {
            case "completed":
                return <FaCheck />;

            case "submitted":
                return <FaPaperPlane />;

            case "approved":
                return <FaCircleCheck />;

            case "in_progress":
                return <FaRocket />;

            default:
                return <FaClock />;
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        date
    ) => {
        if (!date) {
            return "No due date";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Invalid date";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* =================================================
                    BACK
                ================================================= */}

                <Link
                    to="/client/dashboard"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
                >
                    ← Back to Dashboard
                </Link>

                {/* =================================================
                    HERO
                ================================================= */}

                <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                    <div className="relative">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                            <FaRocket />
                            Project Management
                        </div>

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                            <div>

                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Project Milestones
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                    Create milestones,
                                    monitor freelancer
                                    progress and approve
                                    completed work.
                                </p>

                            </div>

                            {/* PROJECT SELECT */}

                            <div className="w-full lg:w-80">

                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Active Project
                                </label>

                                {loading ? (

                                    <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-500">
                                        <FaSpinner className="animate-spin text-indigo-500" />
                                        Loading projects...
                                    </div>

                                ) : projects.length > 0 ? (

                                    <select
                                        value={
                                            selectedProject
                                        }
                                        onChange={(e) => {
                                            setSelectedProject(
                                                e.target.value
                                            );

                                            setSuccess("");
                                            setError("");
                                        }}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    >

                                        {projects.map(
                                            (project) => {

                                                const projectId =
                                                    project?._id ||
                                                    project?.id;

                                                return (
                                                    <option
                                                        key={
                                                            projectId
                                                        }
                                                        value={
                                                            projectId
                                                        }
                                                    >
                                                        {project?.title ||
                                                            "Untitled Project"}
                                                    </option>
                                                );
                                            }
                                        )}

                                    </select>

                                ) : (

                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                                        No projects found
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    NO PROJECT
                ================================================= */}

                {!loading &&
                    projects.length === 0 && (

                        <div className="mb-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                                <FaLayerGroup />
                            </div>

                            <h2 className="text-xl font-semibold text-slate-900">
                                No projects available
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                Create a project first,
                                then you can manage
                                milestones from this page.
                            </p>

                            <Link
                                to="/client/post-project"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                <FaPlus />
                                Create Project
                            </Link>

                        </div>
                    )}

                {/* =================================================
                    PROJECT CONTENT
                ================================================= */}

                {selectedProjectData && (
                    <>

                        {/* =================================================
                            FREELANCER STATUS
                        ================================================= */}

                        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <FaUserCheck />
                                    </div>

                                    <div>

                                        <p className="text-xs uppercase tracking-wider text-slate-400">
                                            Assigned Freelancer
                                        </p>

                                        <p className="mt-1 font-semibold text-slate-900">

                                            {hasSelectedFreelancer
                                                ? typeof selectedFreelancer ===
                                                  "object"
                                                    ? selectedFreelancer.name ||
                                                      selectedFreelancer.fullName ||
                                                      selectedFreelancer.username ||
                                                      "Freelancer Selected"
                                                    : "Freelancer Selected"
                                                : "No freelancer selected"}

                                        </p>

                                    </div>

                                </div>

                                {!hasSelectedFreelancer && (

                                    <Link
                                        to="/client/applications"
                                        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >
                                        View Applications
                                    </Link>

                                )}

                            </div>

                        </div>

                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                            {/* TOTAL */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Total
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    {milestones.length}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <FaLayerGroup />
                                </div>

                            </div>

                            {/* PENDING */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Pending
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-700">
                                    {pendingCount}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <FaClock />
                                </div>

                            </div>

                            {/* IN PROGRESS */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    In Progress
                                </p>

                                <p className="mt-2 text-2xl font-bold text-amber-600">
                                    {inProgressCount}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                    <FaRocket />
                                </div>

                            </div>

                            {/* SUBMITTED */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Submitted
                                </p>

                                <p className="mt-2 text-2xl font-bold text-purple-600">
                                    {submittedCount}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                    <FaPaperPlane />
                                </div>

                            </div>

                            {/* TOTAL VALUE */}

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Total Value
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-900">
                                    ₹
                                    {totalMilestoneAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <FaMoneyBillWave />
                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            PROGRESS
                        ================================================= */}

                        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

                            <div className="mb-5 flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-900">
                                        Overall Progress
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {completedCount} of{" "}
                                        {milestones.length}{" "}
                                        milestones completed
                                    </p>

                                </div>

                                <span className="text-2xl font-bold text-indigo-600">
                                    {progress}%
                                </span>

                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* =================================================
                            MAIN GRID
                        ================================================= */}

                        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

                            {/* =================================================
                                CREATE MILESTONE
                            ================================================= */}

                            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="mb-6">

                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                        <FaPlus />
                                    </div>

                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Add Milestone
                                    </h2>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Create a clear deliverable
                                        for your freelancer.
                                    </p>

                                </div>

                                {!hasSelectedFreelancer && (

                                    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

                                        <p className="text-sm leading-6 text-amber-700">
                                            No freelancer is currently
                                            shown as assigned to this
                                            project. You can still
                                            create the milestone.
                                        </p>

                                    </div>

                                )}

                                <form
                                    onSubmit={
                                        handleCreateMilestone
                                    }
                                    className="space-y-4"
                                >

                                    {/* TITLE */}

                                    <div>

                                        <label className="mb-2 block text-xs font-medium text-slate-600">
                                            Milestone Title
                                        </label>

                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. UI Design"
                                            required
                                            disabled={creating}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        />

                                    </div>

                                    {/* DESCRIPTION */}

                                    <div>

                                        <label className="mb-2 block text-xs font-medium text-slate-600">
                                            Description
                                        </label>

                                        <textarea
                                            value={
                                                description
                                            }
                                            onChange={(e) =>
                                                setDescription(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Describe the expected deliverable..."
                                            rows={4}
                                            disabled={creating}
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        />

                                    </div>

                                    {/* AMOUNT */}

                                    <div>

                                        <label className="mb-2 block text-xs font-medium text-slate-600">
                                            Amount
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                value={
                                                    amount
                                                }
                                                onChange={(e) =>
                                                    setAmount(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="5000"
                                                min="1"
                                                required
                                                disabled={creating}
                                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                            />

                                        </div>

                                    </div>

                                    {/* DUE DATE */}

                                    <div>

                                        <label className="mb-2 block text-xs font-medium text-slate-600">
                                            Due Date
                                        </label>

                                        <div className="relative">

                                            <FaCalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                            <input
                                                type="date"
                                                value={
                                                    dueDate
                                                }
                                                onChange={(e) =>
                                                    setDueDate(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                required
                                                disabled={creating}
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split(
                                                            "T"
                                                        )[0]
                                                }
                                                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                            />

                                        </div>

                                    </div>

                                    {/* BUTTON */}

                                    <button
                                        type="submit"
                                        disabled={
                                            creating
                                        }
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {creating ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus />
                                                Create Milestone
                                            </>
                                        )}

                                    </button>

                                </form>

                            </div>

                            {/* =================================================
                                MILESTONES
                            ================================================= */}

                            <div>

                                <div className="mb-5 flex items-center justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold text-slate-900">
                                            Milestone Timeline
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Track project progress
                                        </p>

                                    </div>

                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                                        {milestones.length} items
                                    </span>

                                </div>

                                {loadingMilestones ? (

                                    <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">

                                        <div className="flex items-center gap-3 text-sm text-slate-500">

                                            <FaSpinner className="animate-spin text-indigo-600" />

                                            Loading milestones...

                                        </div>

                                    </div>

                                ) : milestones.length === 0 ? (

                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

                                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                                            <FaLayerGroup />
                                        </div>

                                        <h3 className="text-lg font-semibold text-slate-900">
                                            No milestones yet
                                        </h3>

                                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                            Start by creating
                                            your first milestone
                                            from the panel.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="space-y-4">

                                        {milestones.map(
                                            (
                                                milestone,
                                                index
                                            ) => {

                                                const status =
                                                    milestone?.status ||
                                                    "pending";

                                                const isCompleted =
                                                    status ===
                                                    "completed";

                                                const isSubmitted =
                                                    status ===
                                                    "submitted";

                                                const isApproved =
                                                    status ===
                                                    "approved";

                                                const isUpdating =
                                                    updatingId ===
                                                    milestone?._id;

                                                return (

                                                    <div
                                                        key={
                                                            milestone?._id ||
                                                            index
                                                        }
                                                        className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-indigo-200 hover:shadow-md sm:p-6"
                                                    >

                                                        {/* NUMBER */}

                                                        <div className="absolute -left-3 top-6 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-indigo-600 shadow-sm lg:flex">
                                                            {index +
                                                                1}
                                                        </div>

                                                        {/* HEADER */}

                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                                            <div className="flex gap-4">

                                                                <div
                                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                                        isCompleted
                                                                            ? "bg-emerald-50 text-emerald-600"
                                                                            : isSubmitted
                                                                            ? "bg-purple-50 text-purple-600"
                                                                            : isApproved
                                                                            ? "bg-blue-50 text-blue-600"
                                                                            : status ===
                                                                              "in_progress"
                                                                            ? "bg-amber-50 text-amber-600"
                                                                            : "bg-indigo-50 text-indigo-600"
                                                                    }`}
                                                                >
                                                                    {getStatusIcon(
                                                                        status
                                                                    )}
                                                                </div>

                                                                <div>

                                                                    <h3 className="font-semibold text-slate-900">
                                                                        {
                                                                            milestone?.title
                                                                        }
                                                                    </h3>

                                                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                                                        {
                                                                            milestone?.description ||
                                                                            "No description provided."
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>

                                                            {/* STATUS */}

                                                            <span
                                                                className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                                                                    status
                                                                )}`}
                                                            >
                                                                {getStatusLabel(
                                                                    status
                                                                )}
                                                            </span>

                                                        </div>

                                                        {/* DETAILS */}

                                                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">

                                                            {/* AMOUNT */}

                                                            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">

                                                                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                                                    Amount
                                                                </p>

                                                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                                                    ₹
                                                                    {Number(
                                                                        milestone?.amount ||
                                                                            0
                                                                    ).toLocaleString(
                                                                        "en-IN"
                                                                    )}
                                                                </p>

                                                            </div>

                                                            {/* DUE DATE */}

                                                            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">

                                                                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                                                    Due Date
                                                                </p>

                                                                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-700">

                                                                    <FaCalendarDays className="text-indigo-500" />

                                                                    {formatDate(
                                                                        milestone?.dueDate
                                                                    )}

                                                                </p>

                                                            </div>

                                                            {/* PAYMENT */}

                                                            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">

                                                                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                                                    Payment
                                                                </p>

                                                                <p
                                                                    className={`mt-1 text-sm font-semibold ${
                                                                        milestone?.paymentStatus ===
                                                                        "paid"
                                                                            ? "text-emerald-600"
                                                                            : "text-amber-600"
                                                                    }`}
                                                                >
                                                                    {milestone?.paymentStatus ===
                                                                    "paid"
                                                                        ? "Paid"
                                                                        : "Pending"}
                                                                </p>

                                                            </div>

                                                            {/* ACTIONS */}

                                                            <div className="ml-auto flex flex-wrap gap-2">

                                                                {/* APPROVE */}

                                                                {isSubmitted && (

                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            isUpdating
                                                                        }
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                milestone._id,
                                                                                "approved"
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >

                                                                        {isUpdating ? (
                                                                            <FaSpinner className="animate-spin" />
                                                                        ) : (
                                                                            <FaCheck />
                                                                        )}

                                                                        Approve

                                                                    </button>

                                                                )}

                                                                {/* COMPLETE */}

                                                                {isApproved && (

                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            isUpdating
                                                                        }
                                                                        onClick={() =>
                                                                            handleStatusUpdate(
                                                                                milestone._id,
                                                                                "completed"
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >

                                                                        {isUpdating ? (
                                                                            <FaSpinner className="animate-spin" />
                                                                        ) : (
                                                                            <FaCircleCheck />
                                                                        )}

                                                                        Complete

                                                                    </button>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                    </>
                )}

                {/* =================================================
                    SUCCESS MESSAGE
                ================================================= */}

                {success && (

                    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-xl">

                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <FaCheck />
                            </div>

                            <p className="text-sm font-medium text-emerald-700">
                                {success}
                            </p>

                        </div>

                    </div>

                )}

                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {error && (

                    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-red-200 bg-white px-5 py-4 shadow-xl">

                        <div className="flex items-start gap-3">

                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                !
                            </div>

                            <p className="text-sm font-medium leading-5 text-red-600">
                                {error}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};

export default Milestones;