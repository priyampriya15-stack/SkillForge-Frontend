import React, { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaSearch,
  FaUserTie,
  FaUser,
  FaToggleOn,
  FaToggleOff,
  FaSyncAlt,
} from "react-icons/fa";
import API from "../../Services/api";
import "./admin.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/admin/users");

      const data = response.data;

      setUsers(
        data?.users ||
          data?.data ||
          []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (user) => {
    try {
      setUpdatingId(user._id || user.id);

      const id = user._id || user.id;

      await API.put(`/admin/users/${id}/toggle`);

      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update user status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesRole =
        role === "all" ||
        user.role?.toLowerCase() === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const getInitials = (name = "User") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="admin-page">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <span className="admin-eyebrow">
              <FaUsers /> USER MANAGEMENT
            </span>

            <h1>Users</h1>

            <p>
              Manage clients, freelancers and platform accounts.
            </p>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchUsers}
            disabled={loading}
          >
            <FaSyncAlt /> Refresh
          </button>
        </div>

        {error && (
          <div className="admin-alert">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="admin-toolbar">

          <div className="admin-search">
            <FaSearch />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="admin-select"
          >
            <option value="all">All Roles</option>
            <option value="client">Clients</option>
            <option value="freelancer">Freelancers</option>
            <option value="admin">Admins</option>
          </select>

        </div>

        {/* Stats */}
        <div className="admin-mini-stats">

          <div>
            <FaUsers />
            <span>
              <strong>{users.length}</strong>
              Total Users
            </span>
          </div>

          <div>
            <FaUserTie />
            <span>
              <strong>
                {users.filter((u) => u.role === "freelancer").length}
              </strong>
              Freelancers
            </span>
          </div>

          <div>
            <FaUser />
            <span>
              <strong>
                {users.filter((u) => u.role === "client").length}
              </strong>
              Clients
            </span>
          </div>

        </div>

        {/* Table */}
        <div className="admin-table-card">

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-empty">
              <FaUsers />
              <h3>No users found</h3>
              <p>
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {

                    const id = user._id || user.id;
                    const isActive =
                      user.isActive !== false;

                    return (
                      <tr key={id}>

                        <td>
                          <div className="admin-user-cell">

                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                              />
                            ) : (
                              <div className="admin-avatar">
                                {getInitials(user.name)}
                              </div>
                            )}

                            <div>
                              <strong>
                                {user.name || "Unknown User"}
                              </strong>

                              <span>
                                {user.email}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span
                            className={`admin-role ${user.role}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-status ${
                              isActive
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            {isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          <button
                            className={`admin-toggle ${
                              isActive
                                ? "danger"
                                : "success"
                            }`}
                            onClick={() =>
                              toggleUser(user)
                            }
                            disabled={
                              updatingId === id ||
                              user.role === "admin"
                            }
                          >
                            {isActive ? (
                              <>
                                <FaToggleOn />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <FaToggleOff />
                                Activate
                              </>
                            )}
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Users;