import { IndexType, Permission, Role } from "node-appwrite";
import { answerCollection, db } from "../name";
import { databases } from "./config";

export default async function createAnswerCollection() {
  // Create Collection
  await databases.createCollection(db, answerCollection, answerCollection, [
    Permission.read(Role.any()), // Anyone can read answers
    Permission.create(Role.users()), // Only logged-in users can create
    Permission.update(Role.users()), // Only logged-in users can update
    Permission.delete(Role.users()), // Only logged-in users can delete
  ]);
  console.log("Answer Collection Created ✅");

  // Create Attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      answerCollection,
      "content",
      10000,
      true
    ),
    databases.createStringAttribute(
      db,
      answerCollection,
      "questionId",
      50,
      true
    ),
    databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
  ]);
  console.log("Answer Attributes Created ✅");
}
