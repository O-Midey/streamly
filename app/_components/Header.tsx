"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { name: "Movies", href: "/movies" },
  { name: "TV Series", href: "/tv" },
  { name: "Top IMDb", href: "/top-imdb" },
];

export default function Header() {
  // const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  // const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all  duration-300 px-5 md:px-15 flex items-center justify-between ${
        scrolled
          ? "backdrop-blur-xs bg-background/70 border-b border-[#2a21217b] shadow-[0_4px_12px_rgba(255,255,255,0.08)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 py-2">
        {mounted && (
          <Image alt="logo" src={"/logo-dark.PNG"} width={100} height={16} />
        )}
      </Link>

      {/* Nav + Search + Login (Desktop) */}
      <div className="hidden lg:flex items-center gap-6">
        <nav className="flex items-center gap-6 text-md font-medium">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="relative group">
              <span className="text-foreground">{link.name}</span>
              <motion.span
                layoutId="underline"
                className="absolute left-0 -bottom-1 h-0.5 w-1/2 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
              />
            </Link>
          ))}
        </nav>

        <input
          type="text"
          placeholder="Search movies..."
          className="px-3 py-1.5 font-mono rounded-md text-md bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
        />

        <button className="text-md px-4 py-2 rounded-md bg-primary text-primary border border-border hover:opacity-90 transition">
          Log In
        </button>

        {/* {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground hover:bg-muted transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )} */}
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden backdrop-blur-md flex items-center gap-3">
        {/* {mounted && (
          <button onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )} */}
        <button onClick={toggleMobileMenu}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-background backdrop-blur-xs border-t border-muted shadow-md flex flex-col items-start gap-4 px-4 py-6 md:hidden z-40">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-base">
              {link.name}
            </Link>
          ))}

          <input
            type="text"
            placeholder="Search movies..."
            className="w-full mt-2 px-3 py-2 rounded-md text-sm bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
          />

          <button className="w-full mt-2 text-sm px-4 py-2 rounded-md bg-primary text-white">
            Log In
          </button>
        </div>
      )}
    </header>
  );
}
