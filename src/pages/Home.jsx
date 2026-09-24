import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ArrowRight, BriefcaseBusiness, Users, ShieldCheck, MessageCircle,
  CheckCircle2, Code2, Palette, Database, Smartphone, Brain, BarChart3,
  Sparkles, Star, Clock3, IndianRupee, Search, Zap, Target
} from "lucide-react";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // BACKEND CONNECTION — unchanged in purpose: fetch live projects.
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("accessToken");

        if (!token) {
          setProjects([]);
          return;
        }

        const response = await axios.get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const projectData =
          response.data?.projects ||
          response.data?.data ||
          response.data?.results ||
          response.data;

        setProjects(Array.isArray(projectData) ? projectData : []);
      } catch (error) {
        console.error("HOME PROJECTS ERROR:", error);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const projectCount = useMemo(() => projects.length, [projects]);

  const features = [
    { icon: <BriefcaseBusiness />, title: "Real Projects", text: "Discover practical freelance opportunities and build experience." },
    { icon: <Users />, title: "Student Talent", text: "Connect with clients and ambitious student freelancers." },
    { icon: <ShieldCheck />, title: "Secure Workflow", text: "Keep profiles, proposals and collaboration in one place." },
    { icon: <MessageCircle />, title: "Live Collaboration", text: "Communicate and manage work without leaving SkillForge." },
  ];

  const skills = [
    { name:"Web Development", icon:<Code2/> },
    { name:"UI / UX Design", icon:<Palette/> },
    { name:"Backend Development", icon:<Database/> },
    { name:"Mobile Development", icon:<Smartphone/> },
    { name:"Artificial Intelligence", icon:<Brain/> },
    { name:"Data Analytics", icon:<BarChart3/> },
  ];

  const steps = [
    ["01","Create your profile","Show your skills, experience and portfolio."],
    ["02","Discover projects","Explore opportunities that match your expertise."],
    ["03","Send a proposal","Introduce your approach, timeline and budget."],
    ["04","Start working","Collaborate, track milestones and deliver."],
  ];

  const featured = projects.slice(0, 3);

  return (
    <main className="sf-home">
      <section className="sf-home-hero">
        <div className="sf-home-container sf-hero-grid">
          <div className="sf-hero-copy">
            <div className="sf-eyebrow"><Sparkles size={15}/> Student Freelance Marketplace</div>
            <h1>Turn your <span>skills</span> into real opportunities.</h1>
            <p>
              SkillForge helps college students learn, build professional portfolios,
              discover freelance projects and collaborate with clients from one platform.
            </p>
            <div className="sf-hero-actions">
              <Link to="/register" className="sf-btn-primary">Get Started <ArrowRight size={17}/></Link>
              <Link to="/projects" className="sf-btn-secondary">Explore Projects</Link>
            </div>
            <div className="sf-hero-proof">
              <span><CheckCircle2 size={16}/> Student focused</span>
              <span><CheckCircle2 size={16}/> Real projects</span>
              <span><CheckCircle2 size={16}/> Secure workflow</span>
            </div>
          </div>

          <div className="sf-hero-visual">
            <div className="sf-visual-orbit orbit-one"></div>
            <div className="sf-visual-orbit orbit-two"></div>
            <div className="sf-hero-window">
              <div className="sf-window-top"><span></span><span></span><span></span><b>SkillForge Workspace</b></div>
              <div className="sf-window-body">
                <div className="sf-window-sidebar">
                  <div className="sf-mini-logo">S</div>
                  <i></i><i></i><i></i><i></i>
                </div>
                <div className="sf-window-content">
                  <div className="sf-window-heading">
                    <div><small>PROJECT MATCH</small><strong>{projects[0]?.title || "MERN E-Commerce Website"}</strong></div>
                    <span className="sf-live-pill">Open</span>
                  </div>
                  <div className="sf-progress"><span></span></div>
                  <div className="sf-window-row">
                    <div><small>Budget</small><strong>{projects[0]?.budget ? `₹${Number(projects[0].budget).toLocaleString("en-IN")}` : "₹25,000"}</strong></div>
                    <div><small>Deadline</small><strong>{projects[0]?.deadline ? new Date(projects[0].deadline).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "Flexible"}</strong></div>
                  </div>
                  <div className="sf-window-match"><Zap size={15}/> Skill match <b>94%</b></div>
                </div>
              </div>
            </div>
            <div className="sf-float-card sf-float-one"><Users size={17}/><div><b>Student talent</b><small>Connect & collaborate</small></div></div>
            <div className="sf-float-card sf-float-two"><Star size={16} fill="currentColor"/><div><b>Build your profile</b><small>Showcase your work</small></div></div>
          </div>
        </div>
      </section>

      <section className="sf-stat-strip">
        <div className="sf-home-container sf-stat-grid">
          <div><strong>{projectCount || "—"}</strong><span>Live Projects</span></div>
          <div><strong>6+</strong><span>Skill Categories</span></div>
          <div><strong>24/7</strong><span>Platform Access</span></div>
          <div><strong>100%</strong><span>Student Focused</span></div>
        </div>
      </section>

      <section className="sf-home-section">
        <div className="sf-home-container">
          <div className="sf-section-head">
            <div><span>WHY SKILLFORGE</span><h2>Everything you need to <em>freelance better.</em></h2></div>
            <p>From discovering work to building credibility, SkillForge brings the core freelance workflow together.</p>
          </div>
          <div className="sf-feature-grid">
            {features.map((item) => <article className="sf-feature" key={item.title}><div className="sf-feature-icon">{item.icon}</div><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="sf-home-section sf-project-section">
        <div className="sf-home-container">
          <div className="sf-section-head">
            <div><span>LIVE OPPORTUNITIES</span><h2>Explore real <em>projects.</em></h2></div>
            <Link to="/projects" className="sf-text-link">View all <ArrowRight size={16}/></Link>
          </div>
          {loadingProjects ? (
            <div className="sf-loading-card"><div className="sf-spinner"></div><p>Loading live projects...</p></div>
          ) : featured.length ? (
            <div className="sf-project-grid">
              {featured.map((project) => (
                <Link className="sf-project-card" key={project._id} to={`/projects/${project._id}`}>
                  <div className="sf-project-meta"><span>{project.category || "Freelance Project"}</span><b>{project.status || "Open"}</b></div>
                  <div className="sf-project-icon"><Code2 size={21}/></div>
                  <h3>{project.title || "Untitled Project"}</h3>
                  <p>{project.description ? `${project.description.slice(0,110)}${project.description.length > 110 ? "..." : ""}` : "Project details available on SkillForge."}</p>
                  <div className="sf-project-bottom"><span>Budget <strong>₹{Number(project.budget || 0).toLocaleString("en-IN")}</strong></span><ArrowRight size={17}/></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="sf-empty-card"><div><BriefcaseBusiness size={25}/></div><h3>Discover your next opportunity</h3><p>Sign in or create an account to explore projects and start building your portfolio.</p><Link to="/register" className="sf-btn-primary">Create Account <ArrowRight size={16}/></Link></div>
          )}
        </div>
      </section>

      <section className="sf-home-section">
        <div className="sf-home-container">
          <div className="sf-section-head centered">
            <div><span>POPULAR SKILLS</span><h2>Skills that <em>open doors.</em></h2></div>
            <p>Explore popular areas and find opportunities aligned with what you know.</p>
          </div>
          <div className="sf-skill-grid">
            {skills.map((skill) => <Link key={skill.name} to="/skills" className="sf-skill-card">{skill.icon}<span>{skill.name}</span><ArrowRight size={15}/></Link>)}
          </div>
        </div>
      </section>

      <section className="sf-home-section sf-process-section">
        <div className="sf-home-container">
          <div className="sf-section-head centered">
            <div><span>HOW IT WORKS</span><h2>From skill to <em>opportunity.</em></h2></div>
            <p>A simple workflow designed for students and clients.</p>
          </div>
          <div className="sf-step-grid">
            {steps.map(([num,title,text]) => <article key={num} className="sf-step"><b>{num}</b><div className="sf-step-icon"><Target size={19}/></div><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="sf-home-cta">
        <div className="sf-home-container sf-cta-inner">
          <div><span>READY TO START?</span><h2>Build something meaningful with your skills.</h2><p>Create your profile and start exploring SkillForge today.</p></div>
          <div className="sf-cta-actions"><Link to="/register" className="sf-btn-primary">Get Started <ArrowRight size={17}/></Link><Link to="/courses" className="sf-btn-light">Explore Courses</Link></div>
        </div>
      </section>
    </main>
  );
};

export default Home;
