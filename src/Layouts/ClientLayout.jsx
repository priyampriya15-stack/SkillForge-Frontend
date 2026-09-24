import React, { useEffect, useRef, useState } from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  Users,
  Target,
  Star,
  CreditCard,
  UserCircle,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

import "../Styles/client.css";


/* =========================================================
   CLIENT NAVIGATION
========================================================= */

const navigationItems = [
  {
    label: "Dashboard",
    path: "/client/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Projects",
    path: "/client/projects",
    icon: FolderKanban,
  },
  {
    label: "Post Project",
    path: "/client/post-project",
    icon: Plus,
  },
  {
    label: "Applications",
    path: "/client/applications",
    icon: Users,
  },
  {
    label: "Milestones",
    path: "/client/milestones",
    icon: Target,
  },
  {
    label: "Reviews",
    path: "/client/reviews",
    icon: Star,
  },
  {
    label: "Payments",
    path: "/client/payments",
    icon: CreditCard,
  },
  {
    label: "Profile",
    path: "/client/profile",
    icon: UserCircle,
  },
];


const ClientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const profileRef = useRef(null);


  /* =========================================================
     CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);


  /* =========================================================
     CLOSE MOBILE SIDEBAR + PROFILE
     WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setSidebarOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    try {
      /*
       * -----------------------------------------------------
       * REMOVE AUTHENTICATION DATA
       * -----------------------------------------------------
       */

      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("accessToken");

      localStorage.removeItem("user");
      localStorage.removeItem("currentUser");

      localStorage.removeItem("refreshToken");

      /*
       * -----------------------------------------------------
       * REMOVE SESSION DATA
       * -----------------------------------------------------
       */

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("accessToken");

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("currentUser");

      sessionStorage.removeItem("refreshToken");


      /*
       * -----------------------------------------------------
       * CLOSE UI
       * -----------------------------------------------------
       */

      setProfileOpen(false);
      setSidebarOpen(false);


      /*
       * -----------------------------------------------------
       * OPTIONAL STORAGE EVENT
       *
       * This helps other parts of the application know
       * that authentication has changed.
       * -----------------------------------------------------
       */

      window.dispatchEvent(
        new Event("auth-logout")
      );


      /*
       * -----------------------------------------------------
       * GO TO LOGIN
       *
       * replace = true means user cannot simply press
       * browser Back button and return to client page.
       * -----------------------------------------------------
       */

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      /*
       * Even if something goes wrong,
       * force user to login page.
       */

      navigate("/login", {
        replace: true,
      });
    }
  };


  /* =========================================================
     NAV LINK CLASS
  ========================================================= */

  const getNavClass = ({ isActive }) => {
    return isActive
      ? "client-nav-link client-nav-active"
      : "client-nav-link";
  };


  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="client-layout">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`client-sidebar ${
          sidebarOpen
            ? "client-sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="client-brand">

          <div className="client-brand-icon">
            <LayoutDashboard
              size={23}
              strokeWidth={2.2}
            />
          </div>

          <div className="client-brand-text">
            <h1>SkillForge</h1>
            <span>Client Portal</span>
          </div>


          {/* MOBILE CLOSE */}

          <button
            type="button"
            className="client-mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>


        {/* MENU TITLE */}

        <div className="client-menu-title">
          MAIN MENU
        </div>


        {/* NAVIGATION */}

        <nav className="client-navigation">

          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={getNavClass}
                onClick={() =>
                  setSidebarOpen(false)
                }
              >

                <span className="client-nav-icon">
                  <Icon
                    size={19}
                    strokeWidth={2}
                  />
                </span>

                <span className="client-nav-label">
                  {item.label}
                </span>

              </NavLink>
            );
          })}

        </nav>


        {/* ===================================================
            SIDEBAR BOTTOM
        =================================================== */}

        <div className="client-sidebar-bottom">


          {/* USER CARD */}

          <div className="client-sidebar-profile">

            <div className="client-sidebar-avatar">
              C
            </div>

            <div className="client-sidebar-user">

              <strong>
                Client
              </strong>

              <span>
                Project Owner
              </span>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="client-logout-button"
            onClick={handleLogout}
          >

            <LogOut
              size={19}
              strokeWidth={2}
            />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      <div
        className={`client-sidebar-overlay ${
          sidebarOpen
            ? "client-sidebar-overlay-visible"
            : ""
        }`}
        onClick={() =>
          setSidebarOpen(false)
        }
      />


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="client-main">


        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="client-header">


          {/* LEFT */}

          <div className="client-header-left">

            <button
              type="button"
              className="client-mobile-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>


            <div className="client-page-heading">

              <h2>
                Client Dashboard
              </h2>

              <p>
                Manage your projects and freelancers
              </p>

            </div>

          </div>


          {/* RIGHT */}

          <div className="client-header-right">


            {/* NOTIFICATION */}

            <button
              type="button"
              className="client-notification"
              aria-label="Notifications"
              onClick={() =>
                navigate(
                  "/client/notifications"
                )
              }
            >

              <Bell
                size={19}
                strokeWidth={2}
              />

              <span className="client-notification-dot" />

            </button>


            {/* PROFILE */}

            <div
              className="client-header-profile-wrapper"
              ref={profileRef}
            >

              <button
                type="button"
                className="client-header-profile"
                onClick={() =>
                  setProfileOpen(
                    (prev) => !prev
                  )
                }
              >

                <div className="client-header-avatar">
                  C
                </div>


                <div className="client-header-user">

                  <strong>
                    Client
                  </strong>

                  <span>
                    Project Owner
                  </span>

                </div>


                <ChevronDown
                  size={16}
                  className={`client-profile-chevron ${
                    profileOpen
                      ? "rotate"
                      : ""
                  }`}
                />

              </button>


              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (

                <div className="client-profile-dropdown">


                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={() => {

                      setProfileOpen(false);

                      navigate(
                        "/client/profile"
                      );

                    }}
                  >

                    <UserCircle size={17} />

                    <span>
                      Profile
                    </span>

                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="dropdown-logout"
                    onClick={handleLogout}
                  >

                    <LogOut size={17} />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <section className="client-content">
          <Outlet />
        </section>

      </main>

    </div>
  );
};


export default ClientLayout;