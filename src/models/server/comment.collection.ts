import { databases } from "./config";
import { db, commentCollection } from "../name";
import { Permission } from "node-appwrite";

export default async function createCommentCollection() {
  try {
    // ✅ Create Collection
    await databases.createCollection(db, commentCollection, commentCollection, [
      Permission.create("users"),
      Permission.read("any"),
      Permission.read("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);

    console.log("✅ Comment Collection Created");

    // ✅ Create Attributes
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
      databases.createStringAttribute(
        db,
        commentCollection,
        "typeId",
        50,
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

    console.log("✅ Attributes created successfully");
  } catch (error) {
    console.error("❌ Error creating comment collection:", error);
  }
}
