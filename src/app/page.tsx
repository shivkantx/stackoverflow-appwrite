export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-6">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="#60A5FA"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-2xl font-bold">Stack Overflow Clone</h1>
      </div>

      {/* Main Content */}
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-center">
        Welcome to the Q&A Platform
      </h2>
      <p className="text-gray-400 max-w-md text-center mb-6">
        Ask questions, share knowledge, and connect with developers — powered by
        Appwrite & Next.js.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="bg-white text-black rounded-full px-6 py-3 font-medium hover:opacity-90 transition cursor-pointer">
          Browse Questions
        </button>
        <button className="border border-white rounded-full px-6 py-3 font-medium hover:bg-white hover:text-black transition cursor-pointer">
          Ask a Question
        </button>
      </div>
    </div>
  );
}
