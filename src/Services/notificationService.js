import API from "./api";

// GET MY NOTIFICATIONS
export const getNotifications = async () => {
  try {
    const response = await API.get("/notifications");

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Unable to fetch notifications",
    };
  }
};

// MARK ONE NOTIFICATION AS READ
export const markNotificationAsRead = async (id) => {
  try {
    const response = await API.put(
      `/notifications/${id}/read`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Unable to mark notification as read",
    };
  }
};

// MARK ALL NOTIFICATIONS AS READ
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await API.put(
      "/notifications/read-all"
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || {
      message: "Unable to mark all notifications as read",
    };
  }
};