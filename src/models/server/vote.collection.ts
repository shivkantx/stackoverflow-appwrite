import { Permission, Role } from "node-appwrite";
import { db, voteCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  // Create Collection
  await databases.createCollection(db, voteCollection, voteCollection, [
    Permission.read(Role.any()), // anyone can view vote counts
    Permission.create(Role.users()), // only logged-in users can vote
    Permission.update(Role.users()), // only logged-in users can update votes
    Permission.delete(Role.users()), // only logged-in users can remove votes
  ]);
  console.log("✅ Vote Collection Created");

  // Create Attributes
  await Promise.all([
    databases.createEnumAttribute(
      db,
      voteCollection,
      "type",
      ["question", "answer"],
      true
    ),
    databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
    databases.createEnumAttribute(
      db,
      voteCollection,
      "voteStatus",
      ["upvoted", "downvoted"],
      true
    ),
    databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
  ]);
  console.log("✅ Vote Attributes Created");
}
