import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// MAIN LAYOUT
// =====================================================

import MainLayout from "./Layouts/MainLayout";

// =====================================================
// FREELANCER LAYOUT
// =====================================================

import FreelancerLayout from "./Layouts/FreelancerLayout";

// =====================================================
// CLIENT LAYOUT
// =====================================================

import ClientLayout from "./Layouts/ClientLayout";

// =====================================================
// ADMIN LAYOUT
// =====================================================

import AdminLayout from "./Layouts/AdminLayout";

// =====================================================
// AUTH PAGES
// =====================================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =====================================================
// MAIN WEBSITE PAGES
// =====================================================

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Skills from "./pages/Skills";
import About from "./pages/About";
import Contact from "./pages/Contact";

// =====================================================
// GENERAL PROJECT PAGES
// =====================================================

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import ApplyProject from "./pages/ApplyProject";
import BrowseProjects from "./pages/BrowseProjects";
import MyApplications from "./pages/MyApplications";
import Freelancers from "./pages/Freelancers";

// =====================================================
// GENERAL FILES
// =====================================================

import Files from "./pages/Files";

// =====================================================
// GENERAL NOTIFICATIONS
// =====================================================

import Notification from "./pages/Notification";

// =====================================================
// CLIENT PAGES
// =====================================================

import Dashboard from "./pages/client/Dashboard";
import ClientMyProjects from "./pages/client/MyProjects";
import ClientProjectDetails from "./pages/client/ProjectDetails";
import PostProject from "./pages/client/PostProject";
import Applications from "./pages/client/Applications";
import Milestones from "./pages/client/Milestones";
import Reviews from "./pages/client/Reviews";
import Payments from "./pages/client/Payments";
import ClientProfile from "./pages/client/Profile";

// =====================================================
// CLIENT AI
// =====================================================

import AIRecommendedFreelancers from "./components/AIRecommendedFreelancers";

// =====================================================
// FREELANCER PAGES
// =====================================================

import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import FreelancerProjectDetails from "./pages/freelancer/ProjectDetails";
import FreelancerMyApplication from "./pages/freelancer/MyApplication";
import FreelancerBrowseProjects from "./pages/freelancer/BrowseProjects";
import FreelancerMyProjects from "./pages/freelancer/MyProjects";
import FreelancerProfile from "./pages/freelancer/Profile";
import FreelancerPortfolio from "./pages/freelancer/Portfolio";
import FreelancerMilestones from "./pages/freelancer/Milestones";

// =====================================================
// FREELANCER AI
// =====================================================

import AIRecommendedProjects from "./components/AIRecommendedProjects";

// =====================================================
// CHAT
// =====================================================

import ChatBox from "./components/chat/ChatBox";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminProjects from "./pages/admin/Projects";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminProjectDetails from "./pages/admin/AdminProjectDetails";

// =====================================================
// APP
// =====================================================

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =====================================================
                    MAIN WEBSITE
                ===================================================== */}

                <Route element={<MainLayout />}>

                    {/* ================= HOME ================= */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/home"
                        element={<Home />}
                    />

                    {/* ================= COURSES ================= */}

                    <Route
                        path="/courses"
                        element={<Courses />}
                    />

                    {/* ================= SKILLS ================= */}

                    <Route
                        path="/skills"
                        element={<Skills />}
                    />

                    {/* ================= PROJECTS ================= */}

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/projects/:id"
                        element={<ProjectDetails />}
                    />

                    <Route
                        path="/projects/:id/apply"
                        element={<ApplyProject />}
                    />

                    {/* ================= BROWSE PROJECTS ================= */}

                    <Route
                        path="/browse-projects"
                        element={<BrowseProjects />}
                    />

                    {/* ================= MY APPLICATIONS ================= */}

                    <Route
                        path="/my-applications"
                        element={<MyApplications />}
                    />

                    {/* ================= FREELANCERS ================= */}

                    <Route
                        path="/freelancers"
                        element={<Freelancers />}
                    />

                    {/* ================= FILES ================= */}

                    <Route
                        path="/files"
                        element={<Files />}
                    />

                    {/* ================= ABOUT ================= */}

                    <Route
                        path="/about"
                        element={<About />}
                    />

                    {/* ================= CONTACT ================= */}

                    <Route
                        path="/contact"
                        element={<Contact />}
                    />

                    {/* ================= NOTIFICATIONS ================= */}

                    <Route
                        path="/notifications"
                        element={<Notification />}
                    />

                </Route>


                {/* =====================================================
                    CLIENT ROUTES
                ===================================================== */}

                <Route element={<ClientLayout />}>

                    {/* ================= CLIENT DASHBOARD ================= */}

                    <Route
                        path="/client/dashboard"
                        element={<Dashboard />}
                    />

                    {/* ================= CLIENT PROJECTS ================= */}

                    <Route
                        path="/client/projects"
                        element={<ClientMyProjects />}
                    />

                    {/* ================= CLIENT PROJECT DETAILS ================= */}

                    <Route
                        path="/client/projects/:id"
                        element={<ClientProjectDetails />}
                    />

                    {/* ================= AI RECOMMENDED FREELANCERS ================= */}

                    <Route
                        path="/client/projects/:projectId/recommended-freelancers"
                        element={<AIRecommendedFreelancers />}
                    />

                    {/* ================= POST PROJECT ================= */}

                    <Route
                        path="/client/post-project"
                        element={<PostProject />}
                    />

                    {/* ================= CLIENT APPLICATIONS ================= */}

                    <Route
                        path="/client/applications"
                        element={<Applications />}
                    />

                    {/* ================= CLIENT MILESTONES ================= */}

                    <Route
                        path="/client/milestones"
                        element={<Milestones />}
                    />

                    <Route
                        path="/client/projects/:projectId/milestones"
                        element={<Milestones />}
                    />

                    {/* ================= CLIENT REVIEWS ================= */}

                    <Route
                        path="/client/reviews"
                        element={<Reviews />}
                    />

                    {/* ================= CLIENT PAYMENTS ================= */}

                    <Route
                        path="/client/payments"
                        element={<Payments />}
                    />

                    {/* ================= CLIENT PROFILE ================= */}

                    <Route
                        path="/client/profile"
                        element={<ClientProfile />}
                    />

                    {/* ================= CLIENT NOTIFICATIONS ================= */}

                    <Route
                        path="/client/notifications"
                        element={<Notification />}
                    />

                </Route>


                {/* =====================================================
                    ADMIN ROUTES
                ===================================================== */}

                <Route element={<AdminLayout />}>

                    {/* ================= ADMIN DASHBOARD ================= */}

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    {/* ================= ADMIN USERS ================= */}

                    <Route
                        path="/admin/users"
                        element={<AdminUsers />}
                    />

                    {/* ================= ADMIN PROJECTS ================= */}

                    <Route
                        path="/admin/projects"
                        element={<AdminProjects />}
                    />

                    {/* ================= ADMIN ANALYTICS ================= */}

                    <Route
                        path="/admin/analytics"
                        element={<AdminAnalytics />}
                    />

                    {/* ================= ADMIN PROJECT DETAILS ================= */}

                    <Route
                        path="/admin/projects/:id"
                        element={<AdminProjectDetails />}
                    />

                </Route>


                {/* =====================================================
                    FREELANCER ROUTES
                ===================================================== */}

                <Route element={<FreelancerLayout />}>

                    {/* ================= FREELANCER DASHBOARD ================= */}

                    <Route
                        path="/freelancer/dashboard"
                        element={<FreelancerDashboard />}
                    />

                    {/* ================= AI RECOMMENDATIONS ================= */}

                    <Route
                        path="/freelancer/recommendations"
                        element={<AIRecommendedProjects />}
                    />

                    {/* ================= BROWSE PROJECTS ================= */}

                    <Route
                        path="/freelancer/browse-projects"
                        element={<FreelancerBrowseProjects />}
                    />

                    {/* ================= PROJECT DETAILS ================= */}

                    <Route
                        path="/freelancer/projects/:id"
                        element={<FreelancerProjectDetails />}
                    />

                    {/* ================= MY APPLICATIONS ================= */}

                    <Route
                        path="/freelancer/my-applications"
                        element={<FreelancerMyApplication />}
                    />

                    {/* ================= MY PROJECTS ================= */}

                    <Route
                        path="/freelancer/my-projects"
                        element={<FreelancerMyProjects />}
                    />

                    {/* ================= PROFILE ================= */}

                    <Route
                        path="/freelancer/profile"
                        element={<FreelancerProfile />}
                    />

                    {/* ================= PORTFOLIO ================= */}

                    <Route
                        path="/freelancer/portfolio"
                        element={<FreelancerPortfolio />}
                    />

                    {/* ================= MILESTONES ================= */}

                    <Route
                        path="/freelancer/projects/:projectId/milestones"
                        element={<FreelancerMilestones />}
                    />

                </Route>


                {/* =====================================================
                    CHAT
                ===================================================== */}

                <Route
                    path="/chat/:receiverId"
                    element={<ChatBox />}
                />


                {/* =====================================================
                    AUTHENTICATION
                ===================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =====================================================
                    FALLBACK
                ===================================================== */}

                <Route
                    path="*"
                    element={<Login />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;