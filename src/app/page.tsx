import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <Image
          src="/next.svg"
          alt="Logo"
          width={40}
          height={40}
          className="dark:invert"
        />
        <h1 className="text-2xl font-bold">Stack Overflow Clone</h1>
      </div>

      {/* Main Content */}
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-center">
        Welcome to the Q&A Platform
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
        Ask questions, share knowledge, and connect with developers — powered by
        Appwrite & Next.js.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/questions"
          className="bg-black text-white dark:bg-white dark:text-black rounded-full px-6 py-3 font-medium hover:opacity-90 transition"
        >
          Browse Questions
        </Link>
        <Link
          href="/ask"
          className="border border-black dark:border-white rounded-full px-6 py-3 font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
        >
          Ask a Question
        </Link>
      </div>
    </div>
  );
}
