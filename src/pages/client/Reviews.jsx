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
    FaSpinner,
    FaArrowTrendUp,
    FaQuoteLeft,
} from "react-icons/fa6";

import {
    getMyReviews,
    deleteReview,
} from "../../Services/reviewServices";

import "./Reviews.css";


const Reviews = () => {

    // =====================================================
    // STATE
    // =====================================================

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
                        review._id !== reviewId
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

        const safeRating =
            Number(rating) || 0;

        for (
            let i = 1;
            i <= 5;
            i++
        ) {

            if (i <= safeRating) {

                stars.push(
                    <FaStar
                        key={i}
                        className="review-star filled"
                    />
                );

            } else {

                stars.push(
                    <FaRegStar
                        key={i}
                        className="review-star empty"
                    />
                );

            }
        }

        return (
            <div className="stars">
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

            <div className="reviews-page">

                <div className="reviews-loading">

                    <div className="loading-spinner">
                        <FaSpinner />
                    </div>

                    <h3>
                        Loading reviews
                    </h3>

                    <p>
                        Fetching your review history...
                    </p>

                </div>

            </div>

        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="reviews-page">

            <div className="reviews-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="reviews-hero">

                    <div className="reviews-hero-left">

                        <div className="reviews-hero-icon">
                            <FaCommentDots />
                        </div>

                        <div>

                            <div className="reviews-eyebrow">

                                <span className="green-dot"></span>

                                CLIENT FEEDBACK

                            </div>

                            <h1>
                                Reviews
                            </h1>

                            <p>
                                Manage and review the feedback
                                you've given to your freelancers.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadReviews}
                        className="refresh-button"
                    >

                        <FaRotate />

                        Refresh

                    </button>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="reviews-error">

                        <div className="error-symbol">
                            !
                        </div>

                        <div>

                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="review-summary-grid">


                    {/* TOTAL */}

                    <div className="summary-card">

                        <div className="summary-content">

                            <span>
                                TOTAL REVIEWS
                            </span>

                            <strong>
                                {reviews.length}
                            </strong>

                            <p>
                                Reviews submitted
                            </p>

                        </div>

                        <div className="summary-icon purple">
                            <FaCommentDots />
                        </div>

                    </div>


                    {/* AVERAGE */}

                    <div className="summary-card">

                        <div className="summary-content">

                            <span>
                                AVERAGE RATING
                            </span>

                            <strong>
                                {averageRating}
                                <small>/5</small>
                            </strong>

                            <div className="summary-stars">

                                {reviews.length > 0
                                    ? renderStars(
                                        Number(
                                            averageRating
                                        )
                                    )
                                    : (
                                        <span>
                                            No ratings yet
                                        </span>
                                    )}

                            </div>

                        </div>

                        <div className="summary-icon yellow">
                            <FaStar />
                        </div>

                    </div>


                    {/* LATEST */}

                    <div className="summary-card">

                        <div className="summary-content">

                            <span>
                                LATEST RATING
                            </span>

                            <strong>
                                {latestRating}
                                <small>/5</small>
                            </strong>

                            <div className="summary-stars">

                                {reviews.length > 0
                                    ? renderStars(
                                        latestRating
                                    )
                                    : (
                                        <span>
                                            No ratings yet
                                        </span>
                                    )}

                            </div>

                        </div>

                        <div className="summary-icon green">
                            <FaArrowTrendUp />
                        </div>

                    </div>


                </section>


                {/* =================================================
                    SECTION HEADER
                ================================================= */}

                <div className="section-title-row">

                    <div>

                        <span>
                            REVIEW HISTORY
                        </span>

                        <h2>
                            Your Reviews
                        </h2>

                    </div>

                    <div className="review-count">

                        {reviews.length}

                        {reviews.length === 1
                            ? " Review"
                            : " Reviews"}

                    </div>

                </div>


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {reviews.length === 0 ? (

                    <section className="reviews-empty">

                        <div className="empty-icon">
                            <FaCommentDots />
                        </div>

                        <h2>
                            No reviews yet
                        </h2>

                        <p>
                            Reviews you submit for freelancers
                            will appear here.
                        </p>

                    </section>

                ) : (

                    /* =================================================
                       REVIEW LIST
                    ================================================= */

                    <div className="review-list">

                        {reviews.map(
                            (review, index) => {

                                const freelancer =
                                    review?.freelancer;

                                const project =
                                    review?.project;

                                const rating =
                                    Number(
                                        review?.rating || 0
                                    );

                                return (

                                    <article
                                        key={
                                            review?._id ||
                                            index
                                        }
                                        className="review-card"
                                    >


                                        {/* CARD TOP */}

                                        <div className="review-card-top">


                                            {/* FREELANCER */}

                                            <div className="freelancer-section">

                                                <div className="freelancer-avatar">

                                                    {freelancer?.name
                                                        ? freelancer.name
                                                            .charAt(0)
                                                            .toUpperCase()
                                                        : <FaUser />}

                                                </div>

                                                <div className="freelancer-details">

                                                    <div className="freelancer-label">
                                                        FREELANCER
                                                    </div>

                                                    <h3>

                                                        {freelancer?.name ||
                                                            freelancer?.fullName ||
                                                            freelancer?.username ||
                                                            "Freelancer"}

                                                    </h3>

                                                    {freelancer?.email && (

                                                        <p>
                                                            {
                                                                freelancer.email
                                                            }
                                                        </p>

                                                    )}

                                                    <div className="rating-row">

                                                        {renderStars(
                                                            rating
                                                        )}

                                                        <span className="rating-value">
                                                            {rating.toFixed(1)}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        review._id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    review._id
                                                }
                                                className="delete-button"
                                            >

                                                {deletingId ===
                                                review._id ? (

                                                    <>
                                                        <FaSpinner className="spin" />
                                                        Deleting
                                                    </>

                                                ) : (

                                                    <>
                                                        <FaTrash />
                                                        Delete
                                                    </>

                                                )}

                                            </button>

                                        </div>


                                        {/* INFO GRID */}

                                        <div className="review-info-grid">


                                            {/* PROJECT */}

                                            <div className="info-box">

                                                <div className="info-icon">
                                                    <FaBriefcase />
                                                </div>

                                                <div>

                                                    <span>
                                                        PROJECT
                                                    </span>

                                                    <strong>
                                                        {project?.title ||
                                                            "Project"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* DATE */}

                                            <div className="info-box">

                                                <div className="info-icon">
                                                    <FaCalendarDays />
                                                </div>

                                                <div>

                                                    <span>
                                                        REVIEW DATE
                                                    </span>

                                                    <strong>
                                                        {formatDate(
                                                            review?.createdAt
                                                        )}
                                                    </strong>

                                                </div>

                                            </div>


                                        </div>


                                        {/* COMMENT */}

                                        <div className="comment-box">

                                            <div className="comment-header">

                                                <div className="comment-icon">
                                                    <FaQuoteLeft />
                                                </div>

                                                <span>
                                                    Your Review
                                                </span>

                                            </div>

                                            <p>

                                                {review?.comment ||
                                                    "No comment provided."}

                                            </p>

                                        </div>


                                        {/* FOOTER */}

                                        <div className="review-footer">

                                            <div className="footer-rating">

                                                <span>
                                                    Your Rating
                                                </span>

                                                <strong>
                                                    {rating}/5
                                                </strong>

                                            </div>


                                            <div className="footer-stars">

                                                {renderStars(
                                                    rating
                                                )}

                                            </div>

                                        </div>

                                    </article>

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