import React, { useEffect, useState } from "react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../Services/notificationService";

import "./Notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Get Notifications
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(token);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark one notification as read
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, token);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(token);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications:", error);
    }
  };

  // Notification icon
  const getIcon = (type) => {
    switch (type) {
      case "proposal":
        return "📩";

      case "project":
        return "📁";

      case "milestone":
        return "🎯";

      case "message":
        return "💬";

      case "payment":
        return "💰";

      default:
        return "🔔";
    }
  };

  if (loading) {
    return (
      <div className="notification-loading">
        <div className="loading-icon">🔔</div>
        <h2>Loading Notifications...</h2>
      </div>
    );
  }

  return (
    <div className="notifications-page">

      {/* Header */}
      <div className="notifications-header">
        <div>
          <h1>Notifications 🔔</h1>
          <p>Stay updated with your latest activities.</p>
        </div>

        {notifications.length > 0 && (
          <button
            className="mark-all-btn"
            onClick={handleMarkAllAsRead}
          >
            ✓ Mark All as Read
          </button>
        )}
      </div>

      {/* Empty State */}
      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <div className="empty-icon">🔔</div>

          <h2>No Notifications</h2>

          <p>
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        <div className="notification-list">

          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${
                notification.isRead ? "read" : "unread"
              }`}
            >

              {/* Icon */}
              <div className="notification-icon">
                {getIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="notification-content">

                <p>{notification.message}</p>

                <span>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </span>

              </div>

              {/* Read Button */}
              {!notification.isRead && (
                <button
                  className="read-btn"
                  onClick={() =>
                    handleMarkAsRead(notification._id)
                  }
                >
                  Mark as Read
                </button>
              )}

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Notification;