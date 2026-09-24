import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, LockKeyhole, Eye, EyeOff, ArrowRight, ShieldCheck, BriefcaseBusiness, CheckCircle2, Sparkles, Loader2, Users, FolderKanban, MessageCircle } from "lucide-react";
import "./Login.css";

const API_URL=import.meta.env.VITE_API_URL||"http://localhost:5000/api";

const Login=()=>{
  const navigate=useNavigate();
  const [formData,setFormData]=useState({email:"",password:""});
  const [showPassword,setShowPassword]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const handleChange=(e)=>{
    const {name,value}=e.target;
    setFormData(prev=>({...prev,[name]:value}));
    if(error)setError("");
  };

  // BACKEND CONNECTION — preserved: POST /auth/login + token/user storage + role redirect.
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    const email=formData.email.trim(), password=formData.password;
    if(!email||!password){setError("Please enter your email and password.");return;}
    try{
      setLoading(true);
      const response=await axios.post(`${API_URL}/auth/login`,{email,password});
      const data=response.data||{};
      const token=data.token||data.accessToken||data.data?.token||data.data?.accessToken;
      const user=data.user||data.data?.user||data.data||null;
      if(!token)throw new Error(data.message||"Login successful but token was not received.");
      localStorage.setItem("token",token);
      localStorage.setItem("authToken",token);
      localStorage.setItem("accessToken",token);
      if(user){
        localStorage.setItem("user",JSON.stringify(user));
        if(user._id)localStorage.setItem("userId",user._id);
        if(user.id)localStorage.setItem("userId",user.id);
      }
      const role=user?.role||data.role||data.data?.role||"";
      const normalizedRole=String(role).trim().toLowerCase();
      if(normalizedRole==="freelancer"){navigate("/freelancer/dashboard",{replace:true});return;}
      if(normalizedRole==="client"){navigate("/client/dashboard",{replace:true});return;}
      if(normalizedRole==="admin"){navigate("/admin/dashboard",{replace:true});return;}
      navigate("/",{replace:true});
    }catch(err){
      console.error("LOGIN ERROR:",err);
      setError(err.response?.data?.message||err.response?.data?.error||err.message||"Login failed. Please check your credentials.");
    }finally{setLoading(false);}
  };

  return <main className="sf-auth-page">
    <div className="sf-auth-container">
      <div className="sf-auth-brand-row">
        <Link to="/" className="sf-auth-brand"><span>S</span><strong>Skill<span>Forge</span></strong></Link>
        <div>New to SkillForge? <Link to="/register">Create an account</Link></div>
      </div>

      <div className="sf-login-layout">
        <section className="sf-login-info">
          <div className="sf-auth-label"><Sparkles size={14}/> WELCOME BACK</div>
          <h1>Build your career.<br/><span>Work with confidence.</span></h1>
          <p>Sign in to discover projects, collaborate with clients and keep your freelance journey moving.</p>
          <div className="sf-login-benefits">
            <div><i><Users size={18}/></i><section><b>Student freelancers</b><small>Build a professional profile</small></section></div>
            <div><i><FolderKanban size={18}/></i><section><b>Real projects</b><small>Find work matching your skills</small></section></div>
            <div><i><MessageCircle size={18}/></i><section><b>Connected collaboration</b><small>Keep conversations close to your work</small></section></div>
          </div>
          <div className="sf-login-trust"><ShieldCheck size={17}/> Secure role-based access</div>
        </section>

        <section className="sf-login-card">
          <div className="sf-login-card-icon"><LockKeyhole size={20}/></div>
          <span className="sf-login-kicker">ACCOUNT LOGIN</span>
          <h2>Welcome back</h2>
          <p className="sf-login-subtitle">Enter your credentials to continue to SkillForge.</p>

          {error&&<div className="sf-login-error"><span>!</span><p>{error}</p></div>}

          <form onSubmit={handleSubmit} className="sf-login-form">
            <label>Email address<div className="sf-input-wrap"><Mail size={17}/><input id="email" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} autoComplete="email" disabled={loading}/></div></label>
            <label>Password<div className="sf-input-wrap"><LockKeyhole size={17}/><input id="password" type={showPassword?"text":"password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} autoComplete="current-password" disabled={loading}/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
            <div className="sf-login-options"><label><input type="checkbox"/> Remember me</label><Link to="/forgot-password">Forgot password?</Link></div>
            <button className="sf-login-submit" type="submit" disabled={loading}>{loading?<><Loader2 className="sf-login-spin" size={19}/> Signing in...</>:<>Sign In <ArrowRight size={18}/></>}</button>
          </form>

          <div className="sf-login-divider"><span>SECURE ACCESS</span></div>
          <div className="sf-login-security"><CheckCircle2 size={15}/> Your authentication is handled through the SkillForge API.</div>
          <p className="sf-login-register">Don’t have an account? <Link to="/register">Get Started</Link></p>
        </section>
      </div>
    </div>
  </main>;
};

export default Login;
