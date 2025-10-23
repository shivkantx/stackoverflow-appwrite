import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const Page = async (props: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams?: Promise<{ page?: string }>; // <-- make it a promise
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
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-4">
        <p>{questions.total} questions</p>
      </div>

      <div className="mb-4 max-w-3xl space-y-6">
        {enrichedQuestions.map((ques) => (
          <QuestionCard
            key={ques.$id}
            ques={ques}
            currentUser={{ $id: userId }}
          />
        ))}
      </div>

      <Pagination total={questions.total} limit={25} page={page} />
    </div>
  );
};

export default Page;
