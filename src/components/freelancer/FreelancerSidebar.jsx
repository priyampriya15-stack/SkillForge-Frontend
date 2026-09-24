import { NavLink, useNavigate } from "react-router-dom";

import {
  FaThLarge,
  FaSearch,
  FaFileAlt,
  FaBriefcase,
  FaFolderOpen,
  FaUser,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaLaptopCode,
} from "react-icons/fa";


const FreelancerSidebar = () => {
  const navigate = useNavigate();


  /* =========================================================
     NAVIGATION ITEMS
     IMPORTANT:
     All routes are Freelancer routes only.
     ========================================================= */

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/freelancer/dashboard",
      icon: <FaThLarge />,
      end: true,
    },
    {
      label: "Browse Projects",
      path: "/freelancer/browse-projects",
      icon: <FaSearch />,
    },
    {
      label: "My Applications",
      path: "/freelancer/my-applications",
      icon: <FaFileAlt />,
    },
    {
      label: "My Projects",
      path: "/freelancer/my-projects",
      icon: <FaBriefcase />,
    },
    {
      label: "Portfolio",
      path: "/freelancer/portfolio",
      icon: <FaFolderOpen />,
    },
    {
      label: "Profile",
      path: "/freelancer/profile",
      icon: <FaUser />,
    },
  ];


  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = () => {
    try {
      // Remove authentication/user information.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Redirect to login page.
    navigate("/login", { replace: true });
  };


  return (
    <aside className="freelancer-sidebar">

      {/* =====================================================
          BRAND / LOGO
          ===================================================== */}

      <div className="freelancer-logo">

        <div className="freelancer-logo-icon">
          <FaLaptopCode />
        </div>

        <div>
          <h2>SkillForge</h2>
          <span>Freelancer Panel</span>
        </div>

      </div>


      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="freelancer-navigation">

        <p className="freelancer-menu-title">
          Main Menu
        </p>


        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `freelancer-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="freelancer-nav-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>

          </NavLink>
        ))}

      </nav>


      {/* =====================================================
          SIDEBAR BOTTOM
          ===================================================== */}

      <div className="freelancer-sidebar-bottom">

        {/* -----------------------------------------------------
            HELP CARD
            ----------------------------------------------------- */}

        <div className="freelancer-help-card">

          <div className="help-icon">
            <FaQuestionCircle />
          </div>

          <div>
            <strong>Need Help?</strong>
            <span>We're here for you</span>
          </div>

        </div>


        {/* -----------------------------------------------------
            LOGOUT
            ----------------------------------------------------- */}

        <button
          type="button"
          className="freelancer-logout"
          onClick={handleLogout}
        >

          <FaSignOutAlt />

          <span>
            Logout
          </span>

          <FaChevronRight
            style={{
              marginLeft: "auto",
              fontSize: "10px",
              opacity: 0.55,
            }}
          />

        </button>

      </div>

    </aside>
  );
};


export default FreelancerSidebar;