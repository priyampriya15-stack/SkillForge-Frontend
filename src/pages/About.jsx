import React from "react";
import { Users, BriefcaseBusiness, GraduationCap, Target, CheckCircle2, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  const values = [
    { icon:<Users/>, title:"Student First", text:"Designed around the needs of students who want practical experience and professional exposure." },
    { icon:<BriefcaseBusiness/>, title:"Real Work", text:"Projects provide a practical environment to apply skills beyond the classroom." },
    { icon:<GraduationCap/>, title:"Continuous Learning", text:"Courses, skills and project work help learners keep developing." },
    { icon:<Target/>, title:"Career Growth", text:"Build a portfolio and a professional presence through meaningful work." },
  ];

  return (
    <main className="sf-about-page">
      <section className="sf-about-hero">
        <div className="sf-about-container">
          <span>ABOUT SKILLFORGE</span>
          <h1>Where skills meet <em>real opportunity.</em></h1>
          <p>SkillForge is a student-focused freelance marketplace that connects learners, clients and practical project opportunities in one professional workspace.</p>
        </div>
      </section>

      <section className="sf-about-section">
        <div className="sf-about-container sf-about-intro">
          <div><span>OUR MISSION</span><h2>Turning skills into real-world experience.</h2></div>
          <div><p>Students need more than theory to build confidence. SkillForge gives them a place to showcase skills, discover projects, collaborate with clients and grow a professional portfolio.</p><p>Clients can discover emerging talent, publish projects, review proposals and manage work through a focused platform.</p><div className="sf-about-checks">{["Build professional experience","Showcase technical skills","Connect students with clients","Manage projects efficiently"].map(x=><div key={x}><CheckCircle2 size={17}/>{x}</div>)}</div></div>
        </div>
      </section>

      <section className="sf-about-section sf-about-light">
        <div className="sf-about-container">
          <div className="sf-about-heading"><span>WHAT WE VALUE</span><h2>Built around growth.</h2><p>A professional environment for learning, collaboration and delivery.</p></div>
          <div className="sf-value-grid">{values.map((v)=><article key={v.title}><div>{v.icon}</div><h3>{v.title}</h3><p>{v.text}</p></article>)}</div>
        </div>
      </section>

      <section className="sf-about-section">
        <div className="sf-about-container sf-about-work">
          <div className="sf-about-work-card"><ShieldCheck size={25}/><h3>Secure collaboration</h3><p>Role-based workflows help clients and freelancers work within clear project responsibilities.</p></div>
          <div className="sf-about-work-card"><MessageCircle size={25}/><h3>Connected communication</h3><p>Keep project conversations and collaboration closer to the work you are delivering.</p></div>
          <div className="sf-about-work-card"><Target size={25}/><h3>Progress that matters</h3><p>Turn completed projects and milestones into a stronger professional profile.</p></div>
        </div>
      </section>

      <section className="sf-about-cta">
        <div className="sf-about-container"><div><span>START YOUR JOURNEY</span><h2>Ready to build your next opportunity?</h2></div><Link to="/register">Get Started <ArrowRight size={16}/></Link></div>
      </section>
    </main>
  );
};

export default About;
