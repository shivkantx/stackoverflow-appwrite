import React from "react";
import { Query } from "node-appwrite";
import { databases, users } from "@/models/server/config";
import {
  db,
  questionCollection,
  answerCollection,
  voteCollection,
} from "@/models/name";
import { UserPrefs } from "@/store/Auth";
import QuestionCard from "@/components/QuestionCard";
import Pagination from "@/components/Pagination";

const Page = async (props: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) => {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};
  const userId = params.userId;
  const page = parseInt(searchParams?.page || "1", 10);

  const queries = [
    Query.equal("authorId", userId),
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
    Query.limit(25),
  ];

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries
  );

  const enrichedQuestions = await Promise.all(
    (questions.documents || []).map(async (ques) => {
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
          name: author.name,
          reputation: author.prefs?.reputation || 0,
        },
      };
    })
  );

  return (
    <div className="px-4 md:px-6 lg:px-16 pt-12 md:pt-16 lg:pt-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Questions</h1>
        <p className="mt-1 text-gray-400">{questions.total} questions</p>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-6">
        {enrichedQuestions.map((ques) => (
          <div
            key={ques.$id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6"
          >
            <QuestionCard ques={ques} currentUser={{ $id: userId }} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8">
        <Pagination total={questions.total} limit={25} page={page} />
      </div>
    </div>
  );
};

export default Page;
