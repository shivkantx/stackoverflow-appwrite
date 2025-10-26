import React from "react";
import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import EditQues from "./EditQues";

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  try {
    const question = await databases.getDocument(
      db,
      questionCollection,
      params.quesId
    );

    return <EditQues question={question} />;
  } catch (error) {
    console.error("❌ Failed to load question:", error);
    return (
      <div className="text-center text-red-400 mt-10">
        ⚠️ Unable to load question details. Please try again later.
      </div>
    );
  }
};

export default Page;
