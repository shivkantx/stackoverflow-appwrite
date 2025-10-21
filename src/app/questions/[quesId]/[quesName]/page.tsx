"use client";

import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { avatars } from "@/models/client/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { TracingBeam } from "@/components/ui/tracing-beam";

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ quesId: string; quesName: string }>;
}) => {
  // ✅ Await params
  const params = await paramsPromise;

  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, params.quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", params.quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", params.quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1), // optimization
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", params.quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1), // optimization
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", params.quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const author = await users.get<UserPrefs>(question.authorId);

  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        const author = await users.get<UserPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      })
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        const [author, comments, upvotes, downvotes] = await Promise.all([
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

        comments.documents = await Promise.all(
          comments.documents.map(async (comment) => {
            const author = await users.get<UserPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: author.$id,
                name: author.name,
                reputation: author.prefs.reputation,
              },
            };
          })
        );

        return {
          ...answer,
          comments,
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      })
    ),
  ]);

  return (
    <TracingBeam className="container pl-6">
      <div>{/* ... rest of your JSX remains unchanged ... */}</div>
    </TracingBeam>
  );
};

export default Page;
