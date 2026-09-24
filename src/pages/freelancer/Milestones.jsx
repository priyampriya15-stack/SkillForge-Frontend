import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaCalendarDays,
    FaCheck,
    FaCircleCheck,
    FaClock,
    FaLayerGroup,
    FaMoneyBillWave,
    FaPaperPlane,
    FaRocket,
    FaSpinner,
} from "react-icons/fa6";

import {
    getMilestones,
    updateMilestone,
} from "../../Services/milestoneServices";


const Milestones = () => {
    const { projectId } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD MILESTONES
    // =====================================================

    useEffect(() => {
        if (!projectId) {
            setError("Project ID is missing.");
            setLoading(false);
            return;
        }

        loadMilestones();
    }, [projectId]);

    // =====================================================
    // GET MILESTONES
    // =====================================================

    const loadMilestones = async () => {
        try {
            setLoading(true);
            setError("");

            console.log(
                "FREELANCER MILESTONES PROJECT ID:",
                projectId
            );

            const data = await getMilestones(projectId);

            console.log(
                "FREELANCER MILESTONES RESPONSE:",
                data
            );

            const milestoneData =
                Array.isArray(data)
                    ? data
                    : data?.milestones || [];

            setMilestones(milestoneData);
        } catch (err) {
            console.error(
                "LOAD FREELANCER MILESTONES ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load milestones."
            );

            setMilestones([]);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UPDATE STATUS
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
                "FREELANCER MILESTONE UPDATE:",
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
                "MILESTONE UPDATE RESPONSE:",
                response
            );

            setSuccess(
                status === "in_progress"
                    ? "Milestone started successfully!"
                    : "Milestone submitted successfully!"
            );

            await loadMilestones();
        } catch (err) {
            console.error(
                "UPDATE MILESTONE ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update milestone."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending":
                return "Pending";

            case "in_progress":
                return "In Progress";

            case "submitted":
                return "Submitted";

            case "approved":
                return "Approved";

            case "completed":
                return "Completed";

            default:
                return "Pending";
        }
    };

    // =====================================================
    // STATUS CLASSES
    // =====================================================

    const getStatusClasses = (status) => {
        switch (status) {
            case "in_progress":
                return "border-amber-500/20 bg-amber-500/10 text-amber-400";

            case "submitted":
                return "border-purple-500/20 bg-purple-500/10 text-purple-400";

            case "approved":
                return "border-blue-500/20 bg-blue-500/10 text-blue-400";

            case "completed":
                return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

            default:
                return "border-slate-700 bg-slate-800 text-slate-400";
        }
    };

    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {
        switch (status) {
            case "in_progress":
                return <FaRocket />;

            case "submitted":
                return <FaPaperPlane />;

            case "approved":
                return <FaCircleCheck />;

            case "completed":
                return <FaCheck />;

            default:
                return <FaClock />;
        }
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "No due date";
        }

        const parsedDate = new Date(date);

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
    // STATISTICS
    // =====================================================

    const completedCount =
        milestones.filter(
            (item) =>
                item.status ===
                "completed"
        ).length;

    const inProgressCount =
        milestones.filter(
            (item) =>
                item.status ===
                "in_progress"
        ).length;

    const submittedCount =
        milestones.filter(
            (item) =>
                item.status ===
                "submitted"
        ).length;

    const pendingCount =
        milestones.filter(
            (item) =>
                !item.status ||
                item.status === "pending"
        ).length;

    const totalAmount =
        milestones.reduce(
            (total, milestone) =>
                total +
                Number(
                    milestone.amount || 0
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
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-[#020617] text-white">

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* =================================================
                    BACK
                ================================================= */}

                <Link
                    to="/freelancer/dashboard"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
                >
                    <FaArrowLeft />
                    Back to Dashboard
                </Link>

                {/* =================================================
                    HERO
                ================================================= */}

                <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-500/15 via-slate-900 to-purple-500/10 p-6 shadow-2xl sm:p-8">

                    <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

                    <div className="relative">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
                            <FaRocket />
                            Freelancer Workspace
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Project Milestones
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                            Track your assigned milestones,
                            start your work and submit
                            completed deliverables to the
                            client.
                        </p>

                    </div>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4">

                        <p className="text-sm font-medium text-red-400">
                            {error}
                        </p>

                    </div>
                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (
                    <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                        <p className="text-sm font-medium text-emerald-400">
                            {success}
                        </p>

                    </div>
                )}

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/50">

                        <div className="flex items-center gap-3 text-slate-400">

                            <FaSpinner className="animate-spin text-indigo-400" />

                            Loading milestones...

                        </div>

                    </div>

                ) : (

                    <>

                        {/* =================================================
                            STATS
                        ================================================= */}

                        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                            {/* TOTAL */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Total
                                </p>

                                <p className="mt-2 text-2xl font-bold">
                                    {milestones.length}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <FaLayerGroup />
                                </div>

                            </div>

                            {/* PENDING */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-2xl font-bold text-slate-300">
                                    {pendingCount}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
                                    <FaClock />
                                </div>

                            </div>

                            {/* IN PROGRESS */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    In Progress
                                </p>

                                <p className="mt-2 text-2xl font-bold text-amber-400">
                                    {inProgressCount}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                                    <FaRocket />
                                </div>

                            </div>

                            {/* SUBMITTED */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Submitted
                                </p>

                                <p className="mt-2 text-2xl font-bold text-purple-400">
                                    {submittedCount}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    <FaPaperPlane />
                                </div>

                            </div>

                            {/* VALUE */}

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">

                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Total Value
                                </p>

                                <p className="mt-2 text-2xl font-bold">
                                    ₹
                                    {totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>

                                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <FaMoneyBillWave />
                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            PROGRESS
                        ================================================= */}

                        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">

                            <div className="mb-5 flex items-center justify-between">

                                <div>

                                    <h2 className="text-sm font-semibold">
                                        Project Progress
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {completedCount} of{" "}
                                        {milestones.length}{" "}
                                        milestones completed
                                    </p>

                                </div>

                                <span className="text-2xl font-bold text-indigo-400">
                                    {progress}%
                                </span>

                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />

                            </div>

                        </div>

                        {/* =================================================
                            MILESTONES
                        ================================================= */}

                        {milestones.length === 0 ? (

                            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">

                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl text-indigo-400">
                                    <FaLayerGroup />
                                </div>

                                <h2 className="text-xl font-semibold">
                                    No milestones assigned
                                </h2>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                    The client has not created
                                    any milestones for this
                                    project yet.
                                </p>

                            </div>

                        ) : (

                            <div className="space-y-5">

                                {milestones.map(
                                    (
                                        milestone,
                                        index
                                    ) => {

                                        const status =
                                            milestone.status ||
                                            "pending";

                                        const isUpdating =
                                            updatingId ===
                                            milestone._id;

                                        const canStart =
                                            status ===
                                            "pending";

                                        const canSubmit =
                                            status ===
                                            "in_progress";

                                        return (
                                            <div
                                                key={
                                                    milestone._id
                                                }
                                                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-indigo-500/30 sm:p-6"
                                            >

                                                {/* HEADER */}

                                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                                    <div className="flex gap-4">

                                                        {/* NUMBER */}

                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-400">
                                                            {index +
                                                                1}
                                                        </div>

                                                        <div>

                                                            <h3 className="text-lg font-semibold text-white">
                                                                {
                                                                    milestone.title
                                                                }
                                                            </h3>

                                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                                                {
                                                                    milestone.description ||
                                                                    "No description provided."
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                    {/* STATUS */}

                                                    <div
                                                        className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${getStatusClasses(
                                                            status
                                                        )}`}
                                                    >

                                                        {getStatusIcon(
                                                            status
                                                        )}

                                                        {getStatusLabel(
                                                            status
                                                        )}

                                                    </div>

                                                </div>

                                                {/* DETAILS */}

                                                <div className="mt-6 grid gap-3 border-t border-slate-800 pt-5 sm:grid-cols-3">

                                                    {/* AMOUNT */}

                                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                            Milestone Amount
                                                        </p>

                                                        <p className="mt-2 flex items-center gap-2 text-lg font-bold text-white">

                                                            <FaMoneyBillWave className="text-emerald-400" />

                                                            ₹
                                                            {Number(
                                                                milestone.amount ||
                                                                    0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </p>

                                                    </div>

                                                    {/* DATE */}

                                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                            Due Date
                                                        </p>

                                                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-300">

                                                            <FaCalendarDays className="text-indigo-400" />

                                                            {formatDate(
                                                                milestone.dueDate
                                                            )}

                                                        </p>

                                                    </div>

                                                    {/* PAYMENT */}

                                                    <div className="rounded-2xl bg-slate-950/70 p-4">

                                                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                                                            Payment
                                                        </p>

                                                        <p
                                                            className={`mt-2 text-sm font-semibold ${
                                                                milestone.paymentStatus ===
                                                                "paid"
                                                                    ? "text-emerald-400"
                                                                    : "text-amber-400"
                                                            }`}
                                                        >
                                                            {milestone.paymentStatus ===
                                                            "paid"
                                                                ? "Paid"
                                                                : "Pending"}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ACTIONS */}

                                                <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-5">

                                                    {/* START WORK */}

                                                    {canStart && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    milestone._id,
                                                                    "in_progress"
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {isUpdating ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaRocket />
                                                            )}

                                                            Start Work

                                                        </button>
                                                    )}

                                                    {/* SUBMIT WORK */}

                                                    {canSubmit && (
                                                        <button
                                                            type="button"
                                                            disabled={
                                                                isUpdating
                                                            }
                                                            onClick={() =>
                                                                handleStatusUpdate(
                                                                    milestone._id,
                                                                    "submitted"
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >

                                                            {isUpdating ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaPaperPlane />
                                                            )}

                                                            Submit Work

                                                        </button>
                                                    )}

                                                    {/* SUBMITTED */}

                                                    {status ===
                                                        "submitted" && (
                                                        <div className="inline-flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-400">
                                                            <FaPaperPlane />
                                                            Waiting for Client Approval
                                                        </div>
                                                    )}

                                                    {/* APPROVED */}

                                                    {status ===
                                                        "approved" && (
                                                        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-400">
                                                            <FaCircleCheck />
                                                            Approved by Client
                                                        </div>
                                                    )}

                                                    {/* COMPLETED */}

                                                    {status ===
                                                        "completed" && (
                                                        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400">
                                                            <FaCheck />
                                                            Milestone Completed
                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </>
                )}

            </div>
        </div>
    );
};

export default Milestones;