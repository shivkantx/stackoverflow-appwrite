import { Permission } from "node-appwrite";
import { db, votesCollection } from "../name";
import { databases } from "./config";

export default async function createVoteCollection() {
  try {
    // ✅ Create Collection
    await databases.createCollection(db, votesCollection, votesCollection, [
      Permission.create("users"),
      Permission.read("any"),
      Permission.read("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);

    console.log("✅ Vote Collection Created");

    // ✅ Create Attributes
    await Promise.all([
      databases.createEnumAttribute(
        db,
        votesCollection,
        "type",
        ["question", "answer"],
        true
      ),
      databases.createStringAttribute(db, votesCollection, "typeId", 50, true),
      databases.createEnumAttribute(
        db,
        votesCollection,
        "voteStatus",
        ["upvoted", "downvoted"],
        true
      ),
      databases.createStringAttribute(
        db,
        votesCollection,
        "votedById",
        50,
        true
      ),
    ]);

    console.log("✅ Vote Attributes Created");
  } catch (error) {
    console.error("❌ Error creating vote collection:", error);
  }
}
