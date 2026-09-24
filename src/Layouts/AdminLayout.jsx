import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FolderKanban,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import "../pages/admin/admin.css";

const links = [
  {
    to: "/admin/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    ["token", "authToken"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-shell">

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`admin-sidebar ${
          mobileOpen ? "open" : ""
        }`}
      >

        {/* BRAND */}
        <div className="admin-brand">

          <div className="brand-mark">
            <Sparkles size={19} />
          </div>

          <div className="brand-content">
            <strong>SkillForge</strong>
            <span>Admin Console</span>
          </div>

        </div>

        {/* NAVIGATION */}
        <nav className="admin-nav">

          <p className="nav-label">
            Workspace
          </p>

          {links.map(
            ({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `admin-nav-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <span className="nav-icon">
                  <Icon size={18} />
                </span>

                <span className="nav-text">
                  {label}
                </span>
              </NavLink>
            )
          )}

        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-footer">

          {/* ADMIN PROFILE */}
          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div className="admin-user-info">
              <strong>Administrator</strong>
              <span>Platform control</span>
            </div>

          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="logout-link"
            onClick={logout}
          >
            <LogOut size={17} />
            <span>Sign out</span>
          </button>

        </div>

      </aside>

      {/* ================= MAIN ================= */}
      <main className="admin-main">

        {/* MOBILE HEADER */}
        <div className="admin-mobile-header">

          <button
            type="button"
            className="admin-mobile-toggle"
            onClick={() =>
              setMobileOpen((v) => !v)
            }
          >
            ☰
          </button>

          <div className="mobile-brand">
            <Sparkles size={17} />
            <span>SkillForge Admin</span>
          </div>

          <ShieldCheck
            size={19}
            className="mobile-shield"
          />

        </div>

        {/* PAGE CONTENT */}
        <div className="admin-content">
          <Outlet />
        </div>

      </main>

    </div>
  );
}