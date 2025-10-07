import { answerCollection, db } from "@/models/name";
import { databases } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId: authorId,
        qquestionId: questionId,
      }
    );

    // increase author reputation
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "error creating answer",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}
