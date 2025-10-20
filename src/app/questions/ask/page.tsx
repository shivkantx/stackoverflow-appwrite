"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/models/client/config";
import { ID } from "appwrite";
import { db, questionCollection } from "@/models/name";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import RTE from "@/components/RTE";
import { Input } from "@/components/ui/input";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useAuthStore } from "@/store/Auth";

export default function AskQuestionPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (!tags.trim()) {
      setError("Please provide at least one tag.");
      return;
    }
    if (!user) {
      setError("You must be logged in to ask a question.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const newQuestion = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title,
          content,
          tags: tags.split(",").map((t) => t.trim()),
          authorId: user.$id, // link to logged-in user
          // removed createdAt to match your collection schema
        }
      );

      // Generate a slug for URL
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      router.push(`/questions/${newQuestion.$id}/${slug}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit the question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <Input
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Body</label>
            <RTE
              value={content}
              onChange={(val?: string) => setContent(val ?? "")}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Tags</label>
            <Input
              placeholder="Separate tags with commas"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full"
            />
          </div>

          <ShimmerButton type="submit" className="mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Post Your Question"}
          </ShimmerButton>
        </form>
      </main>
      <Footer />
    </>
  );
}
