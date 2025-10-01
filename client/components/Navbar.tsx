import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative pb-1 transition-colors hover:text-accent ${
      isActive ? "text-accent font-bold" : "text-white"
    }
     after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-accent
     after:transition-all after:duration-300
     ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`;

  return (
    <header
      className={`bg-primary sticky top-0 z-50 transition-shadow ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo with fallback text */}
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Colombia123 logo"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <span className="text-2xl font-display tracking-wide text-white">Colombia123</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 text-sm font-semibold">
          <li><NavLink to="/services" className={navLinkClass}>Services</NavLink></li>
          <li><NavLink to="/shop" className={navLinkClass}>Shop</NavLink></li>
          <li><NavLink to="/community" className={navLinkClass}>Community</NavLink></li>
          <li><NavLink to="/calendar" className={navLinkClass}>Calendar</NavLink></li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-sm text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-4 bg-primary px-4 pb-4 text-sm font-semibold">
          <li><NavLink to="/services" className={navLinkClass} onClick={() => setIsOpen(false)}>Services</NavLink></li>
          <li><NavLink to="/shop" className={navLinkClass} onClick={() => setIsOpen(false)}>Shop</NavLink></li>
          <li><NavLink to="/community" className={navLinkClass} onClick={() => setIsOpen(false)}>Community</NavLink></li>
          <li><NavLink to="/calendar" className={navLinkClass} onClick={() => setIsOpen(false)}>Calendar</NavLink></li>
        </ul>
      )}
    </header>
  );
}
