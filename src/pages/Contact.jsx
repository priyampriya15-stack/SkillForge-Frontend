import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock3, ArrowRight } from "lucide-react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({ name:"", email:"", subject:"", message:"" });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Frontend-only contact form behavior is preserved.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form:", formData);
    alert("Thank you! Your message has been submitted.");
    setFormData({ name:"", email:"", subject:"", message:"" });
  };

  const info = [
    { icon:<Mail/>, title:"Email", value:"support@skillforge.com", note:"For general questions and support" },
    { icon:<Phone/>, title:"Phone", value:"+91 98765 43210", note:"Monday to Friday · 9 AM – 6 PM" },
    { icon:<MapPin/>, title:"Location", value:"Chennai, Tamil Nadu", note:"India" },
  ];

  return (
    <main className="sf-contact-page">
      <section className="sf-contact-hero">
        <div className="sf-page-container">
          <span className="sf-page-eyebrow">CONTACT SKILLFORGE</span>
          <h1>Let’s build better <span>opportunities.</span></h1>
          <p>Have a question, suggestion or need help? Send us a message and our team will get back to you.</p>
        </div>
      </section>

      <section className="sf-contact-section">
        <div className="sf-page-container sf-contact-grid">
          <div className="sf-contact-info">
            <div className="sf-contact-intro"><span>GET IN TOUCH</span><h2>We’re here to help.</h2><p>Whether you are a student, client or freelancer, reach out and tell us what you need.</p></div>
            {info.map((item) => <div className="sf-contact-info-card" key={item.title}><div>{item.icon}</div><section><h3>{item.title}</h3><strong>{item.value}</strong><p>{item.note}</p></section></div>)}
            <div className="sf-contact-note"><MessageCircle size={18}/><div><b>Quick response</b><p>We aim to respond to support enquiries as soon as possible.</p></div></div>
          </div>

          <div className="sf-contact-form-card">
            <div className="sf-form-title"><div><span>MESSAGE US</span><h2>Send us a message</h2></div><div className="sf-form-icon"><Send size={18}/></div></div>
            <form onSubmit={handleSubmit}>
              <div className="sf-form-row">
                <label>Name<input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required /></label>
                <label>Email<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required /></label>
              </div>
              <label>Subject<input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" required /></label>
              <label>Message<textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your message..." rows="7" required /></label>
              <button type="submit">Send Message <ArrowRight size={17}/></button>
            </form>
            <div className="sf-form-footer"><Clock3 size={15}/> Your information is used only to respond to your enquiry.</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
