import React from "react";
import { Link } from "react-router-dom";

import {
    Search,
    ArrowRight,
    BriefcaseBusiness,
    ClipboardList,
    WalletCards,
    Star,
    FolderOpen,
    UserRound,
    MessageSquare,
    Sparkles,
} from "lucide-react";

import AIRecommendedProjects from "../../components/AIRecommendedProjects";

import "../../styles/FreelancerDashboard.css";


const FreelancerDashboard = () => {

    return (

        <div className="freelancer-dashboard">


            {/* =====================================================
                DASHBOARD HEADER
            ===================================================== */}

            <div className="dashboard-header">

                <div className="dashboard-header-content">

                    <div>

                        <span className="dashboard-eyebrow">
                            FREELANCER WORKSPACE
                        </span>

                        <h1>
                            Freelancer Dashboard
                        </h1>

                        <p>
                            Welcome back! Manage your work,
                            projects and AI-powered recommendations.
                        </p>

                    </div>


                    {/* FIND PROJECTS */}

                    <Link
                        to="/freelancer/browse-projects"
                        className="dashboard-find-projects"
                    >

                        <Search size={18} />

                        Find Projects

                        <ArrowRight size={17} />

                    </Link>

                </div>

            </div>


            {/* =====================================================
                DASHBOARD STATS
            ===================================================== */}

            <div className="dashboard-stats">


                {/* TOTAL PROJECTS */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <BriefcaseBusiness size={21} />

                    </div>

                    <div>

                        <span>
                            Total Projects
                        </span>

                        <h2>
                            0
                        </h2>

                        <p>
                            Projects completed
                        </p>

                    </div>

                </div>


                {/* ACTIVE PROJECTS */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <ClipboardList size={21} />

                    </div>

                    <div>

                        <span>
                            Active Projects
                        </span>

                        <h2>
                            0
                        </h2>

                        <p>
                            Currently working
                        </p>

                    </div>

                </div>


                {/* EARNINGS */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <WalletCards size={21} />

                    </div>

                    <div>

                        <span>
                            Total Earnings
                        </span>

                        <h2>
                            ₹0
                        </h2>

                        <p>
                            Lifetime earnings
                        </p>

                    </div>

                </div>


                {/* RATING */}

                <div className="stat-card">

                    <div className="stat-icon">

                        <Star size={21} />

                    </div>

                    <div>

                        <span>
                            Rating
                        </span>

                        <h2>
                            0.0
                        </h2>

                        <p>
                            Freelancer rating
                        </p>

                    </div>

                </div>


            </div>


            {/* =====================================================
                AI RECOMMENDED PROJECTS
            ===================================================== */}

            <div className="dashboard-section">


                {/* SECTION HEADER */}

                <div className="dashboard-section-header">

                    <div>

                        <div className="section-title-row">

                            <Sparkles size={18} />

                            <h2>
                                Recommended Projects
                            </h2>

                        </div>

                        <p>
                            AI-powered projects matched with your skills.
                        </p>

                    </div>


                    {/* =================================================
                        VIEW ALL
                    ================================================= */}

                    <Link
                        to="/freelancer/recommendations"
                        className="dashboard-view-all"
                    >

                        View all

                        <ArrowRight size={18} />

                    </Link>

                </div>


                {/* AI PROJECTS */}

                <AIRecommendedProjects />

            </div>


            {/* =====================================================
                QUICK ACTIONS
            ===================================================== */}

            <div className="quick-actions">


                <div className="section-heading">

                    <div>

                        <h2>
                            Quick Actions
                        </h2>

                        <p>
                            Quickly access your freelancer tools.
                        </p>

                    </div>

                </div>


                <div className="quick-action-grid">


                    {/* FIND PROJECTS */}

                    <Link
                        to="/freelancer/browse-projects"
                        className="quick-action-card"
                    >

                        <span className="quick-icon">

                            <Search size={21} />

                        </span>


                        <div>

                            <h3>
                                Find Projects
                            </h3>

                            <p>
                                Browse available projects.
                            </p>

                        </div>


                        <ArrowRight size={17} />

                    </Link>


                    {/* PORTFOLIO */}

                    <Link
                        to="/freelancer/portfolio"
                        className="quick-action-card"
                    >

                        <span className="quick-icon">

                            <FolderOpen size={21} />

                        </span>


                        <div>

                            <h3>
                                Manage Portfolio
                            </h3>

                            <p>
                                Add and manage your work.
                            </p>

                        </div>


                        <ArrowRight size={17} />

                    </Link>


                    {/* PROFILE */}

                    <Link
                        to="/freelancer/profile"
                        className="quick-action-card"
                    >

                        <span className="quick-icon">

                            <UserRound size={21} />

                        </span>


                        <div>

                            <h3>
                                Edit Profile
                            </h3>

                            <p>
                                Update your skills and profile.
                            </p>

                        </div>


                        <ArrowRight size={17} />

                    </Link>


                    {/* MESSAGES */}

                    <Link
                        to="/notifications"
                        className="quick-action-card"
                    >

                        <span className="quick-icon">

                            <MessageSquare size={21} />

                        </span>


                        <div>

                            <h3>
                                Messages
                            </h3>

                            <p>
                                Chat with clients.
                            </p>

                        </div>


                        <ArrowRight size={17} />

                    </Link>


                </div>

            </div>


        </div>

    );

};


export default FreelancerDashboard;