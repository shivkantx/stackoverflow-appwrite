import { Permission, Role } from "node-appwrite";
import { commentCollection, db } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  // Create Collection
  await databases.createCollection(db, commentCollection, commentCollection, [
    Permission.read(Role.any()), // anyone can read comments
    Permission.create(Role.users()), // only logged-in users can comment
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
      10000,
      true
    ),
    databases.createEnumAttribute(
      db,
      commentCollection,
      "type",
      ["answer", "question"],
      true
    ),
    databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
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
