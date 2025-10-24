"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import RTE from "@/components/RTE"; // default import
import { Client, Databases, ID } from "appwrite";
import env from "@/app/env";

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId);

const databases = new Databases(client);

// Replace this with your actual Appwrite collection ID
const QUESTION_COLLECTION_ID = "YOUR_QUESTION_COLLECTION_ID";

export default function AddQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Please fill in both title and content!");
      return;
    }

    setLoading(true);
    try {
      await databases.createDocument(
        "YOUR_DATABASE_ID", // <-- Appwrite database ID as string
        QUESTION_COLLECTION_ID, // Appwrite collection ID
        ID.unique(), // use Appwrite helper to generate a unique ID
        {
          title,
          content: content ?? "",
          authorId: "currentUserId", // replace with actual user id from auth
          createdAt: new Date().toISOString(),
        }
      );

      alert("Question submitted successfully!");
      router.push("/questions"); // redirect to all questions page
    } catch (err) {
      console.error(err);
      alert("Failed to submit question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-lg">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter question title"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-lg">Content</label>
          <RTE value={content} onChange={setContent} />
        </div>

        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Question"}
        </Button>
      </form>
    </div>
  );
}
