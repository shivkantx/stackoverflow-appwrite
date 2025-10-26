import Pagination from "@/components/Pagination";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async (props: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams?: Promise<{
    page?: string;
    voteStatus?: "upvoted" | "downvoted";
  }>;
}) => {
  // ✅ Await dynamic route and searchParams
  const { params, searchParams: rawSearchParams } = props;
  const awaitedParams = await params;
  const awaitedSearchParams = rawSearchParams ? await rawSearchParams : {};

  const page = parseInt(awaitedSearchParams.page || "1", 10);
  const voteStatus = awaitedSearchParams.voteStatus;

  // Build query
  const query = [
    Query.equal("votedById", awaitedParams.userId),
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
    Query.limit(25),
  ];

  if (voteStatus) query.push(Query.equal("voteStatus", voteStatus));

  // Fetch votes
  const votes = await databases.listDocuments(db, voteCollection, query);

  // Populate votes with question info
  const votesWithQuestions = await Promise.all(
    votes.documents.map(async (vote) => {
      try {
        if (vote.type === "question") {
          const question = await databases.getDocument(
            db,
            questionCollection,
            vote.typeId,
            [Query.select(["title"])]
          );
          return { ...vote, question };
        } else {
          const answer = await databases.getDocument(
            db,
            answerCollection,
            vote.typeId
          );
          const question = await databases.getDocument(
            db,
            questionCollection,
            answer.questionId,
            [Query.select(["title"])]
          );
          return { ...vote, question };
        }
      } catch (err) {
        // Handle deleted question/answer
        return {
          ...vote,
          question: { $id: "deleted", title: "Deleted question" },
        };
      }
    })
  );

  return (
    <div className="px-4 md:px-6 lg:px-16 pt-12 md:pt-16 lg:pt-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row items-start justify-between gap-4">
        <p className="text-lg font-medium">{votes.total} votes</p>
        <ul className="flex gap-2">
          {["", "upvoted", "downvoted"].map((status) => (
            <li key={status}>
              <Link
                href={`/users/${awaitedParams.userId}/${
                  awaitedParams.userSlug
                }/votes${status ? `?voteStatus=${status}` : ""}`}
                className={`block rounded-full px-3 py-1 duration-200 ${
                  voteStatus === status || (!voteStatus && status === "")
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                {status === ""
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Votes list */}
      <div className="flex flex-col gap-4 mb-6">
        {votesWithQuestions.map((vote) => (
          <div
            key={vote.$id}
            className="rounded-xl border border-white/40 p-4 md:p-6 duration-200 hover:bg-white/10"
          >
            <div className="flex justify-between items-center">
              <Link
                href={`/questions/${vote.question.$id}/${slugify(
                  vote.question.title
                )}`}
                className="text-orange-500 font-medium hover:text-orange-600"
              >
                {vote.question.title}
              </Link>
              <p className="text-sm text-gray-400">{vote.voteStatus}</p>
            </div>
            <p className="text-right text-sm text-gray-400 mt-1">
              {convertDateToRelativeTime(new Date(vote.$createdAt))}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination total={votes.total} limit={25} page={page} />
    </div>
  );
};

export default Page;
