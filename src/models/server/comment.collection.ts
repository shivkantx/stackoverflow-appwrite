// src/models/server/comment.collection.ts
import { Permission, Role } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  try {
    // Check if collection already exists
    await databases.getCollection(db, commentCollection);
    console.log("✅ Comment Collection already exists");
    return;
  } catch {
    // Collection doesn't exist, create it
  }

  // Create Collection
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read(Role.any()), // anyone can read comments
    Permission.create(Role.users()), // only logged-in users can create
    Permission.update(Role.users()), // only logged-in users can update
    Permission.delete(Role.users()), // only logged-in users can delete
  ]);
  console.log("✅ Comment Collection Created");

  // Create Attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      commentCollection,
      "content",
      10000, // max 10k characters
      true // required
    ),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["answer", "question"],
      true // required
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "typeId",
      50, // link to questionId or answerId
      true
    ),
    databases.createStringAttribute(
      db,
      commentCollection,
      "authorId",
      50,
      true
    ),
  ]);

  console.log("✅ Comment Attributes Created");
}
