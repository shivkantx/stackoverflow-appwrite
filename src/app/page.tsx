"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/magicui/meteors";

// Load IconCloud only on client side
const IconCloud = dynamic(() => import("@/components/magicui/icon-cloud"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <Meteors number={30} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Welcome to StackFlow
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-300">
          A vibrant community where developers ask, answer, and grow together.
          Explore projects, learn new technologies, and join discussions built
          with <span className="font-semibold text-indigo-400">Next.js</span>,{" "}
          <span className="font-semibold text-purple-400">Appwrite</span>, and{" "}
          <span className="font-semibold text-cyan-400">Tailwind CSS</span>.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg transition-transform duration-200 hover:scale-105"
            onClick={() => router.push("/questions")}
          >
            Explore Questions
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cursor-pointer rounded-2xl border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-6 text-lg transition-transform duration-200 hover:scale-105"
            onClick={() => router.push("/questions/ask")}
          >
            Ask Question
          </Button>
        </div>
      </motion.div>

      {/* Footer / Signature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute bottom-4 w-full flex flex-col items-center justify-center z-10 px-4 text-center"
      >
        <p className="text-gray-400 text-sm sm:text-base">
          Crafted with <span className="text-red-500 animate-pulse">❤️</span>{" "}
          and code by{" "}
          <span className="font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300">
            Shiv Kant
          </span>
        </p>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Powering developer communities with passion, Next.js, Appwrite &
          Tailwind CSS.
        </p>
      </motion.div>

      {/* Floating Icon Cloud */}
      <div className="absolute bottom-20 flex justify-center">
        <IconCloud
          iconSlugs={[
            "react",
            "nextdotjs",
            "typescript",
            "javascript",
            "appwrite",
            "tailwindcss",
            "vercel",
            "github",
          ]}
        />
      </div>
    </main>
  );
}
