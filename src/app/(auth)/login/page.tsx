"use client";

import { useAuthStore } from "@/store/Auth";
import React from "react";

function LoginPage() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //   1. collect the data
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    //  2. Validation
    if (!email || !password) {
      setError(() => "Email and password are required");
      return;
    }

    // 3. handle loading state and error state
    setIsLoading(() => true);
    setError(() => "");

    //  4. login => store
    const loginResponse = await login(email.toString(), password.toString());

    if (loginResponse.error) {
      setError(() => loginResponse.error!.message);
      return;
    }
    setIsLoading(() => false);
  };

  return <div>LoginPage</div>;
}

export default LoginPage;
