import React from "react";
import EditQues from "./EditQues"; // relative import
import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";

const Page = async (props: {
  params: Promise<{ quesId: string; quesName: string }>;
}) => {
  const params = await props.params; // ✅ await params
  const question = await databases.getDocument(
    db,
    questionCollection,
    params.quesId
  );

  return <EditQues question={question} />;
};

export default Page;
