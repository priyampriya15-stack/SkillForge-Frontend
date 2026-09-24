// import React from "react";
// import AIRecommendedProjects from "./AIRecommendedProjects";

// const FreelancerDashboard = () => {
//     return (
//         <div className="freelancer-dashboard">

//             {/* =========================================
//                 DASHBOARD HEADER
//             ========================================= */}
//             <div className="dashboard-header">

//                 <div>
//                     <h1>Freelancer Dashboard</h1>

//                     <p>
//                         Welcome back! Manage your work,
//                         projects and recommendations.
//                     </p>
//                 </div>

//             </div>


//             {/* =========================================
//                 DASHBOARD STATS
//             ========================================= */}
//             <div className="dashboard-stats">

//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         💼
//                     </div>

//                     <div>
//                         <span>Total Projects</span>
//                         <h2>0</h2>
//                     </div>
//                 </div>


//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         📋
//                     </div>

//                     <div>
//                         <span>Active Projects</span>
//                         <h2>0</h2>
//                     </div>
//                 </div>


//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         💰
//                     </div>

//                     <div>
//                         <span>Total Earnings</span>
//                         <h2>₹0</h2>
//                     </div>
//                 </div>


//                 <div className="stat-card">
//                     <div className="stat-icon">
//                         ⭐
//                     </div>

//                     <div>
//                         <span>Rating</span>
//                         <h2>0.0</h2>
//                     </div>
//                 </div>

//             </div>


//             {/* =========================================
//                 AI RECOMMENDED PROJECTS
//             ========================================= */}

//             <div className="dashboard-section">

//                 <AIRecommendedProjects />

//             </div>


//             {/* =========================================
//                 QUICK ACTIONS
//             ========================================= */}

//             <div className="quick-actions">

//                 <div className="section-heading">

//                     <div>
//                         <h2>Quick Actions</h2>

//                         <p>
//                             Quickly access your freelancer tools.
//                         </p>
//                     </div>

//                 </div>


//                 <div className="quick-action-grid">

//                     <button
//                         className="quick-action-card"
//                         onClick={() => {
//                             window.location.href =
//                                 "/freelancer/projects";
//                         }}
//                     >
//                         <span className="quick-icon">
//                             🔍
//                         </span>

//                         <div>
//                             <h3>Find Projects</h3>

//                             <p>
//                                 Browse available projects.
//                             </p>
//                         </div>
//                     </button>


//                     <button
//                         className="quick-action-card"
//                         onClick={() => {
//                             window.location.href =
//                                 "/freelancer/portfolio";
//                         }}
//                     >
//                         <span className="quick-icon">
//                             📁
//                         </span>

//                         <div>
//                             <h3>Manage Portfolio</h3>

//                             <p>
//                                 Add and manage your work.
//                             </p>
//                         </div>
//                     </button>


//                     <button
//                         className="quick-action-card"
//                         onClick={() => {
//                             window.location.href =
//                                 "/freelancer/profile";
//                         }}
//                     >
//                         <span className="quick-icon">
//                             👤
//                         </span>

//                         <div>
//                             <h3>Edit Profile</h3>

//                             <p>
//                                 Update your skills and profile.
//                             </p>
//                         </div>
//                     </button>


//                     <button
//                         className="quick-action-card"
//                         onClick={() => {
//                             window.location.href =
//                                 "/freelancer/messages";
//                         }}
//                     >
//                         <span className="quick-icon">
//                             💬
//                         </span>

//                         <div>
//                             <h3>Messages</h3>

//                             <p>
//                                 Chat with clients.
//                             </p>
//                         </div>
//                     </button>

//                 </div>

//             </div>

//         </div>
//     );
// };

// export default FreelancerDashboard;


