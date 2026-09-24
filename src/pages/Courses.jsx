import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, BookOpen, Code2, Database, Server, Palette, Smartphone, Braces, Brain, BarChart3, Cloud, ShieldCheck, Star, Clock3, Users, ArrowRight, Loader2, AlertCircle, X } from "lucide-react";
import "./Course.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const iconMap={BookOpen,Code2,Database,Server,Palette,Smartphone,Braces,Brain,BarChart3,Cloud,ShieldCheck};

const Courses=()=>{
  const [courses,setCourses]=useState([]),[searchTerm,setSearchTerm]=useState(""),[selectedCategory,setSelectedCategory]=useState("All"),[selectedLevel,setSelectedLevel]=useState("All"),[loading,setLoading]=useState(true),[error,setError]=useState("");

  // BACKEND CONNECTION — preserved.
  useEffect(()=>{
    const fetchCourses=async()=>{
      try{
        setLoading(true);setError("");
        const response=await axios.get(`${API_URL}/courses`);
        const courseData=response.data?.courses||response.data?.data||response.data?.results||response.data;
        setCourses(Array.isArray(courseData)?courseData:[]);
      }catch(err){
        console.error("FETCH COURSES ERROR:",err);
        setError(err.response?.data?.message||"Failed to load courses. Please try again.");
      }finally{setLoading(false);}
    };
    fetchCourses();
  },[]);

  const categories=useMemo(()=>["All",...new Set(courses.map(c=>c.category).filter(Boolean))],[courses]);
  const levels=useMemo(()=>["All",...new Set(courses.map(c=>c.level).filter(Boolean))],[courses]);
  const filteredCourses=useMemo(()=>courses.filter(course=>{
    const s=searchTerm.trim().toLowerCase();
    return (!s||course.title?.toLowerCase().includes(s)||course.description?.toLowerCase().includes(s)||course.category?.toLowerCase().includes(s))
      &&(selectedCategory==="All"||course.category===selectedCategory)
      &&(selectedLevel==="All"||course.level===selectedLevel);
  }),[courses,searchTerm,selectedCategory,selectedLevel]);

  const getIcon=(name)=>iconMap[name]||BookOpen;

  return <main className="sf-courses-page">
    <section className="sf-courses-hero"><div className="sf-courses-container"><span>LEARNING HUB</span><h1>Learn skills. Build <em>confidence.</em></h1><p>Explore practical courses designed to help students strengthen their skills and prepare for real freelance opportunities.</p></div></section>
    <section className="sf-courses-content"><div className="sf-courses-container">
      <div className="sf-course-toolbar">
        <div className="sf-course-search"><Search size={17}/><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search courses..." /></div>
        <div className="sf-filter-row">
          <div><small>Category</small><select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)}>{categories.map(x=><option key={x}>{x}</option>)}</select></div>
          <div><small>Level</small><select value={selectedLevel} onChange={e=>setSelectedLevel(e.target.value)}>{levels.map(x=><option key={x}>{x}</option>)}</select></div>
          {(searchTerm||selectedCategory!=="All"||selectedLevel!=="All")&&<button className="sf-clear-filter" onClick={()=>{setSearchTerm("");setSelectedCategory("All");setSelectedLevel("All")}}><X size={14}/> Clear</button>}
        </div>
      </div>

      {loading?<div className="sf-course-state"><Loader2 className="spin-course" size={27}/><h3>Loading courses</h3><p>Fetching the latest learning content...</p></div>
      :error?<div className="sf-course-state error"><AlertCircle size={27}/><h3>Unable to load courses</h3><p>{error}</p></div>
      :filteredCourses.length?<div className="sf-course-grid">{filteredCourses.map((course,index)=>{const Icon=getIcon(course.icon);return <article className="sf-course-card" key={course._id||index}>
        <div className="sf-course-cover"><div><Icon size={24}/></div><span>{course.level||"All levels"}</span></div>
        <div className="sf-course-body"><small>{course.category||"Professional Skills"}</small><h2>{course.title||"Course"}</h2><p>{course.description||"Build practical skills through focused learning."}</p>
          <div className="sf-course-meta"><span><Clock3 size={14}/> {course.duration||"Self-paced"}</span><span><Users size={14}/> {course.students||"Students"}</span><span><Star size={14} fill="currentColor"/> {course.rating||"4.8"}</span></div>
          <Link to="/register">Start Learning <ArrowRight size={15}/></Link>
        </div>
      </article>})}</div>
      :<div className="sf-course-state"><div className="sf-course-empty"><Search size={19}/></div><h3>No courses found</h3><p>Try changing your search or filters.</p></div>}
    </div></section>
  </main>;
};
export default Courses;
