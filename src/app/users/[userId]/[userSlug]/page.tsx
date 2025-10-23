// src/app/users/[userId]/[userSlug]/page.tsx
import React from "react";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import NumberTicker from "@/components/magicui/number-ticker";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";

const Page = async (props: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) => {
  // ✅ Await both params and searchParams
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};

  const userId = params.userId;
  const page = parseInt(searchParams.page || "1", 10);

  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", userId),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", userId),
    ]),
  ]);

  return (
    <MagicContainer className="flex w-full flex-col gap-4 lg:flex-row">
      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-10 shadow-2xl lg:p-20">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Reputation</h2>
        </div>
        <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
          <NumberTicker value={user.prefs?.reputation || 0} />
        </p>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </MagicCard>

      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-10 shadow-2xl lg:p-20">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Questions Asked</h2>
        </div>
        <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
          <NumberTicker value={questions.total || 0} />
        </p>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </MagicCard>

      <MagicCard className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-10 shadow-2xl lg:p-20">
        <div className="absolute inset-x-4 top-4">
          <h2 className="text-xl font-medium">Answers Given</h2>
        </div>
        <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
          <NumberTicker value={answers.total || 0} />
        </p>
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </MagicCard>
    </MagicContainer>
  );
};

export default Page;
