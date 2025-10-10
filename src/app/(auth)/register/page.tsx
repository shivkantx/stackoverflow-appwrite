"use client";

import { useAuthStore } from "@/store/Auth";
import React from "react";

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    // ✅ Save response
    const response = await createAccount(
      `${firstName} ${lastName}`,
      email,
      password
    );

    if (response.error) {
      setError(response.error.message);
    } else {
      const loginResponse = await login(email, password);
      if (loginResponse.error) {
        setError(loginResponse.error.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
