"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconQuestionMark,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/utils/cn";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-100 dark:from-zinc-900 dark:to-black text-gray-800 dark:text-gray-100">
      {/* Animated Background */}
      <AnimatedGridPattern
        numSquares={25}
        maxOpacity={0.2}
        duration={3}
        repeatDelay={1}
        className={cn(
          "absolute inset-0 -z-10 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center px-6"
      >
        <h1 className="text-6xl font-extrabold mb-4">
          <span className="text-blue-600">StackFlow</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-md">
          The modern Q&A platform where developers learn, share, and grow
          together.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link
            href="/questions"
            className="rounded-xl bg-blue-600 text-white px-6 py-3 font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Browse Questions
          </Link>
          <Link
            href="/ask"
            className="rounded-xl border border-blue-500 text-blue-600 px-6 py-3 font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 transition"
          >
            Ask a Question
          </Link>
        </div>

        {/* Mini Feature Icons */}
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              icon: <IconQuestionMark className="h-8 w-8 text-blue-600" />,
              label: "Learn",
            },
            {
              icon: <IconMessageCircle className="h-8 w-8 text-blue-600" />,
              label: "Share",
            },
            {
              icon: <IconUsers className="h-8 w-8 text-blue-600" />,
              label: "Connect",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} StackFlow. Built with ❤️ using Next.js +
        Appwrite
      </footer>
    </main>
  );
}
