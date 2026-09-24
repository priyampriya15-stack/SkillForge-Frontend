import { useEffect, useState } from "react";

import {
    FaStar,
    FaRegStar,
    FaCommentDots,
    FaUser,
    FaBriefcase,
    FaCalendarDays,
    FaTrash,
    FaRotate,
} from "react-icons/fa6";

import {
    getMyReviews,
    deleteReview,
} from "../../Services/reviewServices";

const Reviews = () => {
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);

    // =====================================================
    // LOAD REVIEWS
    // =====================================================

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getMyReviews();

            console.log(
                "REVIEWS PAGE DATA:",
                response
            );

            let reviewList = [];

            if (Array.isArray(response)) {
                reviewList = response;
            } else if (
                Array.isArray(
                    response?.reviews
                )
            ) {
                reviewList =
                    response.reviews;
            } else if (
                Array.isArray(
                    response?.data
                )
            ) {
                reviewList =
                    response.data;
            } else if (
                Array.isArray(
                    response?.data?.reviews
                )
            ) {
                reviewList =
                    response.data.reviews;
            }

            setReviews(reviewList);
        } catch (err) {
            console.error(
                "REVIEWS PAGE ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load reviews"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    // =====================================================
    // DELETE REVIEW
    // =====================================================

    const handleDelete = async (
        reviewId
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(reviewId);
            setError("");

            await deleteReview(reviewId);

            setReviews((prev) =>
                prev.filter(
                    (review) =>
                        review._id !==
                        reviewId
                )
            );
        } catch (err) {
            console.error(
                "DELETE REVIEW ERROR:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to delete review"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =====================================================
    // STAR DISPLAY
    // =====================================================

    const renderStars = (rating) => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <FaStar
                        key={i}
                        className="text-yellow-400"
                    />
                );
            } else {
                stars.push(
                    <FaRegStar
                        key={i}
                        className="text-slate-300"
                    />
                );
            }
        }

        return (
            <div className="flex items-center gap-1 text-lg">
                {stars}
            </div>
        );
    };

    // =====================================================
    // AVERAGE RATING
    // =====================================================

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce(
                      (total, review) =>
                          total +
                          Number(
                              review?.rating || 0
                          ),
                      0
                  ) / reviews.length
              ).toFixed(1)
            : "0.0";

    // =====================================================
    // LATEST RATING
    // =====================================================

    const latestRating =
        reviews.length > 0
            ? Number(
                  reviews[0]?.rating || 0
              )
            : 0;

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
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
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center">
                <div className="text-center">

                    <div className="flex justify-center mb-4">
                        <FaRotate className="animate-spin text-3xl text-indigo-600" />
                    </div>

                    <p className="text-sm font-medium text-slate-500">
                        Loading reviews...
                    </p>

                </div>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-[#f6f8fc] text-[#14213d]">

            <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 lg:px-10">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                <FaCommentDots />
                            </div>

                            <span className="text-sm font-semibold text-indigo-600">
                                Client Reviews
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-[#14213d] md:text-4xl">
                            Reviews
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Reviews submitted by you
                            for your freelancers.
                        </p>

                    </div>

                    <button
                        onClick={loadReviews}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                        <FaRotate />
                        Refresh
                    </button>

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">

                        {error}

                    </div>
                )}

                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

                    {/* TOTAL REVIEWS */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Total Reviews
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-[#14213d]">
                                    {reviews.length}
                                </h2>

                                <p className="mt-2 text-xs text-slate-400">
                                    Reviews submitted
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <FaCommentDots />
                            </div>

                        </div>

                    </div>

                    {/* AVERAGE RATING */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Average Rating Given
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-[#14213d]">
                                    {averageRating}
                                </h2>

                                <div className="mt-2">
                                    {reviews.length > 0
                                        ? renderStars(
                                              Number(
                                                  averageRating
                                              )
                                          )
                                        : (
                                            <span className="text-xs text-slate-400">
                                                No ratings
                                            </span>
                                        )}
                                </div>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
                                <FaStar />
                            </div>

                        </div>

                    </div>

                    {/* LATEST RATING */}

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Latest Rating
                                </p>

                                {reviews.length > 0 ? (
                                    <>
                                        <h2 className="mt-2 text-3xl font-bold text-[#14213d]">
                                            {latestRating}
                                            <span className="text-base font-medium text-slate-400">
                                                {" "}
                                                / 5
                                            </span>
                                        </h2>

                                        <div className="mt-2">
                                            {renderStars(
                                                latestRating
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className="mt-3 text-sm text-slate-400">
                                        No ratings
                                    </p>
                                )}

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FaStar />
                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {reviews.length === 0 ? (

                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                            <FaCommentDots className="text-2xl text-indigo-600" />
                        </div>

                        <h2 className="text-xl font-bold text-[#14213d]">
                            No reviews yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Reviews you submit for
                            freelancers will appear
                            here.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       REVIEW LIST
                    ================================================= */

                    <div className="space-y-5">

                        {reviews.map(
                            (review) => {

                                const freelancer =
                                    review?.freelancer;

                                const project =
                                    review?.project;

                                return (
                                    <div
                                        key={
                                            review._id
                                        }
                                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md md:p-7"
                                    >

                                        {/* =================================================
                                            TOP SECTION
                                        ================================================= */}

                                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                                            {/* FREELANCER */}

                                            <div className="flex gap-4">

                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                    <FaUser className="text-lg" />
                                                </div>

                                                <div>

                                                    <h2 className="text-lg font-bold text-[#14213d]">
                                                        {freelancer?.name ||
                                                            freelancer?.fullName ||
                                                            freelancer?.username ||
                                                            "Freelancer"}
                                                    </h2>

                                                    {freelancer?.email && (
                                                        <p className="mt-1 text-sm text-slate-500">
                                                            {
                                                                freelancer.email
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="mt-2">
                                                        {renderStars(
                                                            Number(
                                                                review?.rating ||
                                                                    0
                                                            )
                                                        )}
                                                    </div>

                                                </div>

                                            </div>

                                            {/* DELETE */}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        review._id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    review._id
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                <FaTrash />

                                                {deletingId ===
                                                review._id
                                                    ? "Deleting..."
                                                    : "Delete"}

                                            </button>

                                        </div>

                                        {/* =================================================
                                            PROJECT + DATE
                                        ================================================= */}

                                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                                            {/* PROJECT */}

                                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                                    <FaBriefcase />
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Project
                                                    </p>

                                                    <p className="mt-1 truncate text-sm font-semibold text-[#14213d]">
                                                        {project?.title ||
                                                            "Project"}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* DATE */}

                                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                                    <FaCalendarDays />
                                                </div>

                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Review Date
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-[#14213d]">
                                                        {formatDate(
                                                            review?.createdAt
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* =================================================
                                            COMMENT
                                        ================================================= */}

                                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">

                                            <div className="mb-3 flex items-center gap-2">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                                    <FaCommentDots />
                                                </div>

                                                <span className="text-sm font-semibold text-[#14213d]">
                                                    Your Review
                                                </span>

                                            </div>

                                            <p className="text-sm leading-7 text-slate-600">
                                                {review?.comment ||
                                                    "No comment provided."}
                                            </p>

                                        </div>

                                        {/* =================================================
                                            RATING FOOTER
                                        ================================================= */}

                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

                                            <div className="flex items-center gap-2 text-sm text-slate-500">

                                                <span>
                                                    Rating
                                                </span>

                                                <span className="font-bold text-yellow-500">
                                                    {review?.rating ||
                                                        0}
                                                    /5
                                                </span>

                                            </div>

                                            <div className="flex items-center gap-1">
                                                {renderStars(
                                                    Number(
                                                        review?.rating ||
                                                            0
                                                    )
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
    );
};

export default Reviews;