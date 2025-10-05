import { storage } from "./config";
import { questionAttachmentBucket } from "../name";
import { Permission } from "node-appwrite";

export default async function getOrCreateStorage() {
  try {
    await storage.getBucket(questionAttachmentBucket);
    console.log("Storage Connected");
  } catch (error) {
    try {
      await storage.createBucket(
        questionAttachmentBucket,
        questionAttachmentBucket,
        [
          Permission.create("users"),
          Permission.read("any"),
          Permission.read("users"),
          Permission.update("users"),
          Permission.delete("users"),
        ],
        false, // File security disabled (optional)
        undefined, // Maximum file size (optional)
        undefined, // Not using any specific file security rules here
        ["jpg", "png", "gif", "jpeg", "webp", "heic"]
      );
      console.log("Storage Created");
      console.log("Storage Connected");
    } catch (error) {
      console.error("Error creating storage:", error);
    }
  }
}
