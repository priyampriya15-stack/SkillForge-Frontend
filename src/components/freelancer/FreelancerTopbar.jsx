import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";

export default function FreelancerTopbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  /* =========================================================
     GET LOGGED-IN USER
     ========================================================= */

  let user = {};

  try {
    user =
      JSON.parse(
        localStorage.getItem("user")
      ) || {};
  } catch (error) {
    console.error(
      "Unable to read user data:",
      error
    );

    user = {};
  }


  /* =========================================================
     USER DETAILS
     ========================================================= */

  const userName =
    user.name ||
    user.username ||
    "Freelancer";

  const firstName =
    userName.split(" ")[0] ||
    "Freelancer";

  const firstLetter =
    userName
      .charAt(0)
      .toUpperCase();


  /* =========================================================
     SEARCH
     ========================================================= */

  const handleSearch = (event) => {
    event.preventDefault();

    const searchValue =
      search.trim();

    if (!searchValue) {
      navigate(
        "/freelancer/browse-projects"
      );

      return;
    }

    navigate(
      `/freelancer/browse-projects?search=${encodeURIComponent(
        searchValue
      )}`
    );
  };


  /* =========================================================
     NOTIFICATION
     ========================================================= */

  const handleNotification = () => {
    navigate("/notifications");
  };


  /* =========================================================
     PROFILE
     ========================================================= */

  const handleProfile = () => {
    navigate("/freelancer/profile");
  };


  return (
    <header className="freelancer-topbar">

      {/* =====================================================
          LEFT SIDE
          ===================================================== */}

      <div className="freelancer-topbar-left">

        <div>

          <p className="topbar-label">
            Freelancer Workspace
          </p>

          <h1>
            Welcome back, {firstName} 👋
          </h1>

        </div>

      </div>


      {/* =====================================================
          RIGHT SIDE
          ===================================================== */}

      <div className="freelancer-topbar-right">

        {/* ===================================================
            SEARCH
            =================================================== */}

        <form
          className="freelancer-search"
          onSubmit={handleSearch}
        >

          <FaSearch />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search projects..."
            aria-label="Search projects"
          />

          <kbd>⌘ K</kbd>

        </form>


        {/* ===================================================
            NOTIFICATION
            =================================================== */}

        <button
          type="button"
          className="freelancer-notification"
          onClick={handleNotification}
          aria-label="Notifications"
          title="Notifications"
        >

          <FaBell />

          {/* Notification indicator */}
          <i />

        </button>


        {/* ===================================================
            USER PROFILE
            =================================================== */}

        <button
          type="button"
          className="freelancer-user"
          onClick={handleProfile}
          aria-label="Open freelancer profile"
        >

          {/* Avatar */}

          <div className="freelancer-avatar">
            {firstLetter}
          </div>


          {/* User information */}

          <div className="freelancer-user-info">

            <strong>
              {userName}
            </strong>

            <span>
              Freelancer
            </span>

          </div>


          {/* Dropdown icon */}

          <span className="freelancer-user-arrow">
            <FaChevronDown />
          </span>

        </button>

      </div>

    </header>
  );
}