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
          A place where developers ask, answer, and grow together. Built with ❤️
          using Next.js, Appwrite, and Tailwind. Made by{" "}
          <strong>Shiv Kant</strong>.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            size="lg"
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
            onClick={() => router.push("/questions")}
          >
            Explore Questions
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cursor-pointer rounded-2xl border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-6 text-lg"
            onClick={() => router.push("/questions/ask")}
          >
            Ask Question
          </Button>
        </div>
      </motion.div>

      <div className="absolute bottom-10 flex justify-center">
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
