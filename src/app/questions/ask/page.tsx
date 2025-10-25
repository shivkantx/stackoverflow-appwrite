"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ID } from "appwrite";
import { databases } from "@/models/client/config"; // ✅ correct import for client-side Appwrite usage
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and body both are required.");
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
    setError(null);

    try {
      const newQuestion = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title,
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
          authorId: user.$id,
          createdAt: new Date().toISOString(),
        }
      );

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      router.push(`/questions/${newQuestion.$id}/${slug}`);
    } catch (err: any) {
      console.error("❌ Failed to submit question:", err);
      setError(err.message || "Failed to submit question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-[100px] container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>

        {error && (
          <p className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-2">Title</label>
            <Input
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Body</label>
            <RTE
              value={content}
              onChange={(val?: string) => setContent(val ?? "")}
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Tags</label>
            <Input
              placeholder="e.g. react, nextjs, appwrite"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate tags using commas.
            </p>
          </div>

          <div className="flex justify-start">
            <ShimmerButton
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 font-medium relative overflow-hidden"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Post Your Question"}
            </ShimmerButton>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
