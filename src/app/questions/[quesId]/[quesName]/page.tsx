// src/app/questions/[quesId]/[quesName]/page.tsx
import React from "react";
import Link from "next/link";
import { Query } from "node-appwrite";
import { databases, users } from "@/models/server/config";
import { storage, avatars } from "@/models/client/config";
import {
  db,
  questionCollection,
  answerCollection,
  voteCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { UserPrefs } from "@/store/Auth";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { TracingBeam } from "@/components/ui/tracing-beam";

const Page = async (props: {
  params: Promise<{ quesId: string; quesName: string }>;
}) => {
  const { quesId } = await props.params;

  // Fetch question, votes, answers, comments
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  // Safely fetch author
  let author: any;
  try {
    author = await users.get<UserPrefs>(question.authorId);
  } catch {
    author = {
      $id: "deleted",
      name: "Deleted User",
      prefs: { reputation: 0 },
    };
  }

  // Populate comment authors and answer authors
  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        try {
          const cAuthor = await users.get<UserPrefs>(comment.authorId);
          return {
            ...comment,
            author: {
              $id: cAuthor.$id,
              name: cAuthor.name,
              reputation: cAuthor.prefs.reputation,
            },
          };
        } catch {
          return {
            ...comment,
            author: { $id: "deleted", name: "Deleted User", reputation: 0 },
          };
        }
      })
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        try {
          const [aAuthor, answerComments, answerUpvotes, answerDownvotes] =
            await Promise.all([
              users.get<UserPrefs>(answer.authorId),
              databases.listDocuments(db, commentCollection, [
                Query.equal("typeId", answer.$id),
                Query.equal("type", "answer"),
                Query.orderDesc("$createdAt"),
              ]),
              databases.listDocuments(db, voteCollection, [
                Query.equal("typeId", answer.$id),
                Query.equal("type", "answer"),
                Query.equal("voteStatus", "upvoted"),
                Query.limit(1),
              ]),
              databases.listDocuments(db, voteCollection, [
                Query.equal("typeId", answer.$id),
                Query.equal("type", "answer"),
                Query.equal("voteStatus", "downvoted"),
                Query.limit(1),
              ]),
            ]);

          // Attach comments to answers
          answerComments.documents = await Promise.all(
            answerComments.documents.map(async (c) => {
              try {
                const cAuthor = await users.get<UserPrefs>(c.authorId);
                return {
                  ...c,
                  author: {
                    $id: cAuthor.$id,
                    name: cAuthor.name,
                    reputation: cAuthor.prefs.reputation,
                  },
                };
              } catch {
                return {
                  ...c,
                  author: {
                    $id: "deleted",
                    name: "Deleted User",
                    reputation: 0,
                  },
                };
              }
            })
          );

          return {
            ...answer,
            comments: answerComments,
            upvotesDocuments: answerUpvotes,
            downvotesDocuments: answerDownvotes,
            author: {
              $id: aAuthor.$id,
              name: aAuthor.name,
              reputation: aAuthor.prefs.reputation,
            },
          };
        } catch {
          return {
            ...answer,
            comments: [],
            upvotesDocuments: [],
            downvotesDocuments: [],
            author: { $id: "deleted", name: "Deleted User", reputation: 0 },
          };
        }
      })
    ),
  ]);

  return (
    <TracingBeam className="px-4 overflow-x-hidden">
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={500}
        ease={100}
        color="#ffffff"
        refresh
      />

      {/* Container: responsive */}
      <div className="relative w-full md:max-w-3xl lg:max-w-5xl md:mx-auto pb-20 pt-36">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-4">
          <div className="w-full md:w-auto">
            <h1 className="mb-1 text-3xl font-bold break-words">
              {question.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span>
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </span>
              <span>Answers {answers.total}</span>
              <span>Votes {upvotes.total + downvotes.total}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex-shrink-0">
            <Link href="/questions/ask">
              <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium lg:text-lg text-white">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>

        <hr className="my-4 border-white/40" />

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Vote/Edit/Delete */}
          <div className="flex flex-row md:flex-col shrink-0 items-center md:items-start gap-4">
            <VoteButtons
              type="question"
              id={question.$id}
              className="flex-shrink-0"
              upvotes={upvotes}
              downvotes={downvotes}
            />
            <EditQuestion
              questionId={question.$id}
              questionTitle={question.title}
              authorId={question.authorId}
            />
            <DeleteQuestion
              questionId={question.$id}
              authorId={question.authorId}
            />
          </div>

          {/* Right: Question card */}
          <div className="flex-1 w-full">
            <div className="rounded-xl shadow-md p-4 md:p-6">
              <MarkdownPreview
                className="break-words"
                source={question.content}
              />

              {question.attachmentId && (
                <img
                  src={
                    storage.getFilePreview(
                      questionAttachmentBucket,
                      question.attachmentId
                    ).href
                  }
                  alt={question.title}
                  className="mt-3 rounded-lg w-full max-w-full object-contain"
                />
              )}

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                {question.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/questions?tag=${tag}`}
                    className="inline-block rounded-lg bg-white/10 px-2 py-0.5 hover:bg-white/20"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Author info */}
              <div className="mt-4 flex items-center justify-end gap-2">
                <img
                  src={
                    author?.name
                      ? avatars.getInitials(author.name, 36, 36).href
                      : "/default-avatar.png"
                  }
                  alt={author?.name || "Deleted User"}
                  className="rounded-lg flex-shrink-0"
                />
                <div className="leading-tight text-right">
                  <Link
                    href={`/users/${author.$id}/${slugify(author.name)}`}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    {author.name}
                  </Link>
                  <p>
                    <strong>{author.prefs?.reputation ?? 0}</strong>
                  </p>
                </div>
              </div>
            </div>

            <Comments
              comments={comments}
              className="mt-4"
              type="question"
              typeId={question.$id}
            />
            <hr className="my-4 border-white/40" />
          </div>
        </div>

        <Answers answers={answers} questionId={question.$id} />
      </div>
    </TracingBeam>
  );
};

export default Page;
