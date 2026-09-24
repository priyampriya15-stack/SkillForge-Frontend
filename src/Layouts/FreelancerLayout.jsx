import { Outlet } from "react-router-dom";

import FreelancerSidebar from "../components/freelancer/FreelancerSidebar";
import FreelancerTopbar from "../components/freelancer/freelancerTopbar";

import "../Styles/freelancer.css";

const FreelancerLayout = () => {
  return (
    <div className="freelancer-layout">

      {/* =====================================================
          FREELANCER SIDEBAR
          ===================================================== */}
      <FreelancerSidebar />

      {/* =====================================================
          FREELANCER MAIN AREA
          ===================================================== */}
      <div className="freelancer-main">

        {/* ===================================================
            TOPBAR
            =================================================== */}
        <FreelancerTopbar />

        {/* ===================================================
            PAGE CONTENT

            React Router will render:
            Dashboard
            Browse Projects
            Project Details
            My Applications
            My Projects
            Profile
            Portfolio

            inside this Outlet.
            =================================================== */}
        <main className="freelancer-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default FreelancerLayout;