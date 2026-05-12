"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";

const sections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

interface ScrollSpyNavProps {
  mobile?: boolean;
  onLinkClick?: () => void;
}

export function ScrollSpyNav({ mobile = false, onLinkClick }: ScrollSpyNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // Track which sections are intersecting and pick the topmost one
    const intersecting = new Set<string>();

    function pickActive() {
      // From top to bottom, choose the first (topmost) intersecting section
      for (const { id } of sections) {
        if (intersecting.has(id)) {
          setActiveId(id);
          return;
        }
      }
    }

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            intersecting.add(id);
          } else {
            intersecting.delete(id);
          }
          pickActive();
        },
        {
          // Section is "active" when its top third crosses the upper portion of viewport
          rootMargin: "-30% 0px -60% 0px",
          threshold: 0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  if (mobile) {
    return (
      <ul className="flex flex-col gap-1 list-none mb-5">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <NavLink
              href={isHome ? `#${id}` : `/#${id}`}
              label={label}
              isActive={isHome && activeId === id}
              onClick={onLinkClick}
              mobile
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="hidden md:flex items-center gap-7 list-none">
      {sections.map(({ id, label }) => (
        <li key={id}>
          <NavLink
            href={isHome ? `#${id}` : `/#${id}`}
            label={label}
            isActive={isHome && activeId === id}
          />
        </li>
      ))}
    </ul>
  );
}
