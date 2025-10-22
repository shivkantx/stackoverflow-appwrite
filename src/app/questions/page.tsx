"use server";

import { databases, users } from "@/models/server/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";

// Inline type for Question document
type QuestionDoc = {
  $id: string;
  $createdAt: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  totalVotes: number;
  totalAnswers: number;
  author: {
    $id: string;
    name: string;
    reputation: number;
  };
};

const Page = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
  const searchParams = await searchParamsPromise;
  searchParams.page ||= "1";

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((+searchParams.page - 1) * 25),
    Query.limit(25),
  ];

  if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
  if (searchParams.search)
    queries.push(
      Query.or([
        Query.search("title", searchParams.search),
        Query.search("content", searchParams.search),
      ])
    );

  const questionsRaw = await databases.listDocuments(
    db,
    questionCollection,
    queries
  );

  // Map Appwrite documents to QuestionDoc with author and counts
  const questions: QuestionDoc[] = await Promise.all(
    questionsRaw.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
        ]),
      ]);

      return {
        $id: ques.$id,
        $createdAt: ques.$createdAt,
        title: (ques as any).title,
        content: (ques as any).content,
        tags: (ques as any).tags || [],
        authorId: ques.authorId,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          name: author.name,
          reputation: author.prefs?.reputation || 0,
        },
      };
    })
  );

  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/questions/ask">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
              Ask a question
            </span>
          </ShimmerButton>
        </Link>
      </div>

      <div className="mb-4">
        <Search />
      </div>

      <div className="mb-4">
        <p>{questionsRaw.total} questions</p>
      </div>

      <div className="mb-4 max-w-3xl space-y-6">
        {questions.map((ques) => (
          <QuestionCard key={ques.$id} ques={ques} />
        ))}
      </div>

      <Pagination total={questionsRaw.total} limit={25} />
    </div>
  );
};

export default Page;
