"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { ScrollSpyNav } from "./scroll-spy-nav";
import {
  IconDownload,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-midnight/80 backdrop-blur-sm border-b border-[rgba(139,146,165,0.12)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="text-[18px] font-medium tracking-[-0.5px] text-bone hover:opacity-80 transition-opacity duration-150 shrink-0"
          aria-label="JStalin. — home"
        >
          JStalin<span className="text-plasma">.</span>
        </Link>

        {/* Desktop nav links — scroll-spy active state */}
        <ScrollSpyNav />

        {/* Desktop CTA */}
        <div className="hidden md:block shrink-0">
          <ButtonLink href="/api/cv" variant="primary" size="sm">
            <IconDownload size={15} stroke={1.5} />
            Download CV
          </ButtonLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-ash hover:text-bone transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm p-1"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <IconX size={22} stroke={1.5} />
          ) : (
            <IconMenu2 size={22} stroke={1.5} />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-midnight/95 backdrop-blur-sm border-b border-[rgba(139,146,165,0.12)] px-6 pb-6 pt-2"
        >
          {/* Mobile nav links — scroll-spy active state */}
          <ScrollSpyNav mobile onLinkClick={() => setMenuOpen(false)} />
          <ButtonLink href="/api/cv" variant="primary" size="sm" className="w-full justify-center">
            <IconDownload size={15} stroke={1.5} />
            Download CV
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
