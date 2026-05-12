"use client";

import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  mobile?: boolean;
}

export function NavLink({ href, label, isActive, onClick, mobile = false }: NavLinkProps) {
  if (mobile) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={`relative block py-2.5 text-sm transition-colors duration-150 ${
          isActive ? "text-bone" : "text-ash hover:text-bone"
        }`}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="mobile-nav-underline"
            className="absolute left-0 bottom-1.5 h-[1px] w-full bg-plasma"
          />
        )}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={`relative text-sm transition-colors duration-150 pb-0.5 focus-visible:outline-2 focus-visible:outline-plasma focus-visible:outline-offset-2 rounded-sm ${
        isActive ? "text-bone" : "text-ash hover:text-bone"
      }`}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="desktop-nav-underline"
          className="absolute left-0 -bottom-0.5 h-[1px] w-full bg-plasma"
        />
      )}
    </a>
  );
}
