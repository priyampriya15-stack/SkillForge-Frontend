import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Search, X, Menu, ArrowRight } from "lucide-react";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  const navItems = [
    { to: "/", label: "Home", end: true },
    { to: "/courses", label: "Courses" },
    { to: "/skills", label: "Skills" },
    { to: "/projects", label: "Projects" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const submitSearch = (e) => {
    e.preventDefault();
    const value = query.trim();
    navigate(value ? `/courses?search=${encodeURIComponent(value)}` : "/courses");
    setQuery("");
    setSearchOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <header className="sf-header">
      <div className="sf-header-inner">
        <Link to="/" className="sf-brand" onClick={() => setOpen(false)}>
          <span className="sf-brand-mark">S</span>
          <span className="sf-brand-copy">
            <strong>Skill<span>Forge</span></strong>
            <small>Student Freelance Platform</small>
          </span>
        </Link>

        <nav className="sf-desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sf-nav-link ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sf-header-actions">
          <div className="sf-search-wrap" ref={searchRef}>
            <button
              className="sf-icon-button"
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search courses"
            >
              <Search size={18} />
            </button>

            {searchOpen && (
              <form className="sf-search-popover" onSubmit={submitSearch}>
                <Search size={17} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses..."
                />
                <button type="submit">Search</button>
              </form>
            )}
          </div>

          <Link to="/login" className="sf-login-link">Login</Link>
          <Link to="/register" className="sf-header-cta">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>

        <button
          className="sf-mobile-menu-button"
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sf-mobile-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sf-mobile-link ${isActive ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <form className="sf-mobile-search" onSubmit={submitSearch}>
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
            />
            <button type="submit">Search</button>
          </form>

          <div className="sf-mobile-auth">
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
