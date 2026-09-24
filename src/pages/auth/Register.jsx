import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, BriefcaseBusiness, Sparkles, CheckCircle2, Rocket, Users, FolderKanban } from "lucide-react";
import "./Register.css";

const Register=()=>{
  const navigate=useNavigate();
  const [formData,setFormData]=useState({name:"",email:"",phone:"",password:"",confirmPassword:"",role:"freelancer"});
  const [showPassword,setShowPassword]=useState(false),[showConfirmPassword,setShowConfirmPassword]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState("");

  const handleChange=(e)=>{const{name,value}=e.target;setFormData(prev=>({...prev,[name]:value}));setError("");setSuccess("");};

  // BACKEND CONNECTION — preserved: POST /auth/register with the same payload.
  const handleRegister=async(e)=>{
    e.preventDefault();setError("");setSuccess("");
    if(!formData.name.trim()||!formData.email.trim()||!formData.phone.trim()||!formData.password||!formData.confirmPassword){setError("Please fill in all required fields.");return;}
    if(formData.password!==formData.confirmPassword){setError("Passwords do not match.");return;}
    if(formData.password.length<6){setError("Password must be at least 6 characters.");return;}
    try{
      setLoading(true);
      const response=await fetch("http://localhost:5000/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:formData.name.trim(),email:formData.email.trim(),phone:formData.phone.trim(),password:formData.password,role:formData.role})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||"Registration failed. Please try again.");
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(()=>navigate("/login"),1500);
    }catch(err){setError(err.message||"Unable to connect to the server.");}finally{setLoading(false);}
  };

  return <main className="sf-register-page">
    <div className="sf-register-container">
      <div className="sf-register-top"><Link to="/" className="sf-register-brand"><span>S</span><strong>Skill<span>Forge</span></strong></Link><div>Already have an account? <Link to="/login">Sign in</Link></div></div>
      <div className="sf-register-layout">
        <section className="sf-register-intro">
          <div className="sf-register-kicker"><Sparkles size={14}/> GET STARTED</div>
          <h1>Build your future <span>with your skills.</span></h1>
          <p>Join SkillForge to discover projects, build your portfolio and connect with real freelance opportunities.</p>
          <div className="sf-register-benefits">
            <div><i><Rocket size={18}/></i><section><b>Find real opportunities</b><small>Discover projects that match your skills</small></section></div>
            <div><i><FolderKanban size={18}/></i><section><b>Build your portfolio</b><small>Showcase work and practical experience</small></section></div>
            <div><i><Users size={18}/></i><section><b>Connect & collaborate</b><small>Work with clients and student talent</small></section></div>
          </div>
        </section>

        <section className="sf-register-card">
          <div className="sf-register-icon"><BriefcaseBusiness size={20}/></div>
          <span className="sf-register-label">CREATE ACCOUNT</span>
          <h2>Start your SkillForge journey</h2>
          <p className="sf-register-subtitle">Create an account and get access to the platform.</p>

          {error&&<div className="sf-register-alert error">⚠️ <span>{error}</span></div>}
          {success&&<div className="sf-register-alert success"><CheckCircle2 size={17}/><span>{success}</span></div>}

          <form onSubmit={handleRegister} className="sf-register-form">
            <label>Full name<div className="sf-register-input"><User size={16}/><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required/></div></label>
            <div className="sf-register-row">
              <label>Email<div className="sf-register-input"><Mail size={16}/><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required/></div></label>
              <label>Phone<div className="sf-register-input"><Phone size={16}/><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91..." required/></div></label>
            </div>
            <div className="sf-register-row">
              <label>Password<div className="sf-register-input"><Lock size={16}/><input type={showPassword?"text":"password"} name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" required/><button type="button" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>
              <label>Confirm password<div className="sf-register-input"><Lock size={16}/><input type={showConfirmPassword?"text":"password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required/><button type="button" onClick={()=>setShowConfirmPassword(v=>!v)}>{showConfirmPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>
            </div>
            <label>Account type<select name="role" value={formData.role} onChange={handleChange}><option value="freelancer">Freelancer / Student</option><option value="client">Client</option></select></label>
            <button className="sf-register-submit" type="submit" disabled={loading}>{loading?"Creating account...":<>Create Account <ArrowRight size={17}/></>}</button>
          </form>
          <p className="sf-register-footer">By creating an account, you agree to use SkillForge responsibly and professionally.</p>
        </section>
      </div>
    </div>
  </main>;
};

export default Register;
