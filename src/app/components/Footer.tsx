"use client";

import React from "react";
import Link from "next/link";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/utils/cn";

export default function Footer() {
  const items = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms of Service", href: "/terms-of-service" },
    { title: "Questions", href: "/questions" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/20 py-12 text-center text-sm text-neutral-400">
      <div className="relative z-10 container mx-auto px-4">
        {/* Nav links */}
        <ul className="flex flex-wrap items-center justify-center gap-5 mb-4">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-white transition-colors duration-200"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Copyright */}
        <p className="text-xs">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-medium text-white">Riverpod</span>. All rights
          reserved.
        </p>
      </div>

      {/* Animated grid background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.4}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 z-0",
          "[mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]",
          "inset-y-[-50%] h-[200%] skew-y-6"
        )}
      />
    </footer>
  );
}
