import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="sf-footer">

      {/* TOP ACCENT */}
      <div className="sf-footer-accent">
        <div className="sf-footer-accent-glow"></div>
      </div>

      {/* MAIN FOOTER */}
      <div className="sf-footer-main">

        {/* ================= BRAND ================= */}
        <div className="sf-footer-brand">

          <Link to="/" className="sf-footer-logo">
            <span className="sf-logo-box">S</span>

            <span className="sf-logo-text">
              Skill<span>Forge</span>
            </span>
          </Link>

          <p className="sf-footer-description">
            A student-focused freelance marketplace where skills become
            real-world projects, experience, and opportunities.
          </p>

          {/* TRUST */}
          <div className="sf-footer-trust">

            <span className="sf-trust-icon">
              <ShieldCheck size={16} />
            </span>

            <div>
              <strong>Secure & Trusted</strong>
              <small>
                Built for students & professionals
              </small>
            </div>

          </div>

          {/* SIMPLE SOCIAL / BRAND LINKS */}
          <div className="sf-footer-socials">

            <Link to="/about" aria-label="About SkillForge">
              <span>in</span>
            </Link>

            <Link to="/contact" aria-label="Contact SkillForge">
              <Mail size={15} />
            </Link>

            <Link to="/projects" aria-label="SkillForge Projects">
              <ArrowUpRight size={16} />
            </Link>

          </div>

        </div>

        {/* ================= EXPLORE ================= */}
        <div className="sf-footer-column">

          <h4>Explore</h4>

          <Link to="/projects">
            <span>Projects</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link to="/courses">
            <span>Courses</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link to="/skills">
            <span>Skills</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link to="/freelancers">
            <span>Freelancers</span>
            <ArrowUpRight size={14} />
          </Link>

        </div>

        {/* ================= COMPANY ================= */}
        <div className="sf-footer-column">

          <h4>Company</h4>

          <Link to="/about">
            <span>About Us</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link to="/contact">
            <span>Contact</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link to="/login">
            <span>Login</span>
            <ArrowUpRight size={14} />
          </Link>

          <Link to="/register">
            <span>Get Started</span>
            <ArrowUpRight size={14} />
          </Link>

        </div>

        {/* ================= CONTACT ================= */}
        <div className="sf-footer-contact">

          <div className="sf-footer-contact-heading">

            <span className="sf-contact-badge">
              <Sparkles size={15} />
            </span>

            <div>
              <h4>Let’s connect</h4>
              <p>We'd love to hear from you</p>
            </div>

          </div>

          {/* EMAIL */}
          <div className="sf-contact-item">

            <span className="sf-contact-icon">
              <Mail size={15} />
            </span>

            <div>
              <small>Email us</small>
              <strong>support@skillforge.com</strong>
            </div>

          </div>

          {/* LOCATION */}
          <div className="sf-contact-item">

            <span className="sf-contact-icon">
              <MapPin size={15} />
            </span>

            <div>
              <small>Based in</small>
              <strong>Chennai, Tamil Nadu</strong>
            </div>

          </div>

          {/* CONTACT BUTTON */}
          <Link
            to="/contact"
            className="sf-footer-support-btn"
          >
            Contact Support
            <ArrowUpRight size={16} />
          </Link>

        </div>

      </div>

      {/* ================= BOTTOM ================= */}
      <div className="sf-footer-bottom-wrapper">

        <div className="sf-footer-bottom">

          <span>
            © {new Date().getFullYear()} SkillForge.
            All rights reserved.
          </span>

          <div className="sf-footer-bottom-links">
            <span>Build</span>
            <i>•</i>
            <span>Learn</span>
            <i>•</i>
            <span>Earn</span>
          </div>

          <span className="sf-footer-made">
            Built for students, clients & freelancers.
          </span>

        </div>

      </div>

    </footer>
  );
};

export default Footer;