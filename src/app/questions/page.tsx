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

const Page = async (props: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const page = searchParams.page || "1";

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((+page - 1) * 25),
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

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries
  );

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
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
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    })
  );

  return (
    <div className="flex flex-col items-center px-4 pb-20 pt-28">
      {/* Header */}
      <div className="mb-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">All Questions</h1>
        <Link href="/questions/ask">
          <ShimmerButton className="shadow-2xl px-4 py-2">
            <span className="whitespace-pre-wrap text-center text-sm font-medium lg:text-lg text-white">
              Ask a question
            </span>
          </ShimmerButton>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 w-full max-w-5xl">
        <Search />
      </div>

      {/* Total questions */}
      <div className="mb-6 w-full max-w-5xl text-gray-400 font-medium">
        {questions.total} question{questions.total !== 1 ? "s" : ""}
      </div>

      {/* Questions list */}
      <div className="mb-6 w-full max-w-5xl flex flex-col gap-6">
        {questions.documents.map((ques) => (
          <div
            key={ques.$id}
            className="bg-white/5 dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-200"
          >
            <QuestionCard ques={ques} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="w-full max-w-5xl">
        <Pagination total={questions.total} limit={25} />
      </div>
    </div>
  );
};

export default Page;
