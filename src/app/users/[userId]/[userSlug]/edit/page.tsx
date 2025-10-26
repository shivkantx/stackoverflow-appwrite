"use client";

import React, { useEffect, useState } from "react";
import EditQues from "@/app/questions/[quesId]/[quesName]/edit/EditQues";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const doc = await databases.getDocument(
          db,
          questionCollection,
          params.quesId as string
        );
        setQuestion(doc);
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.quesId) fetchQuestion();
  }, [params.quesId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading question...
      </div>
    );

  if (!question)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Question not found.
      </div>
    );

  return <EditQues question={question} />;
}
