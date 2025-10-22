"use server";

import { databases } from "./config";
import { db } from "../name";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storageSetup";

/**
 * Ensures the main Appwrite database and all collections exist.
 * Creates them if missing, and sets up storage.
 */
export default async function getOrCreateDB() {
  try {
    // Check if database already exists
    await databases.get(db);
    console.log("✅ Database connected");
  } catch {
    try {
      // Create database if it doesn't exist
      console.log(`🚀 Creating new database: "${db}" ...`);
      await databases.create(db, db);
      console.log("✅ Database created successfully");

      // Create all collections in parallel
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);

      console.log("✅ Collections created successfully");

      // Setup storage bucket
      await getOrCreateStorage();

      console.log("✅ Storage connected");
      console.log("✅ Appwrite setup complete");
    } catch (error) {
      console.error("❌ Error creating database or collections:", error);
    }
  }

  return databases;
}
