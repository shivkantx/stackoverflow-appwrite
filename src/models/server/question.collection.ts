import { IndexType, Permission, Role } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
  // create collection
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read(Role.any()), // 👈 allow everyone to read
    Permission.create(Role.users()), // only logged-in users can create
    Permission.update(Role.users()), // only logged-in users can update
    Permission.delete(Role.users()), // only logged-in users can delete
  ]);
  console.log("Question collection is created");

  // creating attributes and indexes
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      questionCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "authorId",
      50,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "tags",
      50,
      true,
      undefined,
      true
    ),
    databases.createStringAttribute(
      db,
      questionCollection,
      "attachmentId",
      50,
      false
    ),
  ]);
  console.log("Question attributes created");

  /*
  // Optional: Create full-text indexes
  await Promise.all([
    databases.createIndex(
      db,
      questionCollection,
      "title_index",
      IndexType.Fulltext,
      ["title"],
      ["asc"]
    ),
    databases.createIndex(
      db,
      questionCollection,
      "content_index",
      IndexType.Fulltext,
      ["content"],
      ["asc"]
    ),
  ]);
  */
  console.log("Question indexes created (optional)");
}
