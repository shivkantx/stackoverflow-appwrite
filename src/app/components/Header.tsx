"use client";

import React, { useMemo } from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconWorldQuestion } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";

export default function Header() {
  const { user } = useAuthStore();

  // ✅ Memoize nav items to avoid unnecessary re-renders
  const navItems = useMemo(() => {
    const baseItems = [
      {
        name: "Home",
        link: "/",
        icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
      },
      {
        name: "Questions",
        link: "/questions",
        icon: (
          <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />
        ),
      },
    ];

    if (user?.$id && user?.name) {
      baseItems.push({
        name: "Profile",
        link: `/users/${user.$id}/${slugify(user.name)}`,
        icon: (
          <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
        ),
      });
    }

    return baseItems;
  }, [user]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
      <FloatingNav navItems={navItems} />
    </header>
  );
}
