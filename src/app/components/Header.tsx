"use client";

import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";

export default function Header() {
  const { user } = useAuthStore();

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-5 w-5 text-neutral-600 dark:text-white" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: (
        <IconWorldQuestion className="h-5 w-5 text-neutral-600 dark:text-white" />
      ),
    },
  ];

  if (user) {
    navItems.push({
      name: "Profile",
      link: `/users/${user.$id}/${slugify(user.name)}`,
      icon: (
        <IconMessage className="h-5 w-5 text-neutral-600 dark:text-white" />
      ),
    });
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo or brand */}
        <div className="text-xl font-bold text-gray-800 dark:text-white">
          StackFlow
        </div>

        {/* Navigation */}
        <FloatingNav navItems={navItems} />
      </div>
    </header>
  );
}
