import API from "./api";

// =====================================================
// GET CONVERSATION
// =====================================================

export const getConversation = async (userId) => {
    try {
        const response = await API.get(
            `/messages/conversation/${userId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "GET CONVERSATION ERROR:",
            error?.response?.data ||
            error.message
        );

        throw error;
    }
};


// =====================================================
// SEND MESSAGE
// =====================================================

export const sendMessage = async ({
    receiverId,
    message,
}) => {

    try {

        const response = await API.post(
            "/messages/send",
            {
                receiverId,
                message,
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "SEND MESSAGE ERROR:",
            error?.response?.data ||
            error.message
        );

        throw error;
    }
};


// =====================================================
// MARK MESSAGE AS READ
// =====================================================

export const markAsRead = async (messageId) => {

    try {

        const response = await API.put(
            `/messages/read/${messageId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "MARK AS READ ERROR:",
            error?.response?.data ||
            error.message
        );

        throw error;
    }
};