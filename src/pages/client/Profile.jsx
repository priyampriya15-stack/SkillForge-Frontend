// import React, { useEffect, useState } from "react";

// export default function ClientProfile() {
//   const [user, setUser] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     location: "",
//     bio: "",
//   });

//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");

//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);

//         setUser({
//           name:
//             parsedUser.name ||
//             parsedUser.fullName ||
//             parsedUser.username ||
//             "",
//           email: parsedUser.email || "",
//           phone: parsedUser.phone || "",
//           company: parsedUser.company || "",
//           location: parsedUser.location || "",
//           bio: parsedUser.bio || "",
//         });
//       } catch (error) {
//         console.error("Error reading user:", error);
//       }
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setUser((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     try {
//       const oldUser = localStorage.getItem("user");

//       let existingUser = {};

//       if (oldUser) {
//         existingUser = JSON.parse(oldUser);
//       }

//       const updatedUser = {
//         ...existingUser,
//         ...user,
//       };

//       localStorage.setItem(
//         "user",
//         JSON.stringify(updatedUser)
//       );

//       setUser({
//         name: updatedUser.name || "",
//         email: updatedUser.email || "",
//         phone: updatedUser.phone || "",
//         company: updatedUser.company || "",
//         location: updatedUser.location || "",
//         bio: updatedUser.bio || "",
//       });

//       setMessage("Profile updated successfully!");

//       setTimeout(() => {
//         setMessage("");
//       }, 3000);
//     } catch (error) {
//       console.error("Profile update error:", error);
//       setMessage("Something went wrong!");
//     }
//   };

//   const handleCancel = () => {
//     window.location.reload();
//   };

//   const initial =
//     user.name && user.name.length > 0
//       ? user.name.charAt(0).toUpperCase()
//       : "C";

//   return (
//     <>
//       {/* =====================================================
//           PROFILE STYLES
//       ===================================================== */}

//       <style>{`
//         .sf-client-profile {
//           width: 100% !important;
//           max-width: 1400px !important;
//           margin: 0 auto !important;
//           padding: 0 !important;
//           box-sizing: border-box !important;
//           color: #111827 !important;
//           font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
//             "Segoe UI", sans-serif !important;
//         }

//         /* HEADER */

//         .sf-profile-header {
//           width: 100% !important;
//           margin-bottom: 24px !important;
//         }

//         .sf-profile-eyebrow {
//           margin: 0 0 6px 0 !important;
//           color: #6366f1 !important;
//           font-size: 12px !important;
//           font-weight: 800 !important;
//           letter-spacing: 1.2px !important;
//           text-transform: uppercase !important;
//         }

//         .sf-profile-title {
//           margin: 0 !important;
//           color: #111827 !important;
//           font-size: 30px !important;
//           line-height: 1.2 !important;
//           font-weight: 800 !important;
//         }

//         .sf-profile-subtitle {
//           margin: 7px 0 0 0 !important;
//           color: #6b7280 !important;
//           font-size: 14px !important;
//         }

//         /* SUCCESS */

//         .sf-profile-success {
//           width: 100% !important;
//           box-sizing: border-box !important;
//           margin-bottom: 20px !important;
//           padding: 13px 16px !important;

//           border: 1px solid #a7f3d0 !important;
//           border-radius: 12px !important;

//           background: #ecfdf5 !important;
//           color: #047857 !important;

//           font-size: 14px !important;
//           font-weight: 700 !important;
//         }

//         /* MAIN GRID */

//         .sf-profile-grid {
//           display: grid !important;
//           grid-template-columns: 300px minmax(0, 1fr) !important;
//           gap: 24px !important;
//           align-items: start !important;
//           width: 100% !important;
//         }

//         /* CARDS */

//         .sf-profile-card {
//           width: 100% !important;
//           box-sizing: border-box !important;

//           background: #ffffff !important;

//           border: 1px solid #e5e7eb !important;
//           border-radius: 18px !important;

//           padding: 26px !important;

//           box-shadow:
//             0 4px 12px rgba(15, 23, 42, 0.04),
//             0 12px 30px rgba(15, 23, 42, 0.04) !important;
//         }

//         /* LEFT CARD */

//         .sf-profile-summary {
//           text-align: center !important;
//         }

//         .sf-profile-avatar {
//           width: 92px !important;
//           height: 92px !important;

//           margin: 0 auto 16px auto !important;

//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;

//           border-radius: 50% !important;

//           background: linear-gradient(
//             135deg,
//             #4f46e5,
//             #8b5cf6
//           ) !important;

//           color: #ffffff !important;

//           font-size: 34px !important;
//           font-weight: 800 !important;

//           box-shadow:
//             0 10px 25px rgba(79, 70, 229, 0.25) !important;
//         }

//         .sf-profile-name {
//           margin: 0 !important;
//           color: #111827 !important;
//           font-size: 21px !important;
//           font-weight: 800 !important;
//         }

//         .sf-profile-role {
//           margin: 6px 0 0 0 !important;
//           color: #6b7280 !important;
//           font-size: 13px !important;
//           font-weight: 500 !important;
//         }

//         .sf-profile-divider {
//           width: 100% !important;
//           height: 1px !important;
//           margin: 24px 0 !important;
//           background: #e5e7eb !important;
//         }

//         /* INFO ITEMS */

//         .sf-profile-info {
//           display: flex !important;
//           align-items: flex-start !important;
//           gap: 12px !important;
//           margin-bottom: 18px !important;
//           text-align: left !important;
//         }

//         .sf-profile-info:last-child {
//           margin-bottom: 0 !important;
//         }

//         .sf-profile-info-icon {
//           width: 38px !important;
//           height: 38px !important;
//           min-width: 38px !important;

//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;

//           border-radius: 10px !important;

//           background: #f3f4f6 !important;

//           font-size: 16px !important;
//         }

//         .sf-profile-info-label {
//           display: block !important;
//           margin-bottom: 3px !important;
//           color: #9ca3af !important;
//           font-size: 11px !important;
//           font-weight: 600 !important;
//         }

//         .sf-profile-info-value {
//           display: block !important;
//           max-width: 200px !important;

//           color: #374151 !important;

//           font-size: 13px !important;
//           font-weight: 700 !important;

//           word-break: break-word !important;
//         }

//         /* RIGHT CARD */

//         .sf-profile-card-header {
//           padding-bottom: 20px !important;
//           margin-bottom: 22px !important;
//           border-bottom: 1px solid #e5e7eb !important;
//         }

//         .sf-profile-card-title {
//           margin: 0 !important;
//           color: #111827 !important;
//           font-size: 20px !important;
//           font-weight: 800 !important;
//         }

//         .sf-profile-card-description {
//           margin: 6px 0 0 0 !important;
//           color: #6b7280 !important;
//           font-size: 13px !important;
//         }

//         /* FORM */

//         .sf-profile-form {
//           width: 100% !important;
//         }

//         .sf-profile-form-grid {
//           display: grid !important;
//           grid-template-columns: 1fr 1fr !important;
//           gap: 20px !important;
//           width: 100% !important;
//         }

//         .sf-profile-field {
//           width: 100% !important;
//           min-width: 0 !important;
//           display: flex !important;
//           flex-direction: column !important;
//         }

//         .sf-profile-field.full {
//           grid-column: 1 / -1 !important;
//         }

//         .sf-profile-label {
//           margin-bottom: 8px !important;
//           color: #374151 !important;
//           font-size: 13px !important;
//           font-weight: 700 !important;
//         }

//         .sf-profile-input,
//         .sf-profile-textarea {
//           width: 100% !important;
//           box-sizing: border-box !important;

//           border: 1px solid #d1d5db !important;
//           border-radius: 11px !important;

//           background: #ffffff !important;

//           color: #111827 !important;

//           font-family: inherit !important;
//           font-size: 14px !important;

//           outline: none !important;

//           transition:
//             border-color 0.2s ease,
//             box-shadow 0.2s ease !important;
//         }

//         .sf-profile-input {
//           height: 46px !important;
//           padding: 0 14px !important;
//         }

//         .sf-profile-textarea {
//           min-height: 120px !important;
//           padding: 13px 14px !important;
//           resize: vertical !important;
//         }

//         .sf-profile-input:focus,
//         .sf-profile-textarea:focus {
//           border-color: #6366f1 !important;

//           box-shadow:
//             0 0 0 3px rgba(99, 102, 241, 0.12) !important;
//         }

//         .sf-profile-input::placeholder,
//         .sf-profile-textarea::placeholder {
//           color: #9ca3af !important;
//         }

//         /* BUTTONS */

//         .sf-profile-actions {
//           display: flex !important;
//           justify-content: flex-end !important;
//           align-items: center !important;
//           gap: 12px !important;

//           margin-top: 28px !important;
//           padding-top: 20px !important;

//           border-top: 1px solid #e5e7eb !important;
//         }

//         .sf-profile-cancel,
//         .sf-profile-save {
//           height: 44px !important;
//           padding: 0 20px !important;

//           border: none !important;
//           border-radius: 10px !important;

//           font-family: inherit !important;
//           font-size: 13px !important;
//           font-weight: 700 !important;

//           cursor: pointer !important;

//           transition:
//             background 0.2s ease,
//             transform 0.2s ease !important;
//         }

//         .sf-profile-cancel {
//           background: #f3f4f6 !important;
//           color: #374151 !important;
//         }

//         .sf-profile-cancel:hover {
//           background: #e5e7eb !important;
//         }

//         .sf-profile-save {
//           background: #4f46e5 !important;
//           color: #ffffff !important;

//           box-shadow:
//             0 5px 14px rgba(79, 70, 229, 0.20) !important;
//         }

//         .sf-profile-save:hover {
//           background: #4338ca !important;
//           transform: translateY(-1px) !important;
//         }

//         /* RESPONSIVE */

//         @media (max-width: 1000px) {
//           .sf-profile-grid {
//             grid-template-columns: 1fr !important;
//           }

//           .sf-profile-summary {
//             max-width: 100% !important;
//           }
//         }

//         @media (max-width: 700px) {
//           .sf-profile-title {
//             font-size: 25px !important;
//           }

//           .sf-profile-grid {
//             gap: 18px !important;
//           }

//           .sf-profile-card {
//             padding: 20px !important;
//             border-radius: 14px !important;
//           }

//           .sf-profile-form-grid {
//             grid-template-columns: 1fr !important;
//             gap: 17px !important;
//           }

//           .sf-profile-field.full {
//             grid-column: auto !important;
//           }

//           .sf-profile-actions {
//             flex-direction: column-reverse !important;
//           }

//           .sf-profile-cancel,
//           .sf-profile-save {
//             width: 100% !important;
//           }
//         }
//       `}</style>


//       {/* =====================================================
//           PROFILE PAGE
//       ===================================================== */}

//       <div className="sf-client-profile">

//         {/* HEADER */}
//         <div className="sf-profile-header">

//           <p className="sf-profile-eyebrow">
//             Account Settings
//           </p>

//           <h1 className="sf-profile-title">
//             My Profile
//           </h1>

//           <p className="sf-profile-subtitle">
//             Manage your personal information and account details.
//           </p>

//         </div>


//         {/* SUCCESS MESSAGE */}
//         {message && (
//           <div className="sf-profile-success">
//             ✓ {message}
//           </div>
//         )}


//         {/* PROFILE GRID */}
//         <div className="sf-profile-grid">

//           {/* =================================================
//               LEFT PROFILE CARD
//           ================================================= */}

//           <div className="sf-profile-card sf-profile-summary">

//             <div className="sf-profile-avatar">
//               {initial}
//             </div>

//             <h2 className="sf-profile-name">
//               {user.name || "New Client"}
//             </h2>

//             <p className="sf-profile-role">
//               Client / Project Owner
//             </p>


//             <div className="sf-profile-divider"></div>


//             {/* EMAIL */}
//             <div className="sf-profile-info">

//               <div className="sf-profile-info-icon">
//                 📧
//               </div>

//               <div>
//                 <span className="sf-profile-info-label">
//                   Email
//                 </span>

//                 <strong className="sf-profile-info-value">
//                   {user.email || "Not added"}
//                 </strong>
//               </div>

//             </div>


//             {/* PHONE */}
//             <div className="sf-profile-info">

//               <div className="sf-profile-info-icon">
//                 📱
//               </div>

//               <div>
//                 <span className="sf-profile-info-label">
//                   Phone
//                 </span>

//                 <strong className="sf-profile-info-value">
//                   {user.phone || "Not added"}
//                 </strong>
//               </div>

//             </div>


//             {/* LOCATION */}
//             <div className="sf-profile-info">

//               <div className="sf-profile-info-icon">
//                 📍
//               </div>

//               <div>
//                 <span className="sf-profile-info-label">
//                   Location
//                 </span>

//                 <strong className="sf-profile-info-value">
//                   {user.location || "Not added"}
//                 </strong>
//               </div>

//             </div>


//             {/* COMPANY */}
//             <div className="sf-profile-info">

//               <div className="sf-profile-info-icon">
//                 🏢
//               </div>

//               <div>
//                 <span className="sf-profile-info-label">
//                   Company
//                 </span>

//                 <strong className="sf-profile-info-value">
//                   {user.company || "Not added"}
//                 </strong>
//               </div>

//             </div>

//           </div>


//           {/* =================================================
//               RIGHT EDIT PROFILE CARD
//           ================================================= */}

//           <div className="sf-profile-card">

//             <div className="sf-profile-card-header">

//               <h2 className="sf-profile-card-title">
//                 Personal Information
//               </h2>

//               <p className="sf-profile-card-description">
//                 Update your profile information below.
//               </p>

//             </div>


//             <form
//               className="sf-profile-form"
//               onSubmit={handleSubmit}
//             >

//               <div className="sf-profile-form-grid">

//                 {/* FULL NAME */}
//                 <div className="sf-profile-field">

//                   <label className="sf-profile-label">
//                     Full Name
//                   </label>

//                   <input
//                     className="sf-profile-input"
//                     type="text"
//                     name="name"
//                     value={user.name}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                   />

//                 </div>


//                 {/* EMAIL */}
//                 <div className="sf-profile-field">

//                   <label className="sf-profile-label">
//                     Email Address
//                   </label>

//                   <input
//                     className="sf-profile-input"
//                     type="email"
//                     name="email"
//                     value={user.email}
//                     onChange={handleChange}
//                     placeholder="Enter your email"
//                   />

//                 </div>


//                 {/* PHONE */}
//                 <div className="sf-profile-field">

//                   <label className="sf-profile-label">
//                     Phone Number
//                   </label>

//                   <input
//                     className="sf-profile-input"
//                     type="text"
//                     name="phone"
//                     value={user.phone}
//                     onChange={handleChange}
//                     placeholder="Enter your phone number"
//                   />

//                 </div>


//                 {/* COMPANY */}
//                 <div className="sf-profile-field">

//                   <label className="sf-profile-label">
//                     Company
//                   </label>

//                   <input
//                     className="sf-profile-input"
//                     type="text"
//                     name="company"
//                     value={user.company}
//                     onChange={handleChange}
//                     placeholder="Enter company name"
//                   />

//                 </div>


//                 {/* LOCATION */}
//                 <div className="sf-profile-field full">

//                   <label className="sf-profile-label">
//                     Location
//                   </label>

//                   <input
//                     className="sf-profile-input"
//                     type="text"
//                     name="location"
//                     value={user.location}
//                     onChange={handleChange}
//                     placeholder="Enter your location"
//                   />

//                 </div>


//                 {/* ABOUT */}
//                 <div className="sf-profile-field full">

//                   <label className="sf-profile-label">
//                     About Me
//                   </label>

//                   <textarea
//                     className="sf-profile-textarea"
//                     name="bio"
//                     value={user.bio}
//                     onChange={handleChange}
//                     placeholder="Tell freelancers a little about yourself..."
//                     rows="5"
//                   />

//                 </div>

//               </div>


//               {/* ACTION BUTTONS */}

//               <div className="sf-profile-actions">

//                 <button
//                   type="button"
//                   className="sf-profile-cancel"
//                   onClick={handleCancel}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="sf-profile-save"
//                 >
//                   Save Changes
//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>

//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";

export default function ClientProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    bio: "",
  });

  const [message, setMessage] = useState("");

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser({
          name:
            parsedUser.name ||
            parsedUser.fullName ||
            parsedUser.username ||
            "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          company: parsedUser.company || "",
          location: parsedUser.location || "",
          bio: parsedUser.bio || "",
        });
      } catch (error) {
        console.error("Error reading user:", error);
      }
    }
  }, []);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const oldUser = localStorage.getItem("user");

      let existingUser = {};

      if (oldUser) {
        existingUser = JSON.parse(oldUser);
      }

      const updatedUser = {
        ...existingUser,
        ...user,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        company: updatedUser.company || "",
        location: updatedUser.location || "",
        bio: updatedUser.bio || "",
      });

      setMessage("Profile updated successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("Something went wrong!");
    }
  };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {
    window.location.reload();
  };

  /* =========================================================
     AVATAR INITIAL
  ========================================================= */

  const initial =
    user.name && user.name.length > 0
      ? user.name.charAt(0).toUpperCase()
      : "C";

  return (
    <>
      {/* =====================================================
          PROFILE PAGE STYLES
      ===================================================== */}

      <style>{`
        /* =====================================================
           MAIN CONTAINER
        ===================================================== */

        .sf-client-profile {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0;
          box-sizing: border-box;

          color: #111827;

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================================
           PREMIUM PAGE HEADER
        ===================================================== */

        .client-page-header {
          width: 100%;
          margin-bottom: 30px;
          position: relative;
        }

        .client-page-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 9px;

          color: #6366f1;

          font-size: 11px;
          font-weight: 800;

          line-height: 1;

          letter-spacing: 1.6px;
          text-transform: uppercase;
        }

        .client-page-eyebrow-dot {
          width: 7px;
          height: 7px;

          flex-shrink: 0;

          border-radius: 50%;

          background: #6366f1;

          box-shadow:
            0 0 0 4px rgba(99, 102, 241, 0.10),
            0 0 12px rgba(99, 102, 241, 0.20);
        }

        .client-page-title {
          margin: 0;

          color: #101828;

          font-size: clamp(28px, 3vw, 36px);

          line-height: 1.12;

          font-weight: 800;

          letter-spacing: -1.1px;
        }

        .client-page-description {
          max-width: 650px;

          margin: 9px 0 0;

          color: #667085;

          font-size: 14px;

          line-height: 1.6;
        }


        /* =====================================================
           HEADER ANIMATION
        ===================================================== */

        .client-page-eyebrow,
        .client-page-title,
        .client-page-description {
          animation: clientHeaderFadeUp 0.45s ease both;
        }

        .client-page-title {
          animation-delay: 0.05s;
        }

        .client-page-description {
          animation-delay: 0.1s;
        }

        @keyframes clientHeaderFadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* =====================================================
           SUCCESS MESSAGE
        ===================================================== */

        .sf-profile-success {
          width: 100%;
          box-sizing: border-box;

          margin-bottom: 20px;
          padding: 13px 16px;

          border: 1px solid #a7f3d0;
          border-radius: 12px;

          background: #ecfdf5;
          color: #047857;

          font-size: 14px;
          font-weight: 700;

          animation: successSlide 0.3s ease;
        }

        @keyframes successSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* =====================================================
           PROFILE GRID
        ===================================================== */

        .sf-profile-grid {
          display: grid;

          grid-template-columns:
            300px
            minmax(0, 1fr);

          gap: 24px;

          align-items: start;

          width: 100%;
        }


        /* =====================================================
           CARDS
        ===================================================== */

        .sf-profile-card {
          width: 100%;
          box-sizing: border-box;

          background: #ffffff;

          border: 1px solid #e5e7eb;

          border-radius: 18px;

          padding: 26px;

          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04),
            0 12px 30px rgba(15, 23, 42, 0.04);

          transition:
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }

        .sf-profile-card:hover {
          box-shadow:
            0 8px 18px rgba(15, 23, 42, 0.05),
            0 18px 38px rgba(15, 23, 42, 0.06);
        }


        /* =====================================================
           LEFT PROFILE SUMMARY
        ===================================================== */

        .sf-profile-summary {
          text-align: center;
        }

        .sf-profile-avatar {
          width: 92px;
          height: 92px;

          margin: 0 auto 16px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #8b5cf6
            );

          color: #ffffff;

          font-size: 34px;
          font-weight: 800;

          box-shadow:
            0 10px 25px rgba(79, 70, 229, 0.25);
        }

        .sf-profile-name {
          margin: 0;

          color: #111827;

          font-size: 21px;
          font-weight: 800;

          letter-spacing: -0.3px;
        }

        .sf-profile-role {
          margin: 6px 0 0;

          color: #6b7280;

          font-size: 13px;
          font-weight: 500;
        }

        .sf-profile-divider {
          width: 100%;
          height: 1px;

          margin: 24px 0;

          background: #e5e7eb;
        }


        /* =====================================================
           PROFILE INFORMATION
        ===================================================== */

        .sf-profile-info {
          display: flex;
          align-items: flex-start;

          gap: 12px;

          margin-bottom: 18px;

          text-align: left;
        }

        .sf-profile-info:last-child {
          margin-bottom: 0;
        }

        .sf-profile-info-icon {
          width: 38px;
          height: 38px;
          min-width: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          background: #f3f4f6;

          font-size: 16px;
        }

        .sf-profile-info-label {
          display: block;

          margin-bottom: 3px;

          color: #9ca3af;

          font-size: 11px;
          font-weight: 600;
        }

        .sf-profile-info-value {
          display: block;

          max-width: 200px;

          color: #374151;

          font-size: 13px;
          font-weight: 700;

          word-break: break-word;
        }


        /* =====================================================
           RIGHT CARD HEADER
        ===================================================== */

        .sf-profile-card-header {
          padding-bottom: 20px;

          margin-bottom: 22px;

          border-bottom: 1px solid #e5e7eb;
        }

        .sf-profile-card-title {
          margin: 0;

          color: #111827;

          font-size: 20px;
          font-weight: 800;

          letter-spacing: -0.3px;
        }

        .sf-profile-card-description {
          margin: 6px 0 0;

          color: #6b7280;

          font-size: 13px;

          line-height: 1.5;
        }


        /* =====================================================
           FORM
        ===================================================== */

        .sf-profile-form {
          width: 100%;
        }

        .sf-profile-form-grid {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 20px;

          width: 100%;
        }

        .sf-profile-field {
          width: 100%;
          min-width: 0;

          display: flex;
          flex-direction: column;
        }

        .sf-profile-field.full {
          grid-column: 1 / -1;
        }

        .sf-profile-label {
          margin-bottom: 8px;

          color: #374151;

          font-size: 13px;
          font-weight: 700;
        }

        .sf-profile-input,
        .sf-profile-textarea {
          width: 100%;
          box-sizing: border-box;

          border: 1px solid #d1d5db;

          border-radius: 11px;

          background: #ffffff;

          color: #111827;

          font-family: inherit;

          font-size: 14px;

          outline: none;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .sf-profile-input {
          height: 46px;

          padding: 0 14px;
        }

        .sf-profile-textarea {
          min-height: 120px;

          padding: 13px 14px;

          resize: vertical;

          line-height: 1.55;
        }

        .sf-profile-input:hover,
        .sf-profile-textarea:hover {
          border-color: #a5b4fc;
        }

        .sf-profile-input:focus,
        .sf-profile-textarea:focus {
          border-color: #6366f1;

          box-shadow:
            0 0 0 3px rgba(99, 102, 241, 0.12);

          background: #ffffff;
        }

        .sf-profile-input::placeholder,
        .sf-profile-textarea::placeholder {
          color: #9ca3af;
        }


        /* =====================================================
           ACTION BUTTONS
        ===================================================== */

        .sf-profile-actions {
          display: flex;

          justify-content: flex-end;
          align-items: center;

          gap: 12px;

          margin-top: 28px;

          padding-top: 20px;

          border-top: 1px solid #e5e7eb;
        }

        .sf-profile-cancel,
        .sf-profile-save {
          height: 44px;

          padding: 0 20px;

          border: none;

          border-radius: 10px;

          font-family: inherit;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .sf-profile-cancel {
          background: #f3f4f6;

          color: #374151;
        }

        .sf-profile-cancel:hover {
          background: #e5e7eb;

          transform: translateY(-1px);
        }

        .sf-profile-save {
          background:
            linear-gradient(
              135deg,
              #4f46e5,
              #6366f1
            );

          color: #ffffff;

          box-shadow:
            0 5px 14px rgba(79, 70, 229, 0.20);
        }

        .sf-profile-save:hover {
          background:
            linear-gradient(
              135deg,
              #4338ca,
              #4f46e5
            );

          transform: translateY(-1px);

          box-shadow:
            0 8px 18px rgba(79, 70, 229, 0.25);
        }


        /* =====================================================
           TABLET - 1000px
        ===================================================== */

        @media (max-width: 1000px) {

          .sf-profile-grid {
            grid-template-columns: 1fr;
          }

          .sf-profile-summary {
            max-width: 100%;
          }

          .sf-profile-summary .sf-profile-info {
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .sf-profile-info-value {
            max-width: 100%;
          }
        }


        /* =====================================================
           TABLET - 800px
        ===================================================== */

        @media (max-width: 800px) {

          .client-page-header {
            margin-bottom: 25px;
          }

          .client-page-title {
            font-size: 30px;
          }

          .sf-profile-grid {
            gap: 18px;
          }

          .sf-profile-card {
            padding: 22px;
          }
        }


        /* =====================================================
           MOBILE - 700px
        ===================================================== */

        @media (max-width: 700px) {

          .client-page-header {
            margin-bottom: 22px;
          }

          .client-page-eyebrow {
            gap: 7px;

            margin-bottom: 8px;

            font-size: 10px;

            letter-spacing: 1.4px;
          }

          .client-page-eyebrow-dot {
            width: 6px;
            height: 6px;

            box-shadow:
              0 0 0 3px rgba(99, 102, 241, 0.10);
          }

          .client-page-title {
            font-size: 28px;

            letter-spacing: -0.8px;
          }

          .client-page-description {
            margin-top: 8px;

            font-size: 13px;

            line-height: 1.55;
          }

          .sf-profile-grid {
            gap: 16px;
          }

          .sf-profile-card {
            padding: 20px;

            border-radius: 15px;
          }

          .sf-profile-form-grid {
            grid-template-columns: 1fr;

            gap: 17px;
          }

          .sf-profile-field.full {
            grid-column: auto;
          }

          .sf-profile-actions {
            flex-direction: column-reverse;

            gap: 9px;
          }

          .sf-profile-cancel,
          .sf-profile-save {
            width: 100%;
          }
        }


        /* =====================================================
           MOBILE - 520px
        ===================================================== */

        @media (max-width: 520px) {

          .client-page-header {
            margin-bottom: 20px;
          }

          .client-page-title {
            font-size: 25px;

            letter-spacing: -0.6px;
          }

          .client-page-description {
            font-size: 12px;

            line-height: 1.5;
          }

          .sf-profile-card {
            padding: 17px;

            border-radius: 14px;
          }

          .sf-profile-avatar {
            width: 78px;
            height: 78px;

            margin-bottom: 13px;

            font-size: 29px;
          }

          .sf-profile-name {
            font-size: 19px;
          }

          .sf-profile-card-title {
            font-size: 18px;
          }

          .sf-profile-card-description {
            font-size: 12px;
          }

          .sf-profile-input {
            height: 44px;

            padding: 0 12px;

            font-size: 13px;
          }

          .sf-profile-textarea {
            font-size: 13px;
          }
        }


        /* =====================================================
           MOBILE - 450px
        ===================================================== */

        @media (max-width: 450px) {

          .client-page-header {
            margin-bottom: 18px;
          }

          .client-page-eyebrow {
            gap: 6px;

            font-size: 9px;

            letter-spacing: 1.2px;
          }

          .client-page-title {
            font-size: 23px;

            line-height: 1.15;
          }

          .client-page-description {
            max-width: 100%;

            margin-top: 7px;

            font-size: 12px;
          }

          .sf-profile-card {
            padding: 15px;
          }

          .sf-profile-info {
            gap: 9px;
          }

          .sf-profile-info-icon {
            width: 34px;
            height: 34px;
            min-width: 34px;

            font-size: 14px;
          }

          .sf-profile-info-label {
            font-size: 10px;
          }

          .sf-profile-info-value {
            font-size: 12px;
          }

          .sf-profile-label {
            font-size: 12px;
          }
        }


        /* =====================================================
           VERY SMALL DEVICES - 360px
        ===================================================== */

        @media (max-width: 360px) {

          .client-page-title {
            font-size: 21px;
          }

          .client-page-description {
            font-size: 11px;
          }

          .client-page-eyebrow {
            font-size: 8px;

            letter-spacing: 1px;
          }

          .sf-profile-card {
            padding: 13px;
          }

          .sf-profile-avatar {
            width: 70px;
            height: 70px;

            font-size: 26px;
          }

          .sf-profile-name {
            font-size: 18px;
          }
        }
      `}</style>


      {/* =====================================================
          PROFILE PAGE
      ===================================================== */}

      <div className="sf-client-profile">

        {/* ===================================================
            PREMIUM HEADER
        =================================================== */}

        <div className="client-page-header">

          <div className="client-page-eyebrow">
            <span className="client-page-eyebrow-dot"></span>
            ACCOUNT SETTINGS
          </div>

          <h1 className="client-page-title">
            My Profile
          </h1>

          <p className="client-page-description">
            Manage your personal information and account details.
          </p>

        </div>


        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {message && (
          <div className="sf-profile-success">
            ✓ {message}
          </div>
        )}


        {/* ===================================================
            PROFILE GRID
        =================================================== */}

        <div className="sf-profile-grid">


          {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

          <div className="sf-profile-card sf-profile-summary">

            <div className="sf-profile-avatar">
              {initial}
            </div>

            <h2 className="sf-profile-name">
              {user.name || "New Client"}
            </h2>

            <p className="sf-profile-role">
              Client / Project Owner
            </p>


            <div className="sf-profile-divider"></div>


            {/* EMAIL */}

            <div className="sf-profile-info">

              <div className="sf-profile-info-icon">
                📧
              </div>

              <div>
                <span className="sf-profile-info-label">
                  Email
                </span>

                <strong className="sf-profile-info-value">
                  {user.email || "Not added"}
                </strong>
              </div>

            </div>


            {/* PHONE */}

            <div className="sf-profile-info">

              <div className="sf-profile-info-icon">
                📱
              </div>

              <div>
                <span className="sf-profile-info-label">
                  Phone
                </span>

                <strong className="sf-profile-info-value">
                  {user.phone || "Not added"}
                </strong>
              </div>

            </div>


            {/* LOCATION */}

            <div className="sf-profile-info">

              <div className="sf-profile-info-icon">
                📍
              </div>

              <div>
                <span className="sf-profile-info-label">
                  Location
                </span>

                <strong className="sf-profile-info-value">
                  {user.location || "Not added"}
                </strong>
              </div>

            </div>


            {/* COMPANY */}

            <div className="sf-profile-info">

              <div className="sf-profile-info-icon">
                🏢
              </div>

              <div>
                <span className="sf-profile-info-label">
                  Company
                </span>

                <strong className="sf-profile-info-value">
                  {user.company || "Not added"}
                </strong>
              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT EDIT PROFILE CARD
          ================================================= */}

          <div className="sf-profile-card">

            <div className="sf-profile-card-header">

              <h2 className="sf-profile-card-title">
                Personal Information
              </h2>

              <p className="sf-profile-card-description">
                Update your profile information below.
              </p>

            </div>


            {/* FORM */}

            <form
              className="sf-profile-form"
              onSubmit={handleSubmit}
            >

              <div className="sf-profile-form-grid">


                {/* FULL NAME */}

                <div className="sf-profile-field">

                  <label className="sf-profile-label">
                    Full Name
                  </label>

                  <input
                    className="sf-profile-input"
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                </div>


                {/* EMAIL */}

                <div className="sf-profile-field">

                  <label className="sf-profile-label">
                    Email Address
                  </label>

                  <input
                    className="sf-profile-input"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />

                </div>


                {/* PHONE */}

                <div className="sf-profile-field">

                  <label className="sf-profile-label">
                    Phone Number
                  </label>

                  <input
                    className="sf-profile-input"
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />

                </div>


                {/* COMPANY */}

                <div className="sf-profile-field">

                  <label className="sf-profile-label">
                    Company
                  </label>

                  <input
                    className="sf-profile-input"
                    type="text"
                    name="company"
                    value={user.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />

                </div>


                {/* LOCATION */}

                <div className="sf-profile-field full">

                  <label className="sf-profile-label">
                    Location
                  </label>

                  <input
                    className="sf-profile-input"
                    type="text"
                    name="location"
                    value={user.location}
                    onChange={handleChange}
                    placeholder="Enter your location"
                  />

                </div>


                {/* ABOUT */}

                <div className="sf-profile-field full">

                  <label className="sf-profile-label">
                    About Me
                  </label>

                  <textarea
                    className="sf-profile-textarea"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    placeholder="Tell freelancers a little about yourself..."
                    rows="5"
                  />

                </div>

              </div>


              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="sf-profile-actions">

                <button
                  type="button"
                  className="sf-profile-cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sf-profile-save"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>
    </>
  );
}