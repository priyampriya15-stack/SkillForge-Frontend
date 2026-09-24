import API from "./api";

// =====================================================
// GET MY REVIEWS
// =====================================================

export const getMyReviews = async () => {
    try {
        console.log("GETTING MY REVIEWS...");

        const response =
            await API.get("/reviews/my");

        console.log(
            "MY REVIEWS RESPONSE:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "GET MY REVIEWS ERROR:",
            error.response?.data ||
                error.message
        );

        throw (
            error.response?.data || {
                message:
                    "Failed to load reviews",
            }
        );
    }
};

// =====================================================
// GET CLIENT REVIEWS
// =====================================================

export const getClientReviews = async () => {
    try {
        const response =
            await API.get("/reviews/client");

        return response.data;
    } catch (error) {
        console.error(
            "GET CLIENT REVIEWS ERROR:",
            error.response?.data ||
                error.message
        );

        throw (
            error.response?.data || {
                message:
                    "Failed to load client reviews",
            }
        );
    }
};

// =====================================================
// GET FREELANCER REVIEWS
// =====================================================

export const getFreelancerReviews =
    async (freelancerId) => {
        try {
            const response =
                await API.get(
                    `/reviews/freelancer/${freelancerId}`
                );

            return response.data;
        } catch (error) {
            console.error(
                "GET FREELANCER REVIEWS ERROR:",
                error.response?.data ||
                    error.message
            );

            throw (
                error.response?.data || {
                    message:
                        "Failed to load freelancer reviews",
                }
            );
        }
    };

// =====================================================
// GET PROJECT REVIEW
// =====================================================

export const getProjectReview =
    async (projectId) => {
        try {
            const response =
                await API.get(
                    `/reviews/project/${projectId}`
                );

            return response.data;
        } catch (error) {
            console.error(
                "GET PROJECT REVIEW ERROR:",
                error.response?.data ||
                    error.message
            );

            throw (
                error.response?.data || {
                    message:
                        "Failed to load project review",
                }
            );
        }
    };

// =====================================================
// CREATE REVIEW
// =====================================================

export const createReview = async (
    reviewData
) => {
    try {
        console.log(
            "CREATING REVIEW:",
            reviewData
        );

        const response =
            await API.post(
                "/reviews",
                reviewData
            );

        console.log(
            "CREATE REVIEW RESPONSE:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "CREATE REVIEW ERROR:",
            error.response?.data ||
                error.message
        );

        throw (
            error.response?.data || {
                message:
                    "Failed to create review",
            }
        );
    }
};

// =====================================================
// DELETE REVIEW
// =====================================================

export const deleteReview = async (
    reviewId
) => {
    try {
        const response =
            await API.delete(
                `/reviews/${reviewId}`
            );

        return response.data;
    } catch (error) {
        console.error(
            "DELETE REVIEW ERROR:",
            error.response?.data ||
                error.message
        );

        throw (
            error.response?.data || {
                message:
                    "Failed to delete review",
            }
        );
    }
};