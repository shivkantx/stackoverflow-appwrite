"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";

interface QuestionCardProps {
  ques: Models.Document & {
    title: string;
    author: { $id: string; name: string; reputation: number };
    totalVotes: number;
    totalAnswers: number;
    tags: string[];
  };
  currentUser?: { $id: string };
}

const QuestionCard = ({ ques, currentUser }: QuestionCardProps) => {
  const router = useRouter();
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      await databases.deleteDocument(db, questionCollection, id);
      alert("Question deleted!");
      router.refresh(); // refresh current page to remove question
    } catch (err) {
      console.error(err);
      alert("Failed to delete question");
    }
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/5 p-4 duration-200 hover:bg-white/10 sm:flex-row"
    >
      <BorderBeam size={height} duration={12} delay={9} />

      <div className="relative shrink-0 text-sm sm:text-right">
        <p>{ques.totalVotes} votes</p>
        <p>{ques.totalAnswers} answers</p>
      </div>

      <div className="relative w-full">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="text-orange-500 duration-200 hover:text-orange-600"
        >
          <h2 className="text-xl">{ques.title}</h2>
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-white/10 px-2 py-0.5 duration-200 hover:bg-white/20"
            >
              #{tag}
            </Link>
          ))}

          <div className="ml-auto flex items-center gap-1">
            <picture>
              <img
                src={avatars.getInitials(ques.author.name, 24, 24)}
                alt={ques.author.name}
                className="rounded-lg"
              />
            </picture>
            <Link
              href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {ques.author.name}
            </Link>
            <strong>&quot;{ques.author.reputation}&quot;</strong>
          </div>

          <span>
            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
          </span>
        </div>

        {/* Edit/Delete buttons - only visible to author */}
        {currentUser?.$id === ques.author.$id && (
          <div className="mt-2 flex gap-2">
            <Link
              href={`/questions/${ques.$id}/${slugify(ques.title)}/edit`}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(ques.$id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
