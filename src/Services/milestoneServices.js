import API from "./api";

// =====================================================
// GET MILESTONES
// =====================================================

export const getMilestones = async (projectId) => {
    try {
        if (!projectId) {
            throw new Error("Project ID is required");
        }

        console.log(
            "========================================"
        );

        console.log(
            "GET MILESTONES PROJECT ID:",
            projectId
        );

        const response = await API.get(
            `/milestones/project/${projectId}`
        );

        console.log(
            "MILESTONE AXIOS RESPONSE:",
            response
        );

        console.log(
            "MILESTONE RESPONSE DATA:",
            response.data
        );

        // IMPORTANT
        // Return backend JSON directly
        return response.data;

    } catch (error) {

        console.error(
            "GET MILESTONES ERROR:",
            error.response?.data || error.message
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to load milestones",
            }
        );
    }
};


// =====================================================
// CREATE MILESTONE
// =====================================================

export const createMilestone = async (
    projectId,
    milestoneData
) => {
    try {

        if (!projectId) {
            throw new Error(
                "Project ID is required"
            );
        }

        console.log(
            "========================================"
        );

        console.log(
            "CREATE MILESTONE"
        );

        console.log(
            "PROJECT ID:",
            projectId
        );

        console.log(
            "MILESTONE DATA:",
            milestoneData
        );

        const response = await API.post(
            `/milestones/project/${projectId}`,
            milestoneData
        );

        console.log(
            "CREATE MILESTONE RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "CREATE MILESTONE ERROR:",
            error.response?.data || error.message
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to create milestone",
            }
        );
    }
};


// =====================================================
// UPDATE MILESTONE
// =====================================================

export const updateMilestone = async (
    milestoneId,
    updateData
) => {
    try {

        if (!milestoneId) {
            throw new Error(
                "Milestone ID is required"
            );
        }

        console.log(
            "========================================"
        );

        console.log(
            "UPDATE MILESTONE"
        );

        console.log(
            "MILESTONE ID:",
            milestoneId
        );

        console.log(
            "UPDATE DATA:",
            updateData
        );

        const response = await API.put(
            `/milestones/${milestoneId}`,
            updateData
        );

        console.log(
            "UPDATE MILESTONE RESPONSE:",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "UPDATE MILESTONE ERROR:",
            error.response?.data || error.message
        );

        throw (
            error.response?.data || {
                success: false,
                message: "Failed to update milestone",
            }
        );
    }
};