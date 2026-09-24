// import React from "react";
// import AIRecommendedProjects from "../../components/AIRecommendedProjects";

// const FreelancerDashboard = () => {
//   return (
//     <div className="freelancer-dashboard">

//       {/* ================= HEADER ================= */}
//       <div className="dashboard-header">
//         <div>
//           <h1>Freelancer Dashboard</h1>
//           <p>
//             Welcome back! Manage your projects, applications and
//             recommendations.
//           </p>
//         </div>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="dashboard-stats">

//         <div className="stat-card">
//           <div className="stat-icon">💼</div>
//           <div>
//             <span>Total Projects</span>
//             <h2>0</h2>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">📋</div>
//           <div>
//             <span>Active Projects</span>
//             <h2>0</h2>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">💰</div>
//           <div>
//             <span>Total Earnings</span>
//             <h2>₹0</h2>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon">⭐</div>
//           <div>
//             <span>Rating</span>
//             <h2>0.0</h2>
//           </div>
//         </div>

//       </div>

//       {/* ================= AI RECOMMENDATIONS ================= */}
//       <div className="dashboard-section">
//         <AIRecommendedProjects />
//       </div>

//       {/* ================= QUICK ACTIONS ================= */}
//       <div className="quick-actions">

//         <div className="section-heading">
//           <div>
//             <h2>Quick Actions</h2>
//             <p>Quickly access your freelancer tools.</p>
//           </div>
//         </div>

//         <div className="quick-action-grid">

//           {/* Browse Projects */}
//           <button
//             className="quick-action-card"
//             onClick={() => {
//               window.location.href = "/freelancer/browse-projects";
//             }}
//           >
//             <span className="quick-icon">🔍</span>

//             <div>
//               <h3>Find Projects</h3>
//               <p>Browse available projects.</p>
//             </div>
//           </button>

//           {/* Portfolio */}
//           <button
//             className="quick-action-card"
//             onClick={() => {
//               window.location.href = "/freelancer/portfolio";
//             }}
//           >
//             <span className="quick-icon">📁</span>

//             <div>
//               <h3>Manage Portfolio</h3>
//               <p>Add and manage your work.</p>
//             </div>
//           </button>

//           {/* Profile */}
//           <button
//             className="quick-action-card"
//             onClick={() => {
//               window.location.href = "/freelancer/profile";
//             }}
//           >
//             <span className="quick-icon">👤</span>

//             <div>
//               <h3>Edit Profile</h3>
//               <p>Update your skills and profile.</p>
//             </div>
//           </button>

//           {/* Messages */}
//           <button
//             className="quick-action-card"
//             onClick={() => {
//               window.location.href = "/notifications";
//             }}
//           >
//             <span className="quick-icon">💬</span>

//             <div>
//               <h3>Messages</h3>
//               <p>Chat with clients.</p>
//             </div>
//           </button>

//         </div>
//       </div>

//     </div>
//   );
// };

// export default FreelancerDashboard;