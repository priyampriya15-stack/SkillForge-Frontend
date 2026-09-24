import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, Code2, Database, Palette, Smartphone, Brain, BarChart3, Cloud, ShieldCheck, Server, Loader2, AlertCircle, RefreshCw, X, ArrowRight } from "lucide-react";
import "./Skills.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const iconMap = { Code2, Database, Palette, Smartphone, Brain, BarChart3, Cloud, ShieldCheck, Server };

const Skills = () => {
  const [skills,setSkills]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [searchTerm,setSearchTerm]=useState("");
  const [selectedCategory,setSelectedCategory]=useState("All");

  // BACKEND CONNECTION — preserved.
  const fetchSkills = async () => {
    try {
      setLoading(true); setError("");
      const response = await axios.get(`${API_URL}/skills`);
      const skillData = response.data?.skills || response.data?.data || response.data?.results || response.data;
      setSkills(Array.isArray(skillData) ? skillData : []);
    } catch (err) {
      console.error("SKILLS FETCH ERROR:", err);
      setError(err.response?.data?.message || (err.request ? "Backend server is not responding. Please start your backend." : "Failed to load skills."));
      setSkills([]);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ fetchSkills(); },[]);

  const categories = useMemo(()=>["All",...new Set(skills.map(s=>s.category).filter(Boolean))],[skills]);

  const filteredSkills = useMemo(()=>{
    const search=searchTerm.toLowerCase().trim();
    return skills.filter(skill=>{
      const title=skill.title?.toLowerCase()||"";
      const description=skill.description?.toLowerCase()||"";
      const category=skill.category?.toLowerCase()||"";
      const items=Array.isArray(skill.skills)?skill.skills.join(" ").toLowerCase():"";
      return (!search || title.includes(search)||description.includes(search)||category.includes(search)||items.includes(search))
        && (selectedCategory==="All" || skill.category===selectedCategory);
    });
  },[skills,searchTerm,selectedCategory]);

  const getIcon=(name)=>iconMap[name]||Code2;

  return (
    <main className="sf-skills-page">
      <section className="sf-skills-hero"><div className="sf-skills-container"><span>SKILL LIBRARY</span><h1>Build the skills that <em>move you forward.</em></h1><p>Explore technical and creative skills, discover learning areas and find opportunities that match what you can do.</p></div></section>
      <section className="sf-skills-content">
        <div className="sf-skills-container">
          <div className="sf-skills-toolbar">
            <div className="sf-skills-search"><Search size={17}/><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search skills..." /></div>
            <div className="sf-skill-categories">{categories.map(cat=><button key={cat} className={selectedCategory===cat?"active":""} onClick={()=>setSelectedCategory(cat)}>{cat}</button>)}</div>
          </div>

          {loading ? (
            <div className="sf-skills-state"><Loader2 className="spin" size={27}/><h3>Loading skills</h3><p>Fetching the latest skill catalogue...</p></div>
          ) : error ? (
            <div className="sf-skills-state error"><AlertCircle size={27}/><h3>Unable to load skills</h3><p>{error}</p><button onClick={fetchSkills}><RefreshCw size={15}/> Try again</button></div>
          ) : filteredSkills.length ? (
            <div className="sf-skills-grid">
              {filteredSkills.map((skill,index)=>{
                const Icon=getIcon(skill.icon);
                const items=Array.isArray(skill.skills)?skill.skills:[];
                return <article className="sf-skill-detail-card" key={skill._id||index}>
                  <div className="sf-skill-card-top"><div className="sf-skill-card-icon"><Icon size={21}/></div><span>{skill.category||"Skill"}</span></div>
                  <h2>{skill.title||skill.name||"Skill"}</h2>
                  <p>{skill.description||"Explore this skill and discover related opportunities."}</p>
                  {items.length>0 && <div className="sf-skill-tags">{items.slice(0,4).map((x,i)=><span key={i}>{x}</span>)}</div>}
                  <Link to="/courses" className="sf-skill-learn">Explore courses <ArrowRight size={15}/></Link>
                </article>;
              })}
            </div>
          ) : (
            <div className="sf-skills-state"><div className="sf-empty-x"><X size={20}/></div><h3>No skills found</h3><p>Try another search or category.</p></div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Skills;
